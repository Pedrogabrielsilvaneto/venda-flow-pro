const { GoogleGenerativeAI } = require('@google/generative-ai');
const { catalogo } = require('./catalogo');
const { getConfig } = require('./aiSettings');
const { getUsers } = require('./userManagement');

// Inicializa Gemini se a chave estiver presente
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

async function generateAIResponse(conversa, userMessage) {
    if (!genAI) return getFallbackResponse(conversa);

    try {
        const config = getConfig();
        const baseSystemPrompt = config.systemPrompt || '';
        
        // Constrói lista de vendedores disponíveis
        const activeUsersList = getUsers()
            .filter(u => u.active)
            .map(u => `- ${u.name} (ID: ${u.id}) - ${u.role === 'ADMIN' ? 'Gerente' : 'Especialista de Vendas'}`)
            .join('\n');
        
        // Prompt do Sistema Consolidado (Gemini usa systemInstruction separada ou no início do chat)
        const finalSystemPrompt = `${baseSystemPrompt}

==============================
[SITE OFICIAL]
Link: https://pereiraacabamentos.com.br/ (Sempre recomende para ver o catálogo completo ou fotos dos produtos)

[MEMBROS DA EQUIPE PEREIRA]
A Pereira Acabamentos possui a seguinte equipe:
${activeUsersList}

Se o cliente pedir EXPRESSAMENTE para falar com um humano, com um vendedor específico (pelo nome), ou se a conversa chegar em um ponto de fechamento de venda final (cálculos exatos de frete/estoque), você deve enviar o cliente para a fila de espera.

Para fazer isso, inclua na mesma TAG invisível:
- "transferir": true
- "vendedor_id": "ID_DO_VENDEDOR" (SOMENTE se ele pediu alguém por nome, caso contrário deixe null)

Sempre dê uma mensagem de despedida/encaminhamento amigável quando fizer isso!
==============================

CATÁLOGO PARA CONSULTA RÁPIDA:
${JSON.stringify(catalogo, null, 2)}

TAG DE ATUALIZAÇÃO (INVISÍVEL):
Ao final de cada resposta, inclua [UPDATE: {"nome": "...", "interesse": "...", "transferir": false, "vendedor_id": null}] se descobriu algo novo.
Substitua "transferir": false por "transferir": true SOMENTE SE precisar mandar o cliente para a equipe humana.`;

        // Configura o modelo (Gemini 1.5 Flash para velocidade ou Pro para qualidade)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", 
            systemInstruction: finalSystemPrompt 
        });

        // Prepara histórico (Gemini usa formato específico)
        const chat = model.startChat({
            history: (conversa.historico || []).slice(-10).map(h => ({
                role: h.remetente === 'bot' ? 'model' : 'user',
                parts: [{ text: h.texto }]
            }))
        });

        const result = await chat.sendMessage(userMessage);
        let responseText = result.response.text();

        // Processamento de dados extraídos (TAG UPDATE)
        const updateMatch = responseText.match(/\[UPDATE: (.*?)\]/s);
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
                    conversa.status = 'FILA_ESPERA'; 
                    if (data.vendedor_id) {
                        conversa.assignedAgentId = data.vendedor_id;
                    }
                    conversa.historico.push({
                        remetente: 'system',
                        texto: `⚡ Sistema: Atendimento transferido para a fila humana pela Assistente Virtual.${data.vendedor_id ? ' (Direcionado p/ vendedor específico)' : ''}`
                    });
                }
                responseText = responseText.replace(/\[UPDATE: .*?\]/s, '').trim();
            } catch (e) {
                console.error('Erro ao processar JSON de Update da IA:', e);
            }
        }

        // Limpeza de negritos redundantes (O sistema prefere texto limpo para WhatsApp)
        responseText = responseText.replace(/\*\*/g, '').replace(/\*/g, '').trim();

        return responseText;
    } catch (error) {
        console.error('❌ Erro Técnico Gemini:', error);
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

