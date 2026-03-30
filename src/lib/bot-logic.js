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

    // Se tiver credenciais da Meta, tenta Meta primeiro
    if (phoneId && token && !token.includes('placeholder')) {
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
            console.log('Message sent via Meta to', to, '| msg_id:', res.data?.messages?.[0]?.id);
            return;
        } catch (error) {
            console.error('Error sending via Meta API:', error.response?.data || error.message);
            // Fallback para Bot Local se falhar
        }
    }

    // Fallback: Tenta enviar via Motor Local (WWebJS)
    console.log(`Trying Local Bot fallback for ${to}...`);
    try {
        const botUrl = process.env.BOT_INTERNAL_URL || 'http://localhost:3001';
        await axios.post(`${botUrl}/api/bot/send`, { to, text });
        console.log(`Message sent via Local Bot to ${to}`);
    } catch (error) {
        console.error('Failed to send via Local Bot fallback:', error.message);
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
    lead.lastInteraction = new Date();

    // Se um humano estiver atendendo, ignorar respostas automáticas
    if (lead.botPaused) {
        await lead.save();
        return;
    }

    // Reset se cliente digitar "menu" ou "oi" ou "olá"
    const lowerText = text.toLowerCase().trim();
    const isGreeting = ['menu', 'oi', 'olá', 'ola', 'inicio', 'início', 'restart'].includes(lowerText);
    
    if (isGreeting) {
        lead.stage = 'WELCOME';
    }

    const aiDrivenDoc = await Config.findOne({ key: 'ai_driven_bot' });
    const isAiDriven = aiDrivenDoc?.value === true;

    // Registrar mensagem do cliente no histórico
    lead.history.push({ from: 'customer', text: text });
    lead.lastInteraction = new Date();

    let replies = [];

    if (isAiDriven) {
        // MODO IA: Conversa natural (SDR Premium - Inspirado em Chronos)
        const products = await Product.find({ estoque: { $gt: 0 } }).limit(20);
        const catalogText = products.map(p => `- ${p.nome}: R$ ${p.precoPromocional || p.precoOriginal}/${p.unidade} (${p.categoria})`).join('\n');

        const systemPrompt = `Você é a ${botName}, Agente Virtual Especialista da ${businessName}.
        Sua missão é transformar interessados em clientes através de um atendimento PREMIUM, HUMANIZADO e PERSUASIVO.

        FLUXO DE ATENDIMENTO:
        1. Se for o primeiro contato e você não souber o NOME do cliente, peça-o gentilmente.
        2. Assim que souber o nome, personalize TODAS as mensagens.
        3. Pergunte o que o cliente busca (Pisos, Revestimentos, Metais, etc).
        4. Quando o cliente mencionar um interesse, apresente as opções do catálogo abaixo.
        5. NÃO peça e-mail ou telefone logo de cara, deixe a conversa fluir. Nunca peça o telefone que eles já estão usando.

        DIRETRIZES:
        - Use emojis com moderação ✨. Profissionalismo acima de tudo.
        - Se o cliente quiser falar com um humano ou fechar negócio, encaminhe para o consultor.

        CATÁLOGO EM TEMPO REAL:
        ${catalogText || 'Infelizmente estamos atualizando o estoque agora, mas temos tudo para sua obra!'}

        RESPOSTAS: Português, conciso, elegante.`;

        // Get limited history
        const contextHistory = lead.history.slice(-8).map(h => ({
            from: h.from,
            text: h.text
        }));

        const aiResponse = await generateAIResponse(contextHistory, systemPrompt);
        replies = [aiResponse];

        // Se a IA capturou o nome, atualizar o lead
        if (!lead.nomeCliente && aiResponse.toLowerCase().includes('prazer')) {
             // Lógica simples de tentativa de pegar nome se não tiver
        }
    } else {
        // MODO PADRÃO: Fluxo Premium Controlado
        switch (lead.etapaChat) {
            case 'WELCOME':
                replies = [
                    `Bem-vindo(a) à *${businessName}*! ✨`,
                    `Sou a ${botName}, sua consultora virtual. Para iniciarmos seu atendimento exclusivo, como posso te chamar?`
                ];
                lead.etapaChat = 'COLLECTING_NAME';
                break;

            case 'COLLECTING_NAME':
                lead.nomeCliente = text.trim();
                replies = [
                    `Prazer em te conhecer, *${lead.nomeCliente}*! 🤝`,
                    `O que você está procurando para sua obra ou reforma hoje?\n\n1️⃣ Porcelanatos / Pisos\n2️⃣ Metais e Louças\n3️⃣ Ver Promoções\n4️⃣ Falar com Consultor`
                ];
                lead.etapaChat = 'IDENTIFYING_NEED';
                break;

            case 'IDENTIFYING_NEED':
                if (text.includes('1') || text.toLowerCase().includes('piso') || text.toLowerCase().includes('porcela')) {
                    const materials = await Product.find({ categoria: /porcelanato|piso/i }).limit(3);
                    let msg = `Ótima escolha, ${lead.nomeCliente}! Veja alguns modelos de alto padrão em nosso estoque:\n\n`;
                    materials.forEach(m => {
                        msg += `📦 *${m.nome}*\n💰 R$ ${m.precoPromocional || m.precoOriginal}/${m.unidade}\n📝 ${m.descricao}\n\n`;
                    });
                    msg += `Deseja ver mais detalhes de algum desses ou prefere falar com um especialista?`;
                    replies = [msg];
                    lead.etapaChat = 'SHOWING_PRODUCTS';
                } else if (text.includes('4') || text.toLowerCase().includes('vendedor') || text.toLowerCase().includes('human')) {
                    replies = [
                        `Entendido! Vou avisar nossa equipe agora mesmo.`,
                        `Enquanto eles se preparam, você poderia me adiantar qual o tipo de ambiente (cozinha, banheiro, sala) que você está planejando?`
                    ];
                    lead.etapaChat = 'WAITING_HUMAN';
                    // Notificar transbordo? (Lógica a ser implementada na view)
                } else {
                    replies = [`Desculpe, não entendi. Poderia escolher uma das opções acima?`];
                }
                break;

            case 'SHOWING_PRODUCTS':
                replies = [
                    `Perfeito! Estamos separando as melhores condições para você.`,
                    `Um consultor irá assumir a conversa em instantes para finalizar seu orçamento personalizado! 🚀`
                ];
                lead.etapaChat = 'WAITING_HUMAN';
                break;

            default:
                replies = [`Em que posso ajudar? Digite *oi* para recomeçar.`];
                lead.etapaChat = 'WELCOME';
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
