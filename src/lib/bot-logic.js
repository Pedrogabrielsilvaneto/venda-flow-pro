import axios from 'axios';
import Product from '@/models/Product';
import Lead from '@/models/Lead';
import Config from '@/models/Config';

const WS_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Enviar mensagem de texto simplificada
async function sendWhatsAppMessage(to, text) {
    if (!WS_PHONE_ID || !WS_TOKEN) {
        console.error('WhatsApp credentials missing');
        return;
    }

    try {
        await axios.post(
            `https://graph.facebook.com/v18.0/${WS_PHONE_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: text },
            },
            {
                headers: { Authorization: `Bearer ${WS_TOKEN}` },
            }
        );
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    }
}

export async function handleIncomingMessage(from, text) {
    let lead = await Lead.findOne({ phoneNumber: from });
    const bizConfig = await Config.findOne({ key: 'business_name' }) || { value: 'Pereira Acabamentos' };
    const businessName = bizConfig.value;

    if (!lead) {
        lead = await Lead.create({
            phoneNumber: from,
            stage: 'WELCOME'
        });
    }

    // Registrar histórico
    lead.history.push({ from: 'customer', text });
    lead.lastInteraction = new Date();

    let replies = [];

    switch (lead.stage) {
        case 'WELCOME':
            replies = [
                `Olá! 👋 Bem-vindo(a) à *${businessName}*! 🏠✨`,
                `Para te atender melhor, me diga seu *nome*, por favor? 😊`
            ];
            lead.stage = 'WAITING_NAME';
            break;

        case 'WAITING_NAME':
            lead.name = text.trim();
            replies = [
                `Prazer, *${lead.name}*! 🤝`,
                `Qual seu e-mail para enviarmos as melhores ofertas? (Ou digite "pular")`
            ];
            lead.stage = 'WAITING_EMAIL';
            break;

        case 'WAITING_EMAIL':
            if (text.toLowerCase() !== 'pular') {
                lead.email = text.trim();
            }
            replies = [
                `Perfeito! Agora me conte, o que você está procurando hoje?`,
                `1️⃣ Porcelanatos\n2️⃣ Pisos Cerâmicos\n3️⃣ Revestimentos\n4️⃣ Ver Promoções`
            ];
            lead.stage = 'SHOWING_CATEGORIES';
            break;

        case 'SHOWING_CATEGORIES':
            // Lógica de categorias e produtos vindo do banco
            const products = await Product.find({ destaque: true }).limit(3);
            let catalogText = `🔥 *DESTAQUES DO MÊS* 🔥\n\n`;

            products.forEach((p, i) => {
                catalogText += `${i + 1}. *${p.nome}*\n💰 De R$ ${p.precoOriginal} por *R$ ${p.precoPromocional}/${p.unidade}*\n\n`;
            });

            catalogText += `Deseja um *orçamento*? Digite o número do produto.`;
            replies = [catalogText];
            lead.stage = 'BROWSING';
            break;

        case 'BROWSING':
            // Simulação de escolha de produto para orçamento
            const budgetConfig = await Config.findOne({ key: 'budget_margin' }) || { value: 10 };
            const margin = budgetConfig.value;

            replies = [
                `📐 *Simulação de Orçamento*`,
                `Como você configurou, estamos aplicando uma margem de segurança de *${margin}%*.`,
                `Me diga a metragem (m²) que você precisa!`
            ];
            lead.stage = 'WAITING_MEASUREMENT';
            break;

        default:
            replies = ["Como posso te ajudar hoje? Digite 'menu' para ver as opções."];
            lead.stage = 'SHOWING_CATEGORIES';
    }

    // Enviar respostas
    for (const msg of replies) {
        await sendWhatsAppMessage(from, msg);
        lead.history.push({ from: 'bot', text: msg });
    }

    await lead.save();
}
