require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log('--- TESTANDO gemini-flash-latest ---');
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-flash-latest',
            systemInstruction: 'Você é a Gabi.'
        });
        const result = await model.generateContent('Oi');
        console.log('SUCESSO:', result.response.text());
    } catch (e) {
        console.log('ERRO:', e.message);
    }
}
test();
