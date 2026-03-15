const {
  catalogo
} = require('./catalogo');

const Groq = require('groq-sdk');

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

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

let lastQuotaErrorTimestamp = 0;
const QUOTA_COOLDOWN_MS = 30000; // 30 segundos de pausa real

async function generateAIResponse(conversa, userMessage) {
    if (!groq) return getFallbackResponse(conversa);

    try {
        const chatHistory = conversa.historico.map(h => ({
            role: h.remetente === 'bot' ? 'assistant' : 'user',
            content: h.texto
        }));

        // Remove a mensagem atual do histórico, pois ela será enviada agor
        const historyExceptLast = chatHistory.slice(0, -1);
        const recentHistory = historyExceptLast.slice(-10); // Mantém contexto leve e focado

        const messages = [
            { role: "system", content: BEATRIZ_SYSTEM_PROMPT },
            ...recentHistory,
            { role: "user", content: userMessage }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
            max_completion_tokens: 1000,
            top_p: 0.8,
        });

        if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
            throw new Error('Resposta vazia da IA');
        }

        let responseText = chatCompletion.choices[0]?.message?.content || "";

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
        console.error('❌ Erro Técnico Groq:', errorMessage);

        if (errorMessage.includes('429')) {
            console.warn('⚠️ Limite de Rate Limit (429) atingido na Groq.');
            return `Puxa, estou processando muitas coisas super rápido aqui! 😅 Poderia aguardar um segundinho e enviar novamente? 🙏`;
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
