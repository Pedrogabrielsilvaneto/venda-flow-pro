require('dotenv').config();
require('dotenv').config({ path: '.env.local' }); // Load .env.local for Next.js compatibility

const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, isJidGroup, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const mongoose = require('mongoose');

// Managers & Flow
const { processarMensagem, getAllConversas, registrarMensagem } = require('./src/conversationFlow');
const { getConfig, saveConfig, loadConfig } = require('./src/aiSettings');
const { getUsers, addUser, updateUser, deleteUser } = require('./src/userManagement');
const { deployRouter } = require('./deploy-webhook');

// Models
const BotStatus = require('./src/models/BotStatus');
const User = require('./src/models/User');
const Lead = require('./src/models/Lead');

// ============ DATABASE CONNECTION ============
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB (Command Center) Conectado');
        loadConfig(); // Forçar carga inicial das configs do DB
        
        // Auto-cria Admin se necessário
        const adminCount = await User.countDocuments({ role: 'ADMIN' });
        if (adminCount === 0) {
            const admin = new User({
                name: 'Admin Master',
                username: process.env.ADMIN_USER || 'admin',
                password: process.env.ADMIN_PASS || 'pereira2024',
                role: 'ADMIN',
                signature: 'Admin',
                active: true
            });
            await admin.save();
            console.log('👤 Admin Principal criado com sucesso.');
        }
    })
    .catch(err => console.error('❌ Erro Crítico MongoDB:', err));

async function syncStatusToDB(status, qr) {
    try {
        await BotStatus.findOneAndUpdate(
            { identifier: 'main_bot' },
            { status, qrCode: qr || '', updatedAt: new Date() },
            { upsert: true }
        );
    } catch (e) {
        console.error('❌ Falha na sincronização DB Status:', e);
    }
}

// ============ CONFIGURAÇÕES ============
const PORT = process.env.PORT || 3001;

// ============ EXPRESS & SOCKET.IO ============
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
    maxHttpBufferSize: 1e8 // Aumenta limite para imagens se necessário
});

app.use(cors());
app.use(express.json());

// Webhook de deploy automático
deployRouter(app);

// Sessões Persistentes no Sistema de Arquivos (pode evoluir pra Redis futuramente)
app.use(session({
    store: new FileStore({
        path: './sessions',
        logFn: function() {} 
    }),
    secret: process.env.SESSION_SECRET || 'pereira-command-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        secure: false 
    }
}));

// Middleware de Autenticação RBAC
function authMiddleware(req, res, next) {
    if (req.session.authenticated) {
        return next();
    }
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
    }
    res.redirect('/login');
}

// ============ ROTAS DE AUTENTICAÇÃO ============
app.get('/login', (req, res) => {
    if (req.session.authenticated) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const foundUser = await User.findOne({ 
            username: { $regex: new RegExp(`^${user}$`, 'i') },
            password: pass, // Nota: Se houver hash, comparar aqui
            active: true
        });
        
        if (foundUser) {
            req.session.authenticated = true;
            req.session.user = {
                id: foundUser._id || foundUser.id,
                name: foundUser.name,
                role: foundUser.role,
                signature: foundUser.signature
            };
            return res.json({ success: true, user: req.session.user });
        }
        res.status(401).json({ error: 'Credenciais inválidas ou acesso desativado.' });
    } catch (e) {
        res.status(500).json({ error: 'Erro interno no servidor de autenticação.' });
    }
});

app.all('/api/logout', (req, res) => {
    req.session.destroy();
    if (req.headers.accept?.includes('application/json')) {
         return res.json({ success: true });
    }
    res.redirect('/login');
});

// ============ ROTAS DE USUÁRIO & EQUIPE ============
app.get('/api/me', authMiddleware, (req, res) => {
    res.json(req.session.user);
});

app.get('/api/users', authMiddleware, async (req, res) => {
    const users = await getUsers();
    const safeUsers = users.map(u => ({
        id: u._id || u.id, name: u.name, username: u.username, 
        role: u.role, signature: u.signature, active: u.active
    }));
    res.json(safeUsers);
});

app.post('/api/users', authMiddleware, async (req, res) => {
    if (req.session.user.role !== 'ADMIN') return res.status(403).json({error: 'Acesso negado'});
    try {
        const newUser = await addUser(req.body);
        res.json(newUser);
    } catch(e) {
        res.status(400).json({error: e.message});
    }
});

app.put('/api/users/:id', authMiddleware, async (req, res) => {
    if (req.session.user.role !== 'ADMIN') return res.status(403).json({error: 'Acesso negado'});
    const updated = await updateUser(req.params.id, req.body);
    res.json(updated);
});

app.delete('/api/users/:id', authMiddleware, async (req, res) => {
    if (req.session.user.role !== 'ADMIN') return res.status(403).json({error: 'Acesso negado'});
    try {
        await deleteUser(req.params.id);
        res.json({success: true});
    } catch(e) {
        res.status(400).json({error: e.message});
    }
});

// ============ ROTAS DA IA ============
app.get('/api/settings', authMiddleware, (req, res) => {
    res.json(getConfig());
});

app.post('/api/settings', authMiddleware, async (req, res) => {
    const { botName, systemPrompt } = req.body;
    await saveConfig({ botName, systemPrompt });
    res.json({ success: true });
});

// Arquivos Estáticos Protegidos
app.use('/style.css', express.static(path.join(__dirname, 'public', 'style.css')));
app.get('/', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.static(path.join(__dirname, 'public'))); 

// ============ INTERAÇÃO DASHBOARD (SOCKET) ============
io.on('connection', (socket) => {
    console.log('🖥️ Dashboard conectado via Socket.IO');
    
    socket.on('send_message', async (data) => {
        const { whatsappJid, signedContent, agentId } = data;
        
        if (clientSocket) {
            // Humano assume controle
            await Lead.findOneAndUpdate(
                { phoneNumber: whatsappJid },
                { 
                    botPaused: true, 
                    assignedTo: agentId, 
                    updatedAt: new Date(),
                    $push: { history: { from: 'agent', text: signedContent, timestamp: new Date(), agentId } }
                }
            );

            await clientSocket.sendMessage(whatsappJid, { text: signedContent });
            io.emit('conversas_update', await getAllConversas());
        }
    });

    socket.on('transfer_chat', async (data) => {
        const { whatsappJid, targetAgentId, targetAgentName } = data;
        
        await Lead.findOneAndUpdate(
            { phoneNumber: whatsappJid },
            { 
                assignedTo: targetAgentId, 
                botPaused: true, // Garante que fica pausado pro humano
                etapaChat: 'WAITING_HUMAN',
                $push: { history: { from: 'system', text: `🔄 Atendimento transferido para ${targetAgentName}.`, timestamp: new Date() } }
            }
        );

        io.emit('conversas_update', await getAllConversas());

        io.emit('notification', {
            type: 'info',
            title: '🔄 Nova Transferência',
            message: `Você recebeu um atendimento de um cliente.`,
            targetAgentId: targetAgentId,
            numero: whatsappJid
        });
    });

    socket.on('finalize_chat', async (data) => {
        const { whatsappJid } = data;
        
        await Lead.findOneAndUpdate(
            { phoneNumber: whatsappJid },
            { 
                etapaChat: 'WELCOME', // Volta ao início para próxima interação
                botPaused: false,
                $push: { history: { from: 'system', text: `✅ Atendimento finalizado.`, timestamp: new Date() } }
            }
        );

        io.emit('conversas_update', await getAllConversas());
    });

    socket.on('disconnect', () => {
        console.log('🖥️ Dashboard desconectado');
    });
});

// ============ SISTEMA DE ALERTAS (FILA) ============
setInterval(async () => {
    const agora = new Date();
    const todas = await getAllConversas();
    const naFila = todas.filter(c => c.status === 'FILA_ESPERA');
    
    naFila.forEach(conversa => {
        const ultimaAtividade = new Date(conversa.ultimaMensagem);
        const minutosEsperando = (agora - ultimaAtividade) / 1000 / 60;
        
        if (minutosEsperando >= 3) { // Aumentado para 3 min por polidez
            io.emit('notification', {
                type: 'warning',
                title: '⚠️ Cliente aguardando!',
                message: `${conversa.nome || 'Um cliente'} espera atendimento humano há ${Math.floor(minutosEsperando)} min.`,
                targetAgentId: conversa.assignedAgentId,
                numero: conversa.numero
            });
        }
    });
}, 60000);

// ============ WHATSAPP CLIENT (BAILEYS) ============
let whatsappStatus = 'disconnected';
let qrCodeData = null;
let clientSocket = null;

async function connectToWhatsApp() {
    console.log('🔄 Iniciando motor WhatsApp...');
    whatsappStatus = 'connecting';
    qrCodeData = null;
    io.emit('status', { status: 'connecting' });
    
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
    
    let version = [2, 3000, 1015901307]; 
    try {
        const latest = await fetchLatestBaileysVersion();
        version = latest.version;
    } catch (err) {}
    
    const socket = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }), 
        browser: Browsers.ubuntu('Chrome'), 
        markOnlineOnConnect: true,
        printQRInTerminal: true,
    });

    clientSocket = socket;

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrCodeData = qr;
            syncStatusToDB('qr_ready', qr);
            io.emit('qr', qr);
            io.emit('status', { status: 'qr_ready' });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            whatsappStatus = 'disconnected';
            syncStatusToDB('disconnected', '');
            io.emit('status', { status: 'disconnected' });
            
            if(shouldReconnect) {
                setTimeout(connectToWhatsApp, 3000);
            } else {
                console.log('❌ Logout detectado. Aguardando ação manual.');
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Conectado — Prontidão Premium');
            whatsappStatus = 'connected';
            qrCodeData = null;
            syncStatusToDB('connected', '');
            io.emit('status', { status: 'connected' });
        }
    });

    const userProcessingState = new Map();

    socket.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const numero = msg.key.remoteJid;
        if (isJidGroup(numero) || numero.includes('@g.us')) return;

        const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        if (!texto) return;

        if (!userProcessingState.has(numero)) {
            userProcessingState.set(numero, { isProcessing: false, buffer: [], timer: null });
        }
        const state = userProcessingState.get(numero);

        if (state.isProcessing) return;

        state.buffer.push(texto);
        if (state.timer) clearTimeout(state.timer);

        state.timer = setTimeout(async () => {
            state.timer = null;
            if (state.buffer.length === 0) return;

            const textoCompleto = state.buffer.join('\n');
            state.buffer = []; 

            try {
                state.isProcessing = true;
                await socket.sendPresenceUpdate('composing', numero);

                const respostas = await processarMensagem(numero, textoCompleto);

                for (let i = 0; i < respostas.length; i++) {
                    const delay = Math.min(Math.max(respostas[i].length * 15 + 1500, 2000), 4500);
                    await new Promise(r => setTimeout(r, delay));
                    
                    await socket.sendMessage(numero, { text: respostas[i] });
                    if (i < respostas.length - 1) await socket.sendPresenceUpdate('composing', numero);
                }

                await socket.sendPresenceUpdate('available', numero);

                io.emit('nova_mensagem', {
                    numero,
                    texto: textoCompleto,
                    respostas,
                    timestamp: new Date(),
                });

                io.emit('conversas_update', await getAllConversas());

            } catch (error) {
                console.error('❌ Erro Processamento:', error);
            } finally {
                state.isProcessing = false;
            }
        }, 3500); 
    });
}

// ============ API REST ============
app.get('/api/status', (req, res) => {
    res.json({
        status: whatsappStatus,
        qr: qrCodeData,
    });
});

app.get('/api/conversas', authMiddleware, async (req, res) => {
    const all = await getAllConversas();
    const user = req.session.user;

    if (user.role === 'ADMIN') {
        return res.json(all);
    } else {
        const filtered = all.filter(c => 
            c.status === 'ATENDIMENTO_IA' || 
            c.status === 'FILA_ESPERA' || 
            c.assignedAgentId === user.id ||
            c.assignedAgentId === user._id?.toString()
        );
        return res.json(filtered);
    }
});

app.post('/api/whatsapp/restart', authMiddleware, (req, res) => {
    qrCodeData = null;
    whatsappStatus = 'disconnected';
    io.emit('status', { status: 'disconnected' });
    connectToWhatsApp().then(() => {
        res.json({ success: true });
    }).catch(() => res.status(500).json({ error: 'Falha ao reiniciar' }));
});

app.get('/api/stats', authMiddleware, async (req, res) => {
    const todas = await getAllConversas();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const conversasHoje = todas.filter(c => new Date(c.updatedAt) >= hoje).length;
    const comNome = todas.filter(c => c.nome && c.nome !== '...').length;
    const comEmail = todas.filter(c => c.email && c.email !== 'Não informado').length;

    res.json({
        totalConversas: todas.length,
        conversasHoje,
        leadsComNome: comNome,
        leadsComEmail: comEmail,
        taxaCaptacao: todas.length > 0 ? ((comNome / todas.length) * 100).toFixed(1) : 0,
    });
});

// ============ INICIALIZAÇÃO ============
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║   🌩️ Pereira Command Center - Online       ║
║   📊 Painel: http://localhost:${PORT}/login       ║
╚══════════════════════════════════════════════╝
  `);
    connectToWhatsApp();
});
