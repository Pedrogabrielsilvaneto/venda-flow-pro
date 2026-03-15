require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await genAI.listModels();
        console.log('Modelos disponíveis:');
        result.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
    } catch (e) {
        console.error('Erro ao listar modelos:', e);
    }
}

listModels();
