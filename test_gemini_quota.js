const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    console.log("Iniciando teste de cota Gemini...");
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    try {
        const result = await model.generateContent('Olá, este é um teste técnico de cota.');
        console.log('✅ SUCESSO:', result.response.text());
    } catch (e) {
        console.log('❌ ERRO:', e.message);
        if (e.message.includes('429')) {
            console.log('💡 DIAGNÓSTICO: Você atingiu o limite de requisições do plano gratuito do Gemini.');
        }
    }
}

test();
