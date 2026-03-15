const {
  catalogo
} = require('./catalogo');

const Groq = require('groq-sdk');
const { getConfig } = require('./aiSettings');
const { getUsers } = require('./userManagement');

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

        const config = getConfig();
        const baseSystemPrompt = config.systemPrompt || '';
        
        const activeUsers = getUsers().filter(u => u.active).map(u => `- ${u.name} (${u.role === 'ADMIN' ? 'Gerente' : 'Especialista de Vendas'})`);
        
        const finalSystemPrompt = `${baseSystemPrompt}

==============================
[MEMBROS DA EQUIPE PEREIRA]
A Pereira Acabamentos possui a seguinte equipe médica humana:
${getUsers().filter(u => u.active).map(u => `- ${u.name} (ID: ${u.id}) - ${u.role === 'ADMIN' ? 'Gerente' : 'Especialista de Vendas'}`).join('\n')}

Se o cliente pedir EXPRESSAMENTE para falar com um humano, com um vendedor específico (pelo nome), ou se a conversa chegar em um ponto de fechamento de venda final (cálculos exatos de frete/estoque), você deve enviar o cliente para a fila de espera.

Para fazer isso, inclua na mesma TAG invisível:
- "transferir": true
- "vendedor_id": "ID_DO_VENDEDOR" (SOMENTE se ele pediu alguém por nome, caso contrário deixe null)

Sempre dê uma mensagem de despedida/encaminhamento amigável quando fizer isso!
==============================

CATÁLOGO PARA CONSULTA:
${JSON.stringify(catalogo, null, 2)}

TAG DE ATUALIZAÇÃO (INVISÍVEL):
Ao final de cada resposta, inclua [UPDATE: {"nome": "...", "interesse": "...", "transferir": false, "vendedor_id": null}] se descobriu algo novo.
Substitua "transferir": false por "transferir": true SOMENTE SE precisar mandar o cliente para a equipe humana.`;

        const messages = [
            { role: "system", content: finalSystemPrompt },
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
                if (data.transferir === true) {
                    conversa.status = 'FILA_ESPERA'; // Manda pra fila humana nas telas do sistema
                    if (data.vendedor_id) {
                        conversa.assignedAgentId = data.vendedor_id;
                    }
                    conversa.historico.push({
                        remetente: 'system',
                        texto: `⚡ Sistema: Atendimento transferido para a fila humana pela Beatriz.${data.vendedor_id ? ' (Direcionado p/ vendedor específico)' : ''}`
                    });
                }
                responseText = responseText.replace(/\[UPDATE: .*?\]/s, '').trim();
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
