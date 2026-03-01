import Config from '../models/Config.js';

/**
 * AI Service to handle interactions with Google Gemini
 * Uses free tier (Standard)
 */
export async function generateAIResponse(messages, systemPrompt = '') {
    try {
        const apiKeyDoc = await Config.findOne({ key: 'gemini_api_key' });
        const apiKey = apiKeyDoc?.value || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('Gemini API Key missing. Please configure gemini_api_key in settings.');
            return 'Desculpe, meu cérebro de IA está desconectado no momento. Por favor, configure a chave de API.';
        }

        // Format history for Gemini
        // Gemini uses { role: 'user' | 'model', parts: [{ text: '...' }] }
        const contents = messages.map(m => ({
            role: m.from === 'customer' || m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text || m.content }]
        }));

        // Add system prompt as a user message at the beginning if provided
        if (systemPrompt) {
            contents.unshift({
                role: 'user',
                parts: [{ text: `INSTRUÇÕES DO SISTEMA (OBEDECER SEMPRE): ${systemPrompt}` }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: 'Entendido. Eu sou seu assistente de vendas especializado e seguirei todas essas instruções para atender o cliente da melhor forma possível.' }]
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            throw new Error(data.error?.message || 'Erro na API do Gemini');
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return aiText || 'Não consegui gerar uma resposta.';
    } catch (error) {
        console.error('AI Service Error:', error);
        return 'Ocorreu um erro ao processar sua solicitação com a IA.';
    }
}

export async function suggestReply(leadHistory, context = '') {
    const systemPrompt = `Você é a Lia, a assistente inteligente da VendaFlow especializada em vendas de acabamentos.
    Seu objetivo é sugerir uma resposta para o VENDEDOR enviar ao cliente.
    
    DIRETRIZES:
    1. Seja extremamente profissional, educada e focada em fechamento (venda).
    2. Se o cliente perguntou o preço, apresente os valores de forma atraente.
    3. Se o cliente está indeciso, sugira uma pergunta para entender melhor a necessidade dele.
    4. Mantenha o tom de uma consultora de luxo, mas acessível.
    5. A sugestão deve ser CURTA e pronta para enviar.
    
    Contexto da empresa: Especialista em Porcelanatos, Pisos e Revestimentos de alto padrão.
    Informações Adicionais: ${context}
    
    Gere APENAS o texto da sugestão. Não inclua "Aqui está uma sugestão" ou aspas.`;

    const history = leadHistory.slice(-10).map(h => ({
        from: h.from === 'customer' ? 'customer' : 'bot',
        text: h.text
    }));

    return generateAIResponse(history, systemPrompt);
}
