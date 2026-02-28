import Message from '../models/Message.js';
import Lead from '../models/Lead.js';
import { processMessageLogic } from './bot-logic.js';

export async function onMessageReceived(client, msg) {
    if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) return;

    const from = msg.from.split('@')[0];
    const text = msg.body || '';

    if (!text) return;

    console.log(`📩 [WWEBJS] Nova mensagem de ${from}: ${text}`);

    let lead = await Lead.findOne({ phoneNumber: from });
    if (!lead) {
        lead = await Lead.create({ phoneNumber: from, stage: 'WELCOME' });
    }

    // Registra a mensagem
    await Message.create({
        lead: lead._id,
        from: 'customer',
        text: text
    });

    const sendMsgCallback = async (toNumber, msgText) => {
        try {
            await client.sendMessage(msg.from, msgText);

            // Salva a resposta enviada pelo Bot
            await Message.create({
                lead: lead._id,
                from: 'bot',
                text: msgText
            });

        } catch (err) {
            console.error(`Erro ao enviar resposta WWebJS para ${from}:`, err);
        }
    };

    try {
        await processMessageLogic(from, text, sendMsgCallback);
    } catch (error) {
        console.error('Erro no processMessageLogic via WWebJS:', error);
    }
}
