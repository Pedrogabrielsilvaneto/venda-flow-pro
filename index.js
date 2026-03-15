require('dotenv').config();
const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, isJidGroup, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const { processarMensagem, getAllConversas, conversas } = require('./src/conversationFlow');
const { getConfig, saveConfig } = require('./src/aiSettings');
const { getUsers, addUser, updateUser, deleteUser } = require('./src/userManagement');

// ============ CONFIGURAÇÕES ============
const PORT = process.env.PORT || 3000;

// ============ EXPRESS & SOCKET.IO ============
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

// Sessões Persistentes
app.use(session({
    store: new FileStore({
        path: './sessions',
        logFn: function() {} // Silencia logs de debug
    }),
    secret: process.env.SESSION_SECRET || 'pereira-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        secure: false // true se usar HTTPS
    }
}));

// Middleware de Autenticação
function authMiddleware(req, res, next) {
    if (req.session.authenticated) {
        return next();
    }
    // Para chamadas de API, retornamos 401 em vez de redirecionar
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

app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;
    const allUsers = getUsers();
    const foundUser = allUsers.find(u => u.username === user && u.password === pass && u.active);
    
    if (foundUser) {
        req.session.authenticated = true;
        req.session.user = {
            id: foundUser.id,
            name: foundUser.name,
            role: foundUser.role,
            signature: foundUser.signature
        };
        return res.json({ success: true, user: req.session.user });
    }
    res.status(401).json({ error: 'Credenciais inválidas ou usuário inativo' });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// ============ ROTAS DE USUÁRIO (SESSÃO & EQUIPE) ============
app.get('/api/me', authMiddleware, (req, res) => {
    res.json(req.session.user);
});

app.get('/api/users', authMiddleware, (req, res) => {
    // Apenas listamos sem senhas
    const users = getUsers().map(u => ({
        id: u.id, name: u.name, username: u.username, 
        role: u.role, signature: u.signature, active: u.active
    }));
    res.json(users);
});

app.post('/api/users', authMiddleware, (req, res) => {
    if (req.session.user.role !== 'ADMIN') return res.status(403).json({error: 'Acesso negado'});
    try {
        const newUser = addUser(req.body);
        res.json(newUser);
    } catch(e) {
        res.status(400).json({error: e.message});
    }
});

app.put('/api/users/:id', authMiddleware, (req, res) => {
    if (req.session.user.role !== 'ADMIN') return res.status(403).json({error: 'Acesso negado'});
    const updated = updateUser(req.params.id, req.body);
    res.json(updated);
});

app.delete('/api/users/:id', authMiddleware, (req, res) => {
    if (req.session.user.role !== 'ADMIN') return res.status(403).json({error: 'Acesso negado'});
    try {
        deleteUser(req.params.id);
        res.json({success: true});
    } catch(e) {
        res.status(400).json({error: e.message});
    }
});

// ============ ROTAS DA IA ============
app.get('/api/settings', authMiddleware, (req, res) => {
    res.json(getConfig());
});

app.post('/api/settings', authMiddleware, (req, res) => {
    const { botName, systemPrompt } = req.body;
    saveConfig({ botName, systemPrompt });
    res.json({ success: true });
});

// Proteger arquivos estáticos (exceto login e css)
app.use('/style.css', express.static(path.join(__dirname, 'public', 'style.css')));
app.get('/', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.static(path.join(__dirname, 'public'))); // Fallback para outros arquivos

// ============ INTERAÇÃO DASHBOARD (SOCKET) ============
io.on('connection', (socket) => {
    console.log('🖥️  Dashboard conectado');
    
    socket.on('send_message', async (data) => {
        const { chatId, whatsappJid, signedContent, agentId } = data;
        const conversa = conversas.get(whatsappJid);
        
        if (conversa && clientSocket) {
            // Ao enviar mensagem, o humano assume o controle
            conversa.status = 'EM_ATENDIMENTO';
            conversa.assignedAgentId = agentId;

            conversa.historico.push({
                remetente: 'agent',
                agentId: agentId,
                texto: signedContent,
                timestamp: new Date()
            });

            await clientSocket.sendMessage(whatsappJid, { text: signedContent });
            io.emit('conversas_update', getAllConversas());
        }
    });

    socket.on('transfer_chat', async (data) => {
        const { whatsappJid, targetAgentId, targetAgentName } = data;
        const conversa = conversas.get(whatsappJid);

        if (conversa) {
            conversa.assignedAgentId = targetAgentId;
            conversa.status = 'EM_ATENDIMENTO';
            
            const systemMsg = `🔄 Atendimento transferido para ${targetAgentName}.`;
            conversa.historico.push({
                remetente: 'system',
                texto: systemMsg,
                timestamp: new Date()
            });

            io.emit('conversas_update', getAllConversas());
        }
    });

    socket.on('disconnect', () => {
        console.log('🖥️  Dashboard desconectado');
    });
});

// ============ WHATSAPP CLIENT ============
let whatsappStatus = 'disconnected';
let qrCodeData = null;
let clientSocket = null;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);
    
    const socket = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }), // Desliga logs pesados
        browser: Browsers.ubuntu('Chrome'), // Ubuntu Chrome para Baileys
        markOnlineOnConnect: true,
    });

    clientSocket = socket;

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrCodeData = qr;
            whatsappStatus = 'qr_ready';
            io.emit('qr', qr);
            io.emit('status', { status: 'qr_ready' });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ Conexão fechada. Motivo:', lastDisconnect?.error, 'Reconectando:', shouldReconnect);
            whatsappStatus = 'disconnected';
            io.emit('status', { status: 'disconnected' });
            
            if(shouldReconnect) {
                setTimeout(connectToWhatsApp, 3000);
            } else {
                console.log('❌ LOGOUT DETECTADO! Apague a pasta baileys_auth_info e reinicie.');
            }
        } else if (connection === 'open') {
            console.log('✅ Baileys Conectado com Sucesso! Muito mais rápido ⚡');
            whatsappStatus = 'connected';
            qrCodeData = null;
            io.emit('status', { status: 'connected' });
        }
    });

    // Controle de processamento por usuário para evitar loops e múltiplas chamadas simultâneas
    const userProcessingState = new Map();

    // ============ MENSAGENS RECEBIDAS ============
    socket.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const numero = msg.key.remoteJid;
        
        // Ignorar grupos
        if (isJidGroup(numero) || numero.includes('@g.us')) return;

        // Pega texto normal ou texto de mensagem com botões/mídia
        const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        if (!texto) return;

        // Inicializa estado se não existir
        if (!userProcessingState.has(numero)) {
            userProcessingState.set(numero, { isProcessing: false, buffer: [], timer: null });
        }
        const state = userProcessingState.get(numero);

        // SE O BOT JÁ ESTÁ PENSANDO: Retorna e não faz nada, ou acumula num buffer futuro (aqui preferi ignorar para simplificar se enviar 30 mensagens)
        if (state.isProcessing) {
            console.log(`⏳ Já processando para ${numero}. Ignorando entrada: "${texto}"`);
            return;
        }

        // Adiciona a mensagem atual no buffer e reinicia o timer
        state.buffer.push(texto);
        if (state.timer) {
            clearTimeout(state.timer);
        }

        // Aguarda 3.5 segundos sem novas mensagens antes de enviar para a IA
        state.timer = setTimeout(async () => {
            state.timer = null;
            
            if (state.buffer.length === 0) return;

            const textoCompleto = state.buffer.join('\n');
            state.buffer = []; // Limpa o buffer para o próximo ciclo

            console.log(`📩 Mensagem processada de ${numero}:\n${textoCompleto}`);

            try {
                // Ativa a trava
                state.isProcessing = true;

                // Enviar indicativo de "digitando..."
                await socket.presenceSubscribe(numero);
                await socket.sendPresenceUpdate('composing', numero);

                const respostas = await processarMensagem(numero, textoCompleto);

                for (let i = 0; i < respostas.length; i++) {
                    // Delay artificial humano
                    const delay = Math.min(Math.max(respostas[i].length * 20 + (Math.random() * 1000), 2000), 5000);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    
                    await socket.sendMessage(numero, { text: respostas[i] });
                    console.log(`📤 Resposta enviada para ${numero}`);
                    
                    if (i < respostas.length - 1) {
                        await socket.sendPresenceUpdate('composing', numero);
                    }
                }

                // Para de digitar
                await socket.sendPresenceUpdate('available', numero);

                io.emit('nova_mensagem', {
                    numero,
                    texto: textoCompleto,
                    respostas,
                    timestamp: new Date(),
                });

                io.emit('conversas_update', getAllConversas());

            } catch (error) {
                console.error('❌ Erro no processamento principal:', error);
                // Mensagem de segurança caso tudo falhe no fluxo
                await socket.sendMessage(numero, { 
                    text: "Puxa, tive um pequeno probleminha de conexão 😅 Poderia me enviar a mensagem novamente?" 
                });
            } finally {
                // DESBLOQUEIA SEMPRE no final para permitir novas mensagens
                state.isProcessing = false;
            }
        }, 3500); // 3.5 Segundos de Debounce
    });
}

// ============ API REST (Protegida) ============
app.get('/api/status', authMiddleware, (req, res) => {
    res.json({
        status: whatsappStatus,
        qr: qrCodeData,
        totalConversas: conversas.size,
    });
});

app.get('/api/conversas', authMiddleware, (req, res) => {
    const all = getAllConversas();
    const user = req.session.user;

    if (user.role === 'ADMIN') {
        return res.json(all);
    } else {
        // VENDEDOR: Vê apenas o que está na fila (ATENDIMENTO_IA ou FILA_ESPERA) 
        // ou o que já está atribuído a ele
        const filtered = all.filter(c => 
            c.status === 'ATENDIMENTO_IA' || 
            c.status === 'FILA_ESPERA' || 
            c.assignedAgentId === user.id
        );
        return res.json(filtered);
    }
});

app.get('/api/conversas/:numero', authMiddleware, (req, res) => {
    const conversa = conversas.get(req.params.numero);
    if (!conversa) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    res.json(conversa);
});

app.get('/api/stats', authMiddleware, (req, res) => {
    const todasConversas = getAllConversas();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const conversasHoje = todasConversas.filter(
        (c) => new Date(c.criadoEm) >= hoje
    ).length;

    const comNome = todasConversas.filter((c) => c.nome).length;
    const comEmail = todasConversas.filter(
        (c) => c.email && c.email !== 'Não informado'
    ).length;

    res.json({
        totalConversas: todasConversas.length,
        conversasHoje,
        leadsComNome: comNome,
        leadsComEmail: comEmail,
        taxaCaptacao:
            todasConversas.length > 0
                ? ((comNome / todasConversas.length) * 100).toFixed(1)
                : 0,
    });
});

// ============ SOCKET.IO ============
io.on('connection', (socket) => {
    console.log('🖥️  Dashboard conectado');

    socket.emit('status', { status: whatsappStatus });
    if (qrCodeData) {
        socket.emit('qr', qrCodeData);
    }
    socket.emit('conversas_update', getAllConversas());

    socket.on('disconnect', () => {
        console.log('🖥️  Dashboard desconectado');
    });
});

// ============ INICIALIZAÇÃO ============
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║   🌩️ Pereira AI SDR - Painel Premium        ║
║                                              ║
║   📊 Login: http://localhost:${PORT}/login       ║
║   👥 Sistema de Equipe: Ativo                ║
║                                              ║
╚══════════════════════════════════════════════╝
  `);

    connectToWhatsApp();
});
