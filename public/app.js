/**
 * ============================================================
 *  Pereira Acabamentos — Painel de Atendimento v2.0
 *  app.js — Orquestrador Principal (Frontend)
 * ============================================================
 * 
 *  Handles: Navigation, Socket.IO, RBAC visibility,
 *  Chat interface, Kanban tabs, and real-time updates.
 * ============================================================
 */

// ============ GLOBALS ============
const socket = io();

// Simulated current user (in production, fetched from backend session)
let currentUser = {
  id: 'admin-001',
  name: 'Admin',
  role: 'ADMIN', // 'ADMIN' or 'VENDEDOR'
  signature: 'Admin',
};

// State
let allChats = [];
let selectedChatId = null;
let currentTab = 'fila';
let qrCodeInstance = null;
let whatsappStatus = 'disconnected';

// ============ DOM REFERENCES ============
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTabs();
  initChatActions();
  initRBAC();
  initSocket();
  loadMockData();
  initMiscUI();
});

// ============ RBAC VISIBILITY ============
function initRBAC() {
  const isAdmin = currentUser.role === 'ADMIN';
  
  // Hide/show admin-only nav items
  $$('.nav-admin-only').forEach(el => {
    el.style.display = isAdmin ? 'flex' : 'none';
  });
  
  // Hide/show admin-only tabs
  $$('.tab-admin-only').forEach(el => {
    el.style.display = isAdmin ? 'flex' : 'none';
  });
  
  // Hide/show admin-only buttons
  $$('.admin-only-btn').forEach(el => {
    el.style.display = isAdmin ? 'flex' : 'none';
  });
  
  // Update user profile
  $('user-name').textContent = currentUser.name;
  $('user-role').textContent = isAdmin ? 'Administrador' : 'Vendedor';
  $('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
  
  // Update signature preview
  const roleTag = currentUser.role === 'ADMIN' ? ' (Gerente)' : '';
  $('sig-text').textContent = `*${currentUser.signature}${roleTag}:*`;
}

// ============ NAVIGATION ============
function initNavigation() {
  $$('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      if (!section) return;
      
      // Update nav active state
      $$('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      // Update page title
      const titles = {
        'dashboard': 'Dashboard',
        'atendimentos': 'Atendimentos',
        'equipe': 'Gestão de Equipe',
        'config-ia': 'Configurações da IA',
        'conexao': 'Conexão WhatsApp',
      };
      $('page-title').textContent = titles[section] || 'Dashboard';
      
      // Show/hide sections
      $$('.content-section').forEach(s => s.classList.remove('active'));
      const sectionEl = $(`section-${section}`);
      if (sectionEl) sectionEl.classList.add('active');
      
      // Close sidebar on mobile
      $('sidebar').classList.remove('open');
    });
  });
  
  // Mobile menu toggle
  $('menu-toggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('open');
  });
  
  // Logout
  $('btn-logout').addEventListener('click', () => {
    window.location.href = '/api/logout';
  });
}

// ============ TABS ============
function initTabs() {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderContactList();
    });
  });
}

// ============ CHAT ACTIONS ============
function initChatActions() {
  // Send message
  $('btn-send').addEventListener('click', sendMessage);
  
  $('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Auto-resize textarea
  $('chat-input').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  
  // Transfer button
  $('btn-transfer').addEventListener('click', () => {
    $('modal-transfer').classList.remove('hidden');
    renderAgentList();
  });
  
  // Modal close
  $('modal-transfer-close').addEventListener('click', () => {
    $('modal-transfer').classList.add('hidden');
  });
  
  // Takeover button (Admin only)
  $('btn-takeover').addEventListener('click', () => {
    if (!selectedChatId) return;
    const chat = allChats.find(c => c.id === selectedChatId);
    if (chat) {
      chat.status = 'EM_ATENDIMENTO';
      chat.assignedAgentId = currentUser.id;
      chat.assignedAgentName = currentUser.name;
      
      // Add system message
      chat.messages.push({
        id: genId(),
        sender: 'SYSTEM',
        content: `⚡ ${currentUser.name} (Gerente) assumiu este atendimento.`,
        timestamp: new Date().toISOString(),
      });
      
      showToast('success', `Você assumiu o atendimento de ${chat.customerName}.`);
      renderContactList();
      renderChatMessages(chat);
      updateBadges();
    }
  });
  
  // Close/finalize chat
  $('btn-close-chat').addEventListener('click', () => {
    if (!selectedChatId) return;
    const chat = allChats.find(c => c.id === selectedChatId);
    if (chat) {
      chat.status = 'FINALIZADO';
      chat.closedAt = new Date().toISOString();
      
      chat.messages.push({
        id: genId(),
        sender: 'SYSTEM',
        content: `✅ Atendimento finalizado por ${currentUser.name}.`,
        timestamp: new Date().toISOString(),
      });
      
      showToast('success', 'Atendimento finalizado com sucesso.');
      renderContactList();
      renderChatMessages(chat);
      updateBadges();
    }
  });
  
  // Search
  $('search-contacts').addEventListener('input', () => {
    renderContactList();
  });
}

// ============ SEND MESSAGE ============
function sendMessage() {
  const input = $('chat-input');
  const text = input.value.trim();
  if (!text || !selectedChatId) return;
  
  const chat = allChats.find(c => c.id === selectedChatId);
  if (!chat) return;
  
  // Build signed message
  const roleTag = currentUser.role === 'ADMIN' ? ' (Gerente)' : '';
  const signedText = `*${currentUser.signature}${roleTag}:* ${text}`;
  
  // Add message to chat
  const newMsg = {
    id: genId(),
    sender: 'AGENT',
    agentId: currentUser.id,
    agentName: currentUser.name,
    content: text,
    signedContent: signedText,
    timestamp: new Date().toISOString(),
  };
  
  chat.messages.push(newMsg);
  
  // If chat was in fila, move to em_atendimento
  if (chat.status === 'FILA_ESPERA') {
    chat.status = 'EM_ATENDIMENTO';
    chat.assignedAgentId = currentUser.id;
    chat.assignedAgentName = currentUser.name;
    
    chat.messages.push({
      id: genId(),
      sender: 'SYSTEM',
      content: `👤 ${currentUser.name} assumiu este atendimento.`,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Clear input
  input.value = '';
  input.style.height = 'auto';
  
  // Re-render
  renderChatMessages(chat);
  renderContactList();
  updateBadges();
  
  // Emit via Socket.IO to backend
  socket.emit('send_message', {
    chatId: chat.id,
    whatsappJid: chat.whatsappJid,
    signedContent: signedText,
    agentId: currentUser.id,
  });
}

// ============ RENDER CONTACT LIST ============
function renderContactList() {
  const list = $('contact-list');
  const search = $('search-contacts').value.toLowerCase();
  
  // Filter chats by tab
  let filtered = allChats.filter(chat => {
    switch (currentTab) {
      case 'fila':
        return chat.status === 'FILA_ESPERA';
      case 'meus':
        if (currentUser.role === 'ADMIN') {
          return chat.status === 'EM_ATENDIMENTO';
        }
        return chat.status === 'EM_ATENDIMENTO' && chat.assignedAgentId === currentUser.id;
      case 'supervisao':
        return chat.status === 'ATENDIMENTO_IA';
      case 'finalizados':
        if (currentUser.role === 'ADMIN') {
          return chat.status === 'FINALIZADO';
        }
        return chat.status === 'FINALIZADO' && chat.assignedAgentId === currentUser.id;
      default:
        return false;
    }
  });
  
  // Apply search
  if (search) {
    filtered = filtered.filter(c =>
      (c.customerName || '').toLowerCase().includes(search) ||
      (c.customerPhone || '').includes(search)
    );
  }
  
  // Sort by last message time
  filtered.sort((a, b) => {
    const aTime = a.messages.length ? new Date(a.messages[a.messages.length - 1].timestamp) : new Date(a.createdAt);
    const bTime = b.messages.length ? new Date(b.messages[b.messages.length - 1].timestamp) : new Date(b.createdAt);
    return bTime - aTime;
  });
  
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-contacts">
        <span>📋</span>
        <p>Nenhum atendimento nesta aba</p>
      </div>`;
    return;
  }
  
  list.innerHTML = filtered.map(chat => {
    const lastMsg = chat.messages.length ? chat.messages[chat.messages.length - 1] : null;
    const preview = lastMsg ? truncate(lastMsg.content, 40) : 'Sem mensagens';
    const time = lastMsg ? formatTime(lastMsg.timestamp) : '';
    const initial = (chat.customerName || '?').charAt(0).toUpperCase();
    const statusClass = getStatusAvatarClass(chat.status);
    const pillClass = getStatusPillClass(chat.status);
    const pillText = getStatusText(chat.status);
    const isActive = chat.id === selectedChatId;
    const unread = chat.unreadCount || 0;
    
    return `
      <div class="contact-item ${isActive ? 'active' : ''}" data-chat-id="${chat.id}" onclick="selectChat('${chat.id}')">
        <div class="contact-avatar ${statusClass}">${initial}</div>
        <div class="contact-info">
          <span class="contact-name">${chat.customerName || 'Cliente desconhecido'}</span>
          <span class="contact-preview">${preview}</span>
          <span class="contact-status-pill ${pillClass}">${pillText}</span>
        </div>
        <div class="contact-meta">
          <span class="contact-time">${time}</span>
          ${unread > 0 ? `<span class="contact-unread">${unread}</span>` : ''}
        </div>
      </div>`;
  }).join('');
}

// ============ SELECT CHAT ============
function selectChat(chatId) {
  selectedChatId = chatId;
  const chat = allChats.find(c => c.id === chatId);
  
  if (!chat) return;
  
  // Reset unread
  chat.unreadCount = 0;
  
  // Show chat area
  $('chat-placeholder').classList.add('hidden');
  $('chat-active').classList.remove('hidden');
  
  // Update header
  $('chat-customer-name').textContent = chat.customerName || 'Cliente desconhecido';
  $('chat-avatar').textContent = (chat.customerName || '?').charAt(0).toUpperCase();
  
  const badge = $('chat-status-badge');
  badge.textContent = getStatusText(chat.status);
  badge.className = `chat-status-badge ${getStatusPillClass(chat.status)}`;
  
  // Show/hide input bar based on status
  const inputBar = $('chat-input-bar');
  if (chat.status === 'ATENDIMENTO_IA' && currentUser.role !== 'ADMIN') {
    inputBar.style.display = 'none';
  } else if (chat.status === 'FINALIZADO') {
    inputBar.style.display = 'none';
  } else {
    inputBar.style.display = 'block';
  }
  
  // Show/hide takeover button  
  const takeoverBtn = $('btn-takeover');
  if (currentUser.role === 'ADMIN' && (chat.status === 'ATENDIMENTO_IA' || chat.status === 'FILA_ESPERA')) {
    takeoverBtn.style.display = 'flex';
  } else {
    takeoverBtn.style.display = 'none';
  }
  
  // Render messages
  renderChatMessages(chat);
  renderContactList();
}

// ============ RENDER CHAT MESSAGES ============
function renderChatMessages(chat) {
  const container = $('chat-messages');
  
  if (!chat.messages || chat.messages.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>Nenhuma mensagem ainda</p>
      </div>`;
    return;
  }
  
  container.innerHTML = chat.messages.map(msg => {
    const bubbleClass = `msg-${msg.sender.toLowerCase()}`;
    const senderInfo = getSenderInfo(msg);
    const time = formatTime(msg.timestamp);
    
    if (msg.sender === 'SYSTEM') {
      return `
        <div class="message-bubble msg-system">
          <div class="msg-content">${msg.content}</div>
          <div class="msg-time">${time}</div>
        </div>`;
    }
    
    return `
      <div class="message-bubble ${bubbleClass}">
        <div class="msg-sender ${senderInfo.senderClass}">
          <span class="msg-sender-icon">${senderInfo.icon}</span>
          <span>${senderInfo.label}</span>
        </div>
        <div class="msg-content">${escapeHtml(msg.content)}</div>
        <div class="msg-time">${time}</div>
      </div>`;
  }).join('');
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// ============ SENDER INFO ============
function getSenderInfo(msg) {
  switch (msg.sender) {
    case 'CUSTOMER':
      return { icon: '👤', label: 'Cliente', senderClass: 'sender-customer' };
    case 'AI':
      return { icon: '🤖', label: 'Beatriz (IA)', senderClass: 'sender-ai' };
    case 'AGENT':
      return { icon: '👨‍💼', label: msg.agentName || 'Atendente', senderClass: 'sender-agent' };
    default:
      return { icon: 'ℹ️', label: 'Sistema', senderClass: '' };
  }
}

// ============ RENDER AGENT LIST (Modal) ============
function renderAgentList() {
  const list = $('agent-list');
  // Mock agents - in production from API
  const agents = [
    { id: 'v1', name: 'João Silva', role: 'VENDEDOR', signature: 'João' },
    { id: 'v2', name: 'Maria Santos', role: 'VENDEDOR', signature: 'Maria' },
    { id: 'v3', name: 'Pedro Costa', role: 'VENDEDOR', signature: 'Pedro' },
  ];
  
  list.innerHTML = agents.map(agent => {
    return `
      <div class="agent-option" onclick="transferChat('${agent.id}', '${agent.name}')">
        <div class="user-avatar">${agent.name.charAt(0)}</div>
        <div>
          <strong style="font-size: 0.85rem;">${agent.name}</strong>
          <span style="display: block; font-size: 0.72rem; color: var(--text-muted);">${agent.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}</span>
        </div>
      </div>`;
  }).join('');
}

// ============ TRANSFER CHAT ============
function transferChat(agentId, agentName) {
  if (!selectedChatId) return;
  const chat = allChats.find(c => c.id === selectedChatId);
  if (!chat) return;
  
  chat.assignedAgentId = agentId;
  chat.assignedAgentName = agentName;
  chat.status = 'EM_ATENDIMENTO';
  
  chat.messages.push({
    id: genId(),
    sender: 'SYSTEM',
    content: `🔄 Atendimento transferido para ${agentName} por ${currentUser.name}.`,
    timestamp: new Date().toISOString(),
  });
  
  $('modal-transfer').classList.add('hidden');
  showToast('info', `Atendimento transferido para ${agentName}.`);
  renderContactList();
  renderChatMessages(chat);
  updateBadges();
}

// ============ UPDATE BADGES ============
function updateBadges() {
  const fila = allChats.filter(c => c.status === 'FILA_ESPERA').length;
  const meus = allChats.filter(c => {
    if (currentUser.role === 'ADMIN') return c.status === 'EM_ATENDIMENTO';
    return c.status === 'EM_ATENDIMENTO' && c.assignedAgentId === currentUser.id;
  }).length;
  const supervisao = allChats.filter(c => c.status === 'ATENDIMENTO_IA').length;
  
  $('tab-badge-fila').textContent = fila;
  $('tab-badge-meus').textContent = meus;
  $('tab-badge-supervisao').textContent = supervisao;
  $('badge-atendimentos').textContent = fila + meus;
  
  // Stats
  $('stat-total-value').textContent = allChats.length;
  $('stat-fila-value').textContent = fila;
  
  const finalizados = allChats.filter(c => c.status === 'FINALIZADO').length;
  const total = allChats.length;
  const rate = total > 0 ? Math.round((finalizados / total) * 100) : 0;
  $('stat-rate-value').textContent = rate + '%';
  
  // Today count
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayCount = allChats.filter(c => new Date(c.createdAt) >= today).length;
  $('stat-today-value').textContent = todayCount;
}

// ============ SOCKET.IO ============
function initSocket() {
  socket.on('status', (data) => {
    whatsappStatus = data.status;
    updateConnectionUI(data.status);
  });
  
  socket.on('qr', (qr) => {
    showQRCode(qr);
  });
  
  socket.on('conversas_update', (conversas) => {
    updateFromSocket(conversas);
  });
  
  socket.on('nova_mensagem', (data) => {
    handleNewMessage(data);
  });
}

function updateConnectionUI(status) {
  const dot = $('status-dot');
  const headerDot = $('header-status-dot');
  const headerText = $('header-status-text');
  
  // Hide all connection states
  $('state-disconnected').classList.add('hidden');
  $('state-qr').classList.add('hidden');
  $('state-connected').classList.add('hidden');
  
  switch (status) {
    case 'connected':
      dot.classList.add('online');
      headerDot.classList.add('online');
      headerDot.classList.remove('offline', 'waiting');
      headerText.textContent = 'Conectado';
      $('state-connected').classList.remove('hidden');
      break;
    case 'qr_ready':
      dot.classList.remove('online');
      headerDot.classList.add('waiting');
      headerDot.classList.remove('online', 'offline');
      headerText.textContent = 'Aguardando QR';
      $('state-qr').classList.remove('hidden');
      break;
    default:
      dot.classList.remove('online');
      headerDot.classList.add('offline');
      headerDot.classList.remove('online', 'waiting');
      headerText.textContent = 'Desconectado';
      $('state-disconnected').classList.remove('hidden');
  }
}

function showQRCode(qrData) {
  const container = $('qr-code-display');
  container.innerHTML = '';
  
  if (qrCodeInstance) {
    qrCodeInstance.clear();
  }
  
  qrCodeInstance = new QRCode(container, {
    text: qrData,
    width: 220,
    height: 220,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.M
  });
}

function updateFromSocket(conversas) {
  // Map existing socket data into our chat format
  conversas.forEach(conv => {
    const existing = allChats.find(c => c.whatsappJid === conv.numero);
    if (existing) {
      // Update existing
      if (conv.nome && conv.nome !== 'Indefinido') existing.customerName = conv.nome;
      if (conv.email) existing.customerEmail = conv.email;
    } else {
      // Create new chat from socket data
      const newChat = {
        id: genId(),
        whatsappJid: conv.numero,
        customerName: conv.nome || formatPhone(conv.numero),
        customerPhone: conv.numero,
        customerEmail: conv.email || null,
        status: 'ATENDIMENTO_IA',
        assignedAgentId: null,
        assignedAgentName: null,
        createdAt: conv.criadoEm || new Date().toISOString(),
        messages: (conv.historico || []).map(h => ({
          id: genId(),
          sender: h.remetente === 'cliente' ? 'CUSTOMER' : 'AI',
          content: h.texto,
          timestamp: h.timestamp || new Date().toISOString(),
        })),
        unreadCount: 0,
      };
      allChats.push(newChat);
    }
  });
  
  renderContactList();
  updateBadges();
  renderActivityList();
}

function handleNewMessage(data) {
  const chat = allChats.find(c => c.whatsappJid === data.numero);
  if (!chat) return;
  
  // Add customer message
  chat.messages.push({
    id: genId(),
    sender: 'CUSTOMER',
    content: data.texto,
    timestamp: new Date().toISOString(),
  });
  
  // Add AI response(s)
  if (data.respostas) {
    data.respostas.forEach(resp => {
      chat.messages.push({
        id: genId(),
        sender: 'AI',
        content: resp,
        timestamp: new Date().toISOString(),
      });
    });
  }
  
  // Update unread if not currently viewing
  if (chat.id !== selectedChatId) {
    chat.unreadCount = (chat.unreadCount || 0) + 1;
  }
  
  // Re-render
  renderContactList();
  updateBadges();
  renderActivityList();
  
  if (chat.id === selectedChatId) {
    renderChatMessages(chat);
  }
  
  // Show notification toast
  showToast('info', `📩 Nova mensagem de ${chat.customerName || 'cliente'}`);
}

// ============ ACTIVITY LIST ============
function renderActivityList() {
  const list = $('activity-list');
  
  // Get recent messages across all IA chats
  const iaChats = allChats.filter(c => c.status === 'ATENDIMENTO_IA');
  const recentActivity = [];
  
  iaChats.forEach(chat => {
    const recent = chat.messages.slice(-3);
    recent.forEach(msg => {
      recentActivity.push({
        chatName: chat.customerName || 'Cliente',
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
      });
    });
  });
  
  recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const display = recentActivity.slice(0, 10);
  
  if (display.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🤖</div>
        <p>Aguardando interações...</p>
        <span>O Agente Virtual está pronto para processar novas mensagens.</span>
      </div>`;
    return;
  }
  
  list.innerHTML = display.map(act => {
    const icon = act.sender === 'AI' ? '🤖' : act.sender === 'CUSTOMER' ? '👤' : '👨‍💼';
    const senderLabel = act.sender === 'AI' ? 'Beatriz (IA)' : act.chatName;
    
    return `
      <div class="activity-item">
        <span class="activity-sender">${icon} ${senderLabel}</span>
        <span class="activity-text">${truncate(act.content, 60)}</span>
        <span class="activity-time">${formatTime(act.timestamp)}</span>
      </div>`;
  }).join('');
}

// ============ MISC UI ============
async function initMiscUI() {
  // Carrega configurações da IA
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      const nameInput = $('ia-name');
      const promptInput = $('ia-prompt');
      if (nameInput) nameInput.value = data.botName || '';
      if (promptInput) promptInput.value = data.systemPrompt || '';
    }
  } catch (e) {
    console.error("Failed to fetch settings:", e);
  }

  // Save IA config button
  const saveBtn = $('btn-save-ia-config');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const botName = $('ia-name').value;
      const systemPrompt = $('ia-prompt').value;
      
      try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ botName, systemPrompt })
        });
        
        if (response.ok) {
            showToast('success', 'Configuração da IA salva com sucesso!');
        } else {
            showToast('error', 'Erro ao salvar configuração.');
        }
      } catch (e) {
          showToast('error', 'Erro de conexão.');
      }
    });
  }
}

// ============ TOAST NOTIFICATIONS ============
function showToast(type, message) {
  const container = $('toast-container');
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
  };
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-text">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 5000);
}

// ============ HELPERS ============
function genId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatPhone(jid) {
  if (!jid) return 'Desconhecido';
  return jid.replace('@s.whatsapp.net', '').replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
}

function getStatusAvatarClass(status) {
  switch (status) {
    case 'ATENDIMENTO_IA': return 'status-ia';
    case 'FILA_ESPERA': return 'status-fila';
    case 'EM_ATENDIMENTO': return 'status-atendimento';
    default: return '';
  }
}

function getStatusPillClass(status) {
  switch (status) {
    case 'ATENDIMENTO_IA': return 'pill-ia';
    case 'FILA_ESPERA': return 'pill-fila';
    case 'EM_ATENDIMENTO': return 'pill-atendimento';
    case 'FINALIZADO': return 'pill-finalizado';
    default: return '';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'ATENDIMENTO_IA': return '🤖 Atendimento IA';
    case 'FILA_ESPERA': return '⏳ Fila de Espera';
    case 'EM_ATENDIMENTO': return '👤 Em Atendimento';
    case 'FINALIZADO': return '✅ Finalizado';
    default: return status;
  }
}

// ============ MOCK DATA (for demo/preview) ============
function loadMockData() {
  allChats = [
    {
      id: 'chat-001',
      whatsappJid: '5511988887777@s.whatsapp.net',
      customerName: 'Ana Carolina',
      customerPhone: '5511988887777',
      customerEmail: 'ana@email.com',
      status: 'ATENDIMENTO_IA',
      assignedAgentId: null,
      assignedAgentName: null,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      unreadCount: 2,
      messages: [
        { id: 'm1', sender: 'CUSTOMER', content: 'Olá, boa tarde! Vi o anúncio de porcelanato acetinado.', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { id: 'm2', sender: 'AI', content: 'Oi! Seja muito bem-vinda à Pereira Acabamentos! 😊✨ Que bom que você viu nosso anúncio! O porcelanato acetinado é uma das nossas linhas mais elegantes. Me conta, seria para qual ambiente? Sala, quarto, banheiro? Assim consigo te indicar o modelo perfeito! 🏠', timestamp: new Date(Date.now() - 1700000).toISOString() },
        { id: 'm3', sender: 'CUSTOMER', content: 'É para a sala e a cozinha, estou reformando minha casa!', timestamp: new Date(Date.now() - 1600000).toISOString() },
        { id: 'm4', sender: 'AI', content: 'Que incrível! Reforma é sempre uma fase empolgante, apesar do trabalhinho, né? 😅 Para sala e cozinha, tenho umas opções que vão deixar tudo lindo!\n\nTemos o Porcelanato Marmorizado Toronto — ele tem um efeito de mármore super sofisticado e está com 35% de desconto! De R$89.90 por apenas R$58.40/m². \n\nQual a metragem aproximada da sala e da cozinha? Assim já calculo um orçamento estimado pra você! 📐', timestamp: new Date(Date.now() - 1500000).toISOString() },
        { id: 'm5', sender: 'CUSTOMER', content: 'Nossa que lindo! A sala tem uns 25m² e a cozinha 12m².', timestamp: new Date(Date.now() - 300000).toISOString() },
      ],
    },
    {
      id: 'chat-002',
      whatsappJid: '5521977776666@s.whatsapp.net',
      customerName: 'Roberto Almeida',
      customerPhone: '5521977776666',
      customerEmail: null,
      status: 'FILA_ESPERA',
      assignedAgentId: null,
      assignedAgentName: null,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 1,
      messages: [
        { id: 'm6', sender: 'CUSTOMER', content: 'Boa tarde! Preciso de um orçamento grande, para um prédio novo.', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'm7', sender: 'AI', content: 'Olá Roberto! Que projeto grandioso! 🏢✨ Com certeza temos condições especiais para volumes maiores. Para te dar o melhor atendimento nesse caso, vou acionar nosso consultor especializado em projetos de grande porte.\n\nAguarde um instante que um de nossos especialistas vai assumir o atendimento! 🚀', timestamp: new Date(Date.now() - 3500000).toISOString() },
        { id: 'm8', sender: 'SYSTEM', content: '⏳ Cliente solicitou atendimento humano. Chat movido para a fila de espera.', timestamp: new Date(Date.now() - 3400000).toISOString() },
        { id: 'm9', sender: 'CUSTOMER', content: 'Ok, vou aguardar. Obrigado!', timestamp: new Date(Date.now() - 600000).toISOString() },
      ],
    },
    {
      id: 'chat-003',
      whatsappJid: '5531966665555@s.whatsapp.net',
      customerName: 'Fernanda Lima',
      customerPhone: '5531966665555',
      customerEmail: 'fernanda@email.com',
      status: 'EM_ATENDIMENTO',
      assignedAgentId: 'admin-001',
      assignedAgentName: 'Admin',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 0,
      messages: [
        { id: 'm10', sender: 'CUSTOMER', content: 'Oi! Quero saber sobre pisos para área externa.', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 'm11', sender: 'AI', content: 'Olá Fernanda! 😊 Área externa é um ambiente especial que precisa de pisos com características antiderrapantes. Temos ótimas opções! Me conta mais sobre o espaço?', timestamp: new Date(Date.now() - 7100000).toISOString() },
        { id: 'm12', sender: 'CUSTOMER', content: 'É uma varanda de 40m² e a área da churrasqueira, uns 20m².', timestamp: new Date(Date.now() - 7000000).toISOString() },
        { id: 'm13', sender: 'SYSTEM', content: '👤 Admin assumiu este atendimento.', timestamp: new Date(Date.now() - 6500000).toISOString() },
        { id: 'm14', sender: 'AGENT', agentName: 'Admin', content: 'Olá Fernanda! Aqui é o Carlos, gerente da Pereira. Vou te ajudar pessoalmente com esse projeto! Para 60m² de área externa, temos condições especiais. Vou preparar uma proposta completa para você.', timestamp: new Date(Date.now() - 6400000).toISOString() },
        { id: 'm15', sender: 'CUSTOMER', content: 'Que ótimo! Aguardo a proposta então!', timestamp: new Date(Date.now() - 6000000).toISOString() },
      ],
    },
    {
      id: 'chat-004',
      whatsappJid: '5541955554444@s.whatsapp.net',
      customerName: 'Lucas Mendes',
      customerPhone: '5541955554444',
      customerEmail: 'lucas@gmail.com',
      status: 'FINALIZADO',
      assignedAgentId: 'admin-001',
      assignedAgentName: 'Admin',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      closedAt: new Date(Date.now() - 72000000).toISOString(),
      unreadCount: 0,
      messages: [
        { id: 'm16', sender: 'CUSTOMER', content: 'Olá! Gostaria de saber o preço do revestimento subway branco.', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 'm17', sender: 'AI', content: 'Oi Lucas! O revestimento Subway White é um clássico! 😍 Está em promoção por R$32.90/m². Quantos m² você precisaria?', timestamp: new Date(Date.now() - 86300000).toISOString() },
        { id: 'm18', sender: 'CUSTOMER', content: '15m². Quanto fica?', timestamp: new Date(Date.now() - 86200000).toISOString() },
        { id: 'm19', sender: 'AI', content: 'Para 15m² com margem de segurança de 10% (16.5m²), ficaria em torno de R$542.85. Aceitamos PIX com 5% extra de desconto! Quer falar com um vendedor para fechar?', timestamp: new Date(Date.now() - 86100000).toISOString() },
        { id: 'm20', sender: 'CUSTOMER', content: 'Sim, quero fechar!', timestamp: new Date(Date.now() - 86000000).toISOString() },
        { id: 'm21', sender: 'SYSTEM', content: '👤 Admin assumiu este atendimento.', timestamp: new Date(Date.now() - 80000000).toISOString() },
        { id: 'm22', sender: 'AGENT', agentName: 'Admin', content: 'Lucas, tudo certo! Vou gerar o pedido com PIX. Você economiza R$27.14 de desconto. Envio o link de pagamento agora!', timestamp: new Date(Date.now() - 79000000).toISOString() },
        { id: 'm23', sender: 'SYSTEM', content: '✅ Atendimento finalizado por Admin.', timestamp: new Date(Date.now() - 72000000).toISOString() },
      ],
    },
    {
      id: 'chat-005',
      whatsappJid: '5511944443333@s.whatsapp.net',
      customerName: 'Juliana Souza',
      customerPhone: '5511944443333',
      customerEmail: null,
      status: 'ATENDIMENTO_IA',
      assignedAgentId: null,
      assignedAgentName: null,
      createdAt: new Date(Date.now() - 900000).toISOString(),
      unreadCount: 1,
      messages: [
        { id: 'm24', sender: 'CUSTOMER', content: 'Boa tarde! Vocês tem pastilhas de vidro?', timestamp: new Date(Date.now() - 900000).toISOString() },
        { id: 'm25', sender: 'AI', content: 'Boa tarde, Juliana! 😊 Temos sim! Nossas pastilhas de vidro são perfeitas para dar aquele toque especial no banheiro ou cozinha. Temos a linha Crystal Blue Mosaico com 30% de desconto — super elegante! ✨\n\nGostaria de saber mais detalhes ou tem algum espaço específico em mente?', timestamp: new Date(Date.now() - 800000).toISOString() },
      ],
    },
  ];
  
  renderContactList();
  updateBadges();
  renderActivityList();
}
