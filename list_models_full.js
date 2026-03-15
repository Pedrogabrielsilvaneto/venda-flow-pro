const https = require('https');
require('dotenv').config();
const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log('--- TODOS OS MODELOS ---');
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(m.name);
                    }
                });
            } else {
                console.log('ERRO:', json);
            }
        } catch (e) {
            console.log('FALHA:', data);
        }
    });
});
