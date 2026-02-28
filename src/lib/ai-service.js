import Config from '../models/Config';

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
    const systemPrompt = `Você é o assistente de um vendedor na Pereira Acabamentos. 
    Seu objetivo é sugerir uma resposta curta, profissional e persuasiva para o cliente (lead).
    Contexto da empresa: Loja de pisos, porcelanatos e acabamentos.
    Contexto adicional: ${context}
    Gere apenas a sugestão de texto para o vendedor enviar.`;

    // Filter relevant history
    const history = leadHistory.slice(-10).map(h => ({
        from: h.from === 'customer' ? 'customer' : 'bot',
        text: h.text
    }));

    return generateAIResponse(history, systemPrompt);
}
