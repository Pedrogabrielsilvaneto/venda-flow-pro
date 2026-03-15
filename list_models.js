const https = require('https');
require('dotenv').config();
const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        const models = json.models
            .filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name);
        console.log('MODELOS_GC:', models.join('|'));
    });
});
