const Lead = require('./models/Lead');
const {
    getProdutosEmPromocao,
    getProdutosDestaque,
    formatarListaProdutos,
    getCategoriasDisponiveis,
    identificarCategoriaDoAnuncio,
    formatarProduto,
    catalogo,
    categoriaNomes,
} = require('./catalogo');

const { generateAIResponse } = require('./aiAssistant');
const { getConfig } = require('./aiSettings');

// Cache em memória para acesso ultrarrápido (opcional)
let conversasLocal = new Map();

async function syncConversasFromDB() {
    try {
        const leads = await Lead.find({}).lean();
        conversasLocal = new Map(leads.map(l => [l.phoneNumber, {
            ...l,
            numero: l.phoneNumber,
            nome: l.nomeCliente,
            status: l.botPaused ? 'EM_ATENDIMENTO' : (l.etapaChat === 'WAITING_HUMAN' ? 'FILA_ESPERA' : 'ATENDIMENTO_IA'),
            assignedAgentId: l.assignedTo,
            historico: l.history
        }]));
        console.log(`📦 ${conversasLocal.size} conversas sincronizadas do MongoDB.`);
    } catch (e) {
        console.error("Erro ao sincronizar conversas do DB:", e);
    }
}

async function getConversa(numero) {
    let lead = await Lead.findOne({ phoneNumber: numero });
    
    if (!lead) {
        lead = new Lead({
            phoneNumber: numero,
            etapaChat: 'WELCOME',
            botPaused: false
        });
        await lead.save();
    }
    
    const obj = lead.toObject();
    return {
        ...obj,
        numero: obj.phoneNumber,
        nome: obj.nomeCliente,
        status: obj.botPaused ? 'EM_ATENDIMENTO' : (obj.etapaChat === 'WAITING_HUMAN' ? 'FILA_ESPERA' : 'ATENDIMENTO_IA'),
        assignedAgentId: obj.assignedTo,
        historico: obj.history
    };
}

async function getAllConversas() {
    try {
        const leads = await Lead.find({}).sort({ updatedAt: -1 }).limit(100);
        return leads.map(l => {
            const obj = l.toObject();
            return {
                ...obj,
                numero: obj.phoneNumber,
                nome: obj.nomeCliente,
                status: obj.botPaused ? 'EM_ATENDIMENTO' : (obj.etapaChat === 'WAITING_HUMAN' ? 'FILA_ESPERA' : 'ATENDIMENTO_IA'),
                assignedAgentId: obj.assignedTo,
                historico: (obj.history || []).map(h => ({
                    ...h,
                    remetente: h.from === 'customer' ? 'cliente' : (h.from === 'bot' ? 'bot' : (h.from === 'agent' ? 'agent' : 'system')),
                    texto: h.text
                })),
                ultimaMensagem: obj.history.length > 0 ? obj.history[obj.history.length - 1].timestamp : obj.updatedAt
            };
        });
    } catch (e) {
        console.error("Erro ao carregar todas as conversas:", e);
        return [];
    }
}

async function registrarMensagem(numero, remetente, texto) {
    try {
        await Lead.findOneAndUpdate(
            { phoneNumber: numero },
            { 
                $push: { history: { from: remetente, text: texto, timestamp: new Date() } },
                $set: { updatedAt: new Date() }
            },
            { upsert: true }
        );
    } catch (e) {
        console.error("Erro ao registrar mensagem no DB:", e);
    }
}

async function processarMensagem(numero, mensagem) {
    const conversa = await getConversa(numero);
    const texto = mensagem.trim();

    await registrarMensagem(numero, 'customer', texto);

    // Se a conversa NÃO está com a IA, verificamos se o cliente chamou a IA pelo nome
    if (conversa.status !== 'ATENDIMENTO_IA' && conversa.status !== 'FINALIZADO') {
        const config = getConfig();
        const nomeIA = (config.botName || 'Beatriz').toLowerCase();
        const msgLower = texto.toLowerCase();
        
        const aiMatch = new RegExp(`\\b${nomeIA}\\b`, 'i').test(msgLower);
        
        if (aiMatch) {
            await Lead.findOneAndUpdate(
                { phoneNumber: numero },
                { botPaused: false, etapaChat: 'WELCOME' }
            );
            await registrarMensagem(numero, 'bot', `🔄 Atendimento retomado pela IA (${config.botName || 'Beatriz'}) a pedido do cliente.`);
        } else {
            return []; 
        }
    }

    if (texto.toLowerCase() === '/reiniciar' || texto.toLowerCase() === '/reset') {
        await Lead.findOneAndDelete({ phoneNumber: numero });
        return ['🔄 Sistema de IA reiniciado. Envie um "Olá" para começar.'];
    }

    const respostaIA = await generateAIResponse(conversa, texto);
    
    const isErrorMessage = respostaIA.includes("pequena pausinha para respirar") || 
                           respostaIA.includes("probleminha técnico");
                           
    if (!isErrorMessage) {
        await registrarMensagem(numero, 'bot', respostaIA);
        
        // Sincroniza dados extraídos (nome, interesse, etc.)
        await Lead.findOneAndUpdate(
            { phoneNumber: numero },
            { 
                nomeCliente: conversa.nome, 
                email: conversa.email,
                etapaChat: conversa.status === 'FILA_ESPERA' ? 'WAITING_HUMAN' : 'IDENTIFYING_NEED',
                botPaused: conversa.status === 'EM_ATENDIMENTO',
                assignedTo: conversa.assignedAgentId
            }
        );
    }

    return [respostaIA];
}

// Inicialização
syncConversasFromDB();

module.exports = {
    processarMensagem,
    getConversa,
    getAllConversas,
    registrarMensagem,
    saveConversas: () => {}, // No longer needed
    conversas: { get: (n) => ({ numero: n }) }, // Mock para compatibilidade
};
