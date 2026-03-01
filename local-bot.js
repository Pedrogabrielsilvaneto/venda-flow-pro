import qrcode from 'qrcode';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { onMessageReceived } from './src/lib/wwebjs-events.js';

// Carregar variáveis
dotenv.config({ path: '.env.local' });
mongoose.models = {};

import './src/models/Config.js';
import './src/models/Lead.js';
import './src/models/Product.js';
import './src/models/User.js';
import './src/models/Message.js';

const app = express();
app.use(cors());
app.use(express.json());

let qrCodeDataUrl = '';
let isClientReady = false;
let globalClient = null;

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI faltando.');
    await mongoose.connect(uri);
    console.log('✅ Conectado ao MongoDB!');
}

async function startBot() {
    await connectToDatabase();

    globalClient = new Client({
        authStrategy: new LocalAuth({ clientId: 'vendaflow-bot' }),
        webVersionCache: {
            type: "remote",
            remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1012111620.html",
        },
        puppeteer: {
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // Deixa o Render injetar a env
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        }
    });

    globalClient.on('qr', async (qr) => {
        console.log('\n📱 NOVO QR CODE GERADO. DISPONÍVEL NA API.\n');
        qrCodeDataUrl = await qrcode.toDataURL(qr);
        isClientReady = false;
    });

    globalClient.on('ready', () => {
        console.log('🚀 BOT ONLINE E PRONTO (WWebJS) 🚀');
        qrCodeDataUrl = '';
        isClientReady = true;
    });

    globalClient.on('authenticated', () => {
        console.log('✅ Autenticado com sucesso!');
    });

    globalClient.on('disconnected', (reason) => {
        console.log('❌ Bot desconectado:', reason);
        isClientReady = false;
        qrCodeDataUrl = '';
        globalClient.initialize(); // Tenta reconectar
    });

    globalClient.on('message', async msg => {
        await onMessageReceived(globalClient, msg);
    });

    globalClient.initialize();
}

// API Routes
app.get('/api/bot/status', (req, res) => {
    res.json({
        ready: isClientReady,
        qrCode: qrCodeDataUrl
    });
});

app.post('/api/bot/logout', async (req, res) => {
    if (globalClient) {
        await globalClient.logout();
        isClientReady = false;
        qrCodeDataUrl = '';
        globalClient.initialize();
        res.json({ success: true, message: 'Desconectado e gerando novo QR' });
    } else {
        res.status(500).json({ error: 'Client não iniciado.' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n🤖 Servidor do Motor do Robô rodando na porta ${PORT}`);
});

startBot().catch(console.error);
