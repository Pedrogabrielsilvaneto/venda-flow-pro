import axios from 'axios';
import Product from '../models/Product.js';
import Lead from '../models/Lead.js';
import Config from '../models/Config.js';
import Analysis from '../models/Analysis.js';
import { generateAIResponse } from './ai-service.js';

// Get credentials from DB (with env fallback)
async function getCredentials() {
    try {
        const [phoneIdDoc, tokenDoc] = await Promise.all([
            Config.findOne({ key: 'whatsapp_phone_number_id' }),
            Config.findOne({ key: 'whatsapp_access_token' }),
        ]);
        return {
            phoneId: phoneIdDoc?.value || process.env.WHATSAPP_PHONE_NUMBER_ID,
            token: tokenDoc?.value || process.env.WHATSAPP_ACCESS_TOKEN,
        };
    } catch {
        return {
            phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID,
            token: process.env.WHATSAPP_ACCESS_TOKEN,
        };
    }
}

// Enviar mensagem de texto (Exportado para painel manual poder usar)
export async function sendWhatsAppMessage(to, text) {
    const { phoneId, token } = await getCredentials();

    if (!phoneId || !token) {
        console.error('WhatsApp credentials missing');
        return;
    }

    try {
        const res = await axios.post(
            `https://graph.facebook.com/v22.0/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: text },
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('Message sent to', to, '| msg_id:', res.data?.messages?.[0]?.id);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    }
}

export async function processMessageLogic(from, text, sendMsgCallback) {
    let lead = await Lead.findOne({ phoneNumber: from });

    const companyDoc = await Config.findOne({ key: 'company_name' });
    const botDoc = await Config.findOne({ key: 'bot_name' });
    const businessName = companyDoc?.value || 'Pereira Acabamentos';
    const botName = botDoc?.value || 'Lia';

    if (!lead) {
        lead = await Lead.create({
            phoneNumber: from,
            stage: 'WELCOME'
        });
    }

    // Registrar histórico
    lead.history.push({ from: 'customer', text });
    lead.lastInteraction = new Date();

    // Se um humano estiver atendendo, ignorar respostas automáticas
    if (lead.botPaused) {
        await lead.save();
        return;
    }

    // Reset se cliente digitar "menu" ou "oi" ou "olá"
    const lowerText = text.toLowerCase().trim();
    if (['menu', 'oi', 'olá', 'ola', 'inicio', 'início', 'restart'].includes(lowerText)) {
        lead.stage = 'WELCOME';
    }

    const aiDrivenDoc = await Config.findOne({ key: 'ai_driven_bot' });
    const isAiDriven = aiDrivenDoc?.value === true;

    let replies = [];

    if (isAiDriven) {
        // MODO IA: Conversa natural
        const systemPrompt = `Você é a *${botName}*, assistente virtual inteligente da *${businessName}*.
        Seu objetivo é ser um vendedor consultivo gentil e persuasivo.
        A empresa atua com Pisos, Porcelanatos, Revestimentos e Acabamentos em geral.
        
        INSTRUÇÕES DE FLUXO:
        1. Se for o primeiro contato, peça o nome do cliente.
        2. Tente entender o que ele precisa (m² de piso, tipo de material, etc).
        3. Fale sobre as qualidades dos materiais (durabilidade, estética).
        4. Sempre tente levar o cliente a pedir um orçamento ou vir à loja.
        5. Use Emojis para ser amigável.
        6. Respostas curtas e diretas ao ponto.
        
        HISTÓRIO RECENTE: Use o histórico abaixo para manter o contexto.`;

        // Get limited history for context
        const contextHistory = lead.history.slice(-10).map(h => ({
            from: h.from,
            text: h.text
        }));

        const aiResponse = await generateAIResponse(contextHistory, systemPrompt);
        replies = [aiResponse];

        // Registrar análise para métricas
        await Analysis.create({
            leadId: lead._id,
            type: 'AI_CHAT',
            input: text,
            output: aiResponse,
            converted: aiResponse.toLowerCase().includes('orçamento') || aiResponse.toLowerCase().includes('metragem')
        });

        // Atualiza estágio baseado na conversa (heurística simples)
        if (aiResponse.toLowerCase().includes('orçamento')) lead.stage = 'BROWSING';
    } else {
        // MODO PADRÃO: Fluxo fixo (State Machine)
        switch (lead.stage) {
            case 'WELCOME':
                replies = [
                    `Olá! 👋 Bem-vindo(a) à *${businessName}*! 🏠✨`,
                    `Sou a *${botName}*, sua assistente virtual. Para te atender melhor, me diga seu *nome*, por favor? 😊`
                ];
                lead.stage = 'WAITING_NAME';
                break;

            case 'WAITING_NAME':
                lead.name = text.trim();
                replies = [
                    `Prazer, *${lead.name}*! 🤝`,
                    `Qual seu *e-mail* para enviarmos nossos melhores orçamentos? (Ou digite *"pular"*)`
                ];
                lead.stage = 'WAITING_EMAIL';
                break;

            case 'WAITING_EMAIL':
                if (lowerText !== 'pular') {
                    lead.email = text.trim();
                }
                replies = [
                    `Perfeito! O que você está procurando hoje? 😊\n\n1️⃣ Porcelanatos\n2️⃣ Pisos Cerâmicos\n3️⃣ Revestimentos\n4️⃣ Ver Promoções\n\n_Digite o número da opção desejada._`
                ];
                lead.stage = 'SHOWING_CATEGORIES';
                break;

            case 'SHOWING_CATEGORIES': {
                const products = await Product.find({ destaque: true }).limit(3);
                if (products.length === 0) {
                    replies = [
                        `🔍 Ainda estamos cadastrando nosso catálogo!\n\nEm breve teremos produtos incríveis aqui. Fale com nossa equipe pelo *19 9989-4281* para ver todas as opções. 😊`
                    ];
                    lead.stage = 'WAITING_NAME'; // reset for next time
                } else {
                    let catalogText = `🔥 *DESTAQUES DO MÊS* 🔥\n\n`;
                    products.forEach((p, i) => {
                        catalogText += `${i + 1}. *${p.nome}*\n💰 De R$ ${p.precoOriginal} por *R$ ${p.precoPromocional}/${p.unidade}*\n\n`;
                    });
                    catalogText += `Deseja um *orçamento*? Digite o número do produto.`;
                    replies = [catalogText];
                    lead.stage = 'BROWSING';
                }
                break;
            }

            case 'BROWSING': {
                const budgetConfig = await Config.findOne({ key: 'budget_margin' });
                const margin = budgetConfig?.value || 10;
                replies = [
                    `📐 *Simulação de Orçamento*\n\nÓtima escolha! Aplicamos uma margem de segurança de *${margin}%* para evitar desperdício.\n\nMe diga a *metragem em m²* que você precisa cobrir:`
                ];
                lead.stage = 'WAITING_MEASUREMENT';
                break;
            }

            case 'WAITING_MEASUREMENT': {
                const area = parseFloat(text.replace(',', '.'));
                if (isNaN(area) || area <= 0) {
                    replies = [`Por favor, informe apenas o número da metragem. Ex: *25*`];
                } else {
                    const budgetConfig = await Config.findOne({ key: 'budget_margin' });
                    const margin = parseFloat(budgetConfig?.value || 10);
                    const areaComMargem = (area * (1 + margin / 100)).toFixed(2);
                    replies = [
                        `✅ *Resumo do Orçamento*\n\n📦 Área informada: *${area} m²*\n➕ Margem de segurança (${margin}%): *${(area * margin / 100).toFixed(2)} m²*\n📐 *Total a comprar: ${areaComMargem} m²*\n\n💬 Nosso time irá preparar o orçamento completo e entrar em contato em breve!\n\nPosso te ajudar em mais alguma coisa? Digite *menu* para recomeçar. 😊`
                    ];
                    lead.stage = 'DONE';
                }
                break;
            }

            default:
                replies = [`Como posso te ajudar? Digite *menu* para ver as opções. 😊`];
                lead.stage = 'SHOWING_CATEGORIES';
        }
    }


    // Enviar respostas
    for (const msg of replies) {
        if (sendMsgCallback) {
            await sendMsgCallback(from, msg);
        } else {
            await sendWhatsAppMessage(from, msg);
        }
        lead.history.push({ from: 'bot', text: msg });
    }

    await lead.save();
}

export async function handleIncomingMessage(from, text) {
    return processMessageLogic(from, text, sendWhatsAppMessage);
}
