const {
  catalogo
} = require('./catalogo');

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

/**
 * PROMPT MESTRE: BEATRIZ - A CONSULTORA DE SONHOS DA PEREIRA ACABAMENTOS
 */
const BEATRIZ_SYSTEM_PROMPT = `
Você é a Beatriz, assistente especialista em ambientes e acabamentos da Pereira Acabamentos. Você não é um bot engessado; você é uma consultora de sonhos, empática, levemente informal, porém extremamente profissional e conhecedora do catálogo.

ESTILO E TOM DE VOZ (HUMANIZAÇÃO WHATSAPP):
1. FORMATAÇÃO: NUNCA use negrito (**texto**) ou itálico (*texto*). Use apenas texto puro e emojis.
2. PARÁGRAFOS: Use parágrafos curtos. Quebre a mensagem em ideias separadas se necessário.
3. LINGUAGEM: Use "você". Seja calorosa e acolhedora.
4. EMOJIS: Use com moderação para dar tom de voz (😊, ✨, 📐, 🏠).
5. EMPATIA EM OBRAS: Se o cliente citar reforma ou obra, seja empática: "Obra dá trabalho, mas o resultado final vale cada esforço!".
6. FINALIZAÇÃO: Termine sempre com uma pergunta curta para manter a conversa fluindo.

SOBRE A PEREIRA ACABAMENTOS:
- Nicho: Pisos, porcelanatos, revestimentos especiais, louças e metais de alto padrão.
- Diferencial: Curadoria de design, qualidade excepcional, atendimento consultivo.
- Missão: Transformar obras em lares sofisticados.

TRATAMENTO DE ASSUNTOS FORA DE TÓPICO (ROBUSTEZ):
- Se o cliente fugir do assunto (ex: perguntar sobre futebol, notícias, ou coisas aleatórias), não se perca.
- Responda de forma leve e educada, fazendo uma ponte de volta para a Pereira Acabamentos.
- Exemplo: "Isso é interessante! Mas confesso que meu coração bate mais forte por decoração e acabamentos. ✨ Por falar nisso, como está o seu projeto?"
- NUNCA trave ou deixe de responder. Se o cliente insistir muito em algo impossível, seja educada: "Eu adoraria saber mais, mas meu sistema é focado em transformar casas em sonhos aqui na Pereira. 😊 O que mais posso fazer pelo seu ambiente?"
- Se o cliente enviar algo sem sentido ou incompreensível, pergunte educadamente para ele repetir.

FLUXO DE ATENDIMENTO:
1. ACOLHIMENTO: Saudação calorosa.
2. SONDAGEM: Entenda se ele busca reforma, construção ou apenas inspiração.
3. ENCANTAMENTO: Use autoridade técnica de forma leve.
4. FECHAMENTO DE LEAD (CRUCIAL): Não dê preços exatos finais. Peça: Nome, Cidade e Telefone para orçamento técnico preciso.

RESTRITIVOS:
- NÃO dê orçamentos finais ou promessas de prazo de entrega.
- NÃO critique a concorrência.
- NÃO invente modelos; cite os clássicos.
- NUNCA use a palavra "Indefinido" para se referir ao nome do cliente. Se não souber o nome, use [UPDATE: {"nome": "..."}].

CATÁLOGO PARA CONSULTA:
${JSON.stringify(catalogo, null, 2)}

TAG DE ATUALIZAÇÃO (INVISÍVEL):
Ao final de cada resposta, inclua [UPDATE: {"nome": "...", "interesse": "..."}] se descobriu algo novo.
`;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Configurações de segurança para evitar que a IA bloqueie respostas inofensivas mas fora de tópico
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

let lastQuotaErrorTimestamp = 0;
const QUOTA_COOLDOWN_MS = 30000; // 30 segundos de pausa real

async function generateAIResponse(conversa, userMessage) {
    if (!genAI) return getFallbackResponse(conversa);

    // Verifica se estamos em cooldown global de cota
    const now = Date.now();
    if (now - lastQuotaErrorTimestamp < QUOTA_COOLDOWN_MS) {
        console.warn(`⏳ Pulando chamada Gemini devido a cooldown global (${Math.round((QUOTA_COOLDOWN_MS - (now - lastQuotaErrorTimestamp))/1000)}s restantes)`);
        return `Puxa, estou recebendo muitas mensagens agora e meu sistema deu uma pequena pausinha para respirar! 😅\n\nPoderia me enviar sua mensagem novamente em uns 30 segundos? 🙏`;
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            systemInstruction: BEATRIZ_SYSTEM_PROMPT,
            safetySettings
        });

        const chatHistory = conversa.historico.map(h => ({
            role: h.remetente === 'bot' ? 'model' : 'user',
            parts: [{ text: h.texto }],
        }));

        // Remove a mensagem atual do histórico, pois sendMessage já vai adicioná-la
        const historyExceptLast = chatHistory.slice(0, -1);

        // Pega as últimas 10 mensagens
        let recentHistory = historyExceptLast.slice(-10);

        // Mesclagem de mensagens consecutivas com o mesmo papel
        let mergedHistory = [];
        for (let msg of recentHistory) {
            if (mergedHistory.length > 0 && mergedHistory[mergedHistory.length - 1].role === msg.role) {
                mergedHistory[mergedHistory.length - 1].parts[0].text += "\n" + msg.parts[0].text;
            } else {
                mergedHistory.push({ role: msg.role, parts: [{ text: msg.parts[0].text }] });
            }
        }

        // A API exige que o histórico comece com 'user'.
        if (mergedHistory.length > 0 && mergedHistory[0].role !== 'user') {
            mergedHistory = mergedHistory.slice(1);
        }

        const chat = model.startChat({
            history: mergedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.8,
                topP: 0.8
            },
        });

        const result = await chat.sendMessage(userMessage);

        // Verifica se a resposta foi bloqueada
        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            throw new Error('Resposta bloqueada pelos filtros de segurança ou vazia');
        }

        let responseText = result.response.text();

        if (!responseText || responseText.trim() === "") {
            throw new Error('Resposta vazia da IA');
        }

        // Processamento de dados extraídos
        const updateMatch = responseText.match(/\[UPDATE: (.*?)\]/);
        if (updateMatch) {
            try {
                const data = JSON.parse(updateMatch[1]);
                if (data.nome && data.nome !== "..." && data.nome.toLowerCase() !== 'indefinido') {
                    conversa.nome = data.nome;
                }
                if (data.interesse && data.interesse !== "...") {
                    conversa.interesse = data.interesse;
                }
                responseText = responseText.replace(/\[UPDATE: .*?\]/, '').trim();
            } catch (e) {}
        }

        // Limpeza de possíveis formatações markdown
        responseText = responseText.replace(/\*\*/g, '').replace(/\*/g, '').trim();

        return responseText;
    } catch (error) {
        const errorMessage = error.message || '';
        console.error('❌ Erro Técnico Gemini:', errorMessage);

        if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
            console.warn('⚠️ Limite de cota (429) atingido no Gemini. Ativando cooldown global.');
            lastQuotaErrorTimestamp = Date.now(); // Ativa o cooldown
            return `Puxa, estou recebendo muitas mensagens agora e meu sistema deu uma pequena pausinha para respirar! 😅\n\nPoderia me enviar sua mensagem novamente em uns 30 segundos? 🙏`;
        }

        return getFallbackResponse(conversa);
    }
}

function getFallbackResponse(conversa) {
    const fallbacks = [
        `Oi! Me desculpa, tive um probleminha técnico aqui, mas já estou de volta! 😊 Como eu posso te ajudar a escolher o acabamento perfeito hoje?`,
        `Puxa, deu uma piscadinha no meu sistema! ✨ Mas me conta, como está o planejamento do seu ambiente? Quero muito te ajudar a deixar ele lindo!`,
        `Que projeto incrível você está planejando! 🏠 Me conta um pouquinho mais sobre o que você imagina para o seu espaço, estou aqui para te auxiliar!`,
        `Às vezes a tecnologia prega peças, mas meu foco continua no seu ambiente! 🛠️ Qual desses modelos você gostou mais ou o que você busca especificamente?`
    ];

    // Nome limpo para evitar "Indefinido"
    const nomeValido = conversa.nome &&
                       conversa.nome.toLowerCase() !== 'indefinido' &&
                       conversa.nome !== '...' &&
                       conversa.nome.trim() !== '';

    if (nomeValido) {
        return `Puxa, ${conversa.nome}, meu sistema deu uma piscadinha aqui, mas meu entusiasmo continua o mesmo! ✨ O que mais você pode me contar sobre o seu projeto?`;
    }

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

module.exports = { generateAIResponse };
