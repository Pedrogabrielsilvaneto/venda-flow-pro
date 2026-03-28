const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
    console.log("Iniciando teste da API Groq...");
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Olá, me diga seu nome.' }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
        });
        console.log('✅ SUCESSO:', chatCompletion.choices[0]?.message?.content);
    } catch (e) {
        console.log('❌ ERRO:', e.message);
    }
}

test();
