'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STAGE_LABELS = {
    WELCOME: 'Boas-vindas',
    WAITING_NAME: 'Aguardando nome',
    WAITING_EMAIL: 'Aguardando e-mail',
    SHOWING_CATEGORIES: 'Escolhendo categoria',
    BROWSING: 'Navegando catálogo',
    WAITING_MEASUREMENT: 'Aguardando medida',
    DONE: 'Orçamento gerado ✅',
};

export default function ChatDashboard() {
    const [leads, setLeads] = useState([]);
    const [activeLeadId, setActiveLeadId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);
    const previousCountRef = useRef(0);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const fetchLeads = useCallback(async () => {
        try {
            const res = await fetch('/api/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(prev => {
                    // Detect new messages for current lead
                    if (activeLeadId) {
                        const prevLead = prev.find(l => l._id === activeLeadId);
                        const newLead = data.find(l => l._id === activeLeadId);
                        if (newLead && prevLead && newLead.history.length > prevLead.history.length) {
                            setTimeout(scrollToBottom, 100);
                        }
                    }
                    return data;
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [activeLeadId, scrollToBottom]);

    useEffect(() => {
        fetchLeads();
        const interval = setInterval(fetchLeads, 5000);
        return () => clearInterval(interval);
    }, [fetchLeads]);

    // Scroll to bottom when switching leads
    useEffect(() => {
        if (activeLeadId) {
            setTimeout(scrollToBottom, 100);
        }
    }, [activeLeadId, scrollToBottom]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeLead) return;

        setSending(true);
        // Optimistic update
        const optimisticMsg = { from: 'agent', text: messageInput, timestamp: new Date() };
        setLeads(prev => prev.map(l =>
            l._id === activeLeadId
                ? { ...l, history: [...l.history, optimisticMsg] }
                : l
        ));
        const sentText = messageInput;
        setMessageInput('');
        setTimeout(scrollToBottom, 50);

        try {
            const res = await fetch(`/api/leads/${activeLead._id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: sentText })
            });
            if (res.ok) {
                fetchLeads();
            }
        } catch (error) {
            console.error('Failed to send:', error);
        }
        setSending(false);
    };

    const activeLead = leads.find(l => l._id === activeLeadId);

    const toggleBotPause = async () => {
        if (!activeLead) return;
        setLeads(prev => prev.map(l =>
            l._id === activeLeadId ? { ...l, botPaused: !l.botPaused } : l
        ));
        try {
            await fetch(`/api/leads/${activeLead._id}/pause`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paused: !activeLead.botPaused })
            });
            fetchLeads();
        } catch (error) {
            console.error('Failed to toggle bot status', error);
        }
    };

    const filteredLeads = leads.filter(lead => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            (lead.name || '').toLowerCase().includes(q) ||
            (lead.phoneNumber || '').includes(q)
        );
    });

    // Count unread (last message from customer)
    const unreadCount = leads.filter(l => l.history?.[l.history.length - 1]?.from === 'customer').length;

    if (loading && leads.length === 0) {
        return (
            <div className="flex-center h-screen">
                <div className="spinner" />
                <style jsx>{`
                    .flex-center { display: flex; align-items: center; justify-content: center; }
                    .h-screen { height: 80vh; }
                    .spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        <h2>
                            Inbox
                            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                        </h2>
                        <p>{leads.length} conversas</p>
                    </div>
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="leads-list">
                    {filteredLeads.length === 0 ? (
                        <div className="empty-leads">
                            <p>{searchQuery ? 'Nenhum resultado encontrado.' : 'Nenhuma conversa ainda.'}</p>
                        </div>
                    ) : (
                        filteredLeads.map(lead => {
                            const lastMsg = lead.history?.[lead.history.length - 1];
                            const isUnread = lastMsg?.from === 'customer';
                            const initials = (lead.name || lead.phoneNumber || '?')
                                .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

                            return (
                                <div
                                    key={lead._id}
                                    onClick={() => setActiveLeadId(lead._id)}
                                    className={`lead-item ${activeLeadId === lead._id ? 'active' : ''} ${isUnread ? 'unread' : ''}`}
                                >
                                    <div className="lead-avatar">
                                        {initials}
                                        <div className={`lead-dot ${lead.botPaused ? 'paused' : 'active'}`} />
                                    </div>
                                    <div className="lead-info">
                                        <div className="lead-row">
                                            <span className="lead-name">{lead.name || lead.phoneNumber}</span>
                                            {lastMsg && (
                                                <span className="lead-time">
                                                    {format(new Date(lastMsg.timestamp), 'HH:mm')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="lead-preview-row">
                                            <span className={`lead-preview ${isUnread ? 'bold' : ''}`}>
                                                {lastMsg
                                                    ? `${lastMsg.from === 'bot' ? '🤖 ' : lastMsg.from === 'agent' ? '👨‍💻 ' : ''}${lastMsg.text?.slice(0, 35)}${lastMsg.text?.length > 35 ? '…' : ''}`
                                                    : 'Nenhuma mensagem'}
                                            </span>
                                            {isUnread && <span className="unread-dot" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            {activeLead ? (
                <div className="main-chat">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="chat-avatar">
                                {(activeLead.name || activeLead.phoneNumber || '?')
                                    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                                <h2>
                                    {activeLead.name || 'Cliente sem nome'}
                                    <span className="phone-badge">📞 {activeLead.phoneNumber}</span>
                                </h2>
                                <p>
                                    Estágio: <span className="stage-highlight">{STAGE_LABELS[activeLead.stage] || activeLead.stage}</span>
                                    {activeLead.lastInteraction && (
                                        <span className="last-seen">
                                            · Última atividade {formatDistanceToNow(new Date(activeLead.lastInteraction), { locale: ptBR, addSuffix: true })}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="actions">
                            <button
                                onClick={toggleBotPause}
                                className={`btn-toggle ${activeLead.botPaused ? 'btn-resume' : 'btn-pause'}`}
                            >
                                {activeLead.botPaused ? '▶ Reativar Robô Lia' : '⏸ Assumir Atendimento'}
                            </button>
                        </div>
                    </div>

                    <div className="messages-area">
                        {activeLead.history.length === 0 ? (
                            <div className="flex-center h-full">
                                <p className="empty-state">Nenhuma mensagem trocada ainda.</p>
                            </div>
                        ) : (
                            <>
                                {activeLead.history.map((msg, idx) => {
                                    const isMe = msg.from === 'bot' || msg.from === 'agent';
                                    const showDate = idx === 0 || (
                                        new Date(msg.timestamp).toDateString() !==
                                        new Date(activeLead.history[idx - 1]?.timestamp).toDateString()
                                    );
                                    return (
                                        <div key={idx}>
                                            {showDate && (
                                                <div className="date-divider">
                                                    <span>
                                                        {format(new Date(msg.timestamp), "dd 'de' MMMM", { locale: ptBR })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`message-wrapper ${isMe ? 'message-out' : 'message-in'}`}>
                                                <div className={`message-bubble ${msg.from === 'bot' ? 'bubble-bot' : msg.from === 'agent' ? 'bubble-agent' : 'bubble-customer'}`}>
                                                    <p>{msg.text}</p>
                                                </div>
                                                <span className="message-meta">
                                                    {msg.from === 'bot' && <span className="meta-bot">🤖 Lia · </span>}
                                                    {msg.from === 'agent' && <span className="meta-agent">👨‍💻 Equipe · </span>}
                                                    {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    <div className="input-area">
                        {activeLead.botPaused ? (
                            <form onSubmit={handleSendMessage} className="message-form">
                                <div className="input-wrapper">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Digite sua resposta para o cliente... (Enter para enviar)"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        rows={1}
                                    />
                                </div>
                                <button type="submit" disabled={sending || !messageInput.trim()} className="btn-send">
                                    {sending ? (
                                        <span className="mini-spinner" />
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="bot-active-warning">
                                <span>🤖</span>
                                <p>Robô <strong>Lia</strong> ativo. Clique em <em>"Assumir Atendimento"</em> para enviar mensagens.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="no-chat-selected">
                    <div className="no-chat-icon">💬</div>
                    <h2>Selecione uma conversa</h2>
                    <p>Escolha um cliente na lista ao lado para ver o histórico ou assumir o atendimento da Lia.</p>
                </div>
            )}

            <style jsx>{`
                .chat-container {
                    display: flex;
                    height: calc(100vh - 4rem);
                    background: #f8fafc;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    margin: -1rem;
                }

                /* Sidebar */
                .sidebar {
                    width: 340px;
                    min-width: 280px;
                    border-right: 1px solid #e2e8f0;
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                }
                .sidebar-header {
                    padding: 1.25rem;
                    border-bottom: 1px solid #f1f5f9;
                    background: #f8fafc;
                }
                .sidebar-title { margin-bottom: 0.75rem; }
                .sidebar-title h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 0.15rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .sidebar-title p { color: #94a3b8; font-size: 0.8rem; margin: 0; }
                .badge {
                    background: #ef4444;
                    color: white;
                    font-size: 0.7rem;
                    padding: 0.15rem 0.45rem;
                    border-radius: 999px;
                    font-weight: 700;
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    padding: 0.5rem 0.75rem;
                }
                .search-icon { font-size: 0.875rem; }
                .search-box input {
                    border: none;
                    outline: none;
                    font-size: 0.85rem;
                    color: #334155;
                    background: transparent;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                }
                .leads-list { flex: 1; overflow-y: auto; }
                .empty-leads { padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.875rem; }
                .lead-item {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    padding: 0.875rem 1.25rem;
                    border-bottom: 1px solid #f8fafc;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .lead-item:hover { background: #f8fafc; }
                .lead-item.active { background: #eff6ff; border-left: 3px solid #3b82f6; padding-left: calc(1.25rem - 3px); }
                .lead-item.unread .lead-name { font-weight: 700; color: #0f172a; }
                .lead-avatar {
                    position: relative;
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981, #0d9488);
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .lead-dot {
                    position: absolute;
                    bottom: 1px;
                    right: 1px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 2px solid white;
                }
                .lead-dot.active { background: #10b981; }
                .lead-dot.paused { background: #f59e0b; }
                .lead-info { flex: 1; min-width: 0; }
                .lead-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.2rem;
                }
                .lead-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #334155;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .lead-time { font-size: 0.7rem; color: #94a3b8; white-space: nowrap; }
                .lead-preview-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    justify-content: space-between;
                }
                .lead-preview {
                    font-size: 0.78rem;
                    color: #94a3b8;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .lead-preview.bold { font-weight: 600; color: #475569; }
                .unread-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #3b82f6;
                    flex-shrink: 0;
                }

                /* Main Chat */
                .main-chat {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                .chat-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .chat-header-info { display: flex; align-items: center; gap: 0.875rem; }
                .chat-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white;
                    font-size: 1rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .chat-header h2 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 0.2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .phone-badge {
                    font-size: 0.72rem;
                    font-weight: 500;
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 0.15rem 0.5rem;
                    border-radius: 999px;
                    border: 1px solid #e2e8f0;
                }
                .chat-header p { margin: 0; font-size: 0.78rem; color: #64748b; }
                .stage-highlight { font-weight: 600; color: #6366f1; }
                .last-seen { color: #94a3b8; font-weight: 400; }

                .btn-toggle {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: 0.2s;
                    white-space: nowrap;
                }
                .btn-resume { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
                .btn-resume:hover { background: #d1fae5; }
                .btn-pause { background: #fffbeb; color: #d97706; border-color: #fde68a; }
                .btn-pause:hover { background: #fef3c7; }

                .messages-area {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .flex-center { display: flex; align-items: center; justify-content: center; }
                .h-full { height: 100%; }

                .date-divider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 1rem 0 0.5rem;
                }
                .date-divider span {
                    font-size: 0.72rem;
                    color: #94a3b8;
                    font-weight: 600;
                    background: rgba(255,255,255,0.8);
                    padding: 0.2rem 0.75rem;
                    border-radius: 999px;
                    border: 1px solid #e2e8f0;
                }

                .message-wrapper {
                    display: flex;
                    flex-direction: column;
                    max-width: 72%;
                    animation: fadeIn 0.2s ease;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                .message-out { align-self: flex-end; align-items: flex-end; }
                .message-in { align-self: flex-start; align-items: flex-start; }
                .message-bubble {
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
                    max-width: 100%;
                }
                .message-bubble p {
                    margin: 0;
                    white-space: pre-wrap;
                    line-height: 1.5;
                    font-size: 0.9rem;
                }
                .bubble-customer {
                    background: white;
                    border: 1px solid #e2e8f0;
                    color: #1e293b;
                    border-bottom-left-radius: 0.25rem;
                }
                .bubble-agent {
                    background: linear-gradient(135deg, #4f46e5, #6366f1);
                    color: white;
                    border-bottom-right-radius: 0.25rem;
                }
                .bubble-bot {
                    background: #e2e8f0;
                    color: #334155;
                    border-bottom-right-radius: 0.25rem;
                }
                .message-meta { font-size: 0.7rem; color: #94a3b8; margin-top: 0.3rem; }
                .meta-bot { color: #0f766e; font-weight: 600; }
                .meta-agent { color: #4338ca; font-weight: 600; }

                .empty-state {
                    background: rgba(255,255,255,0.8);
                    padding: 0.5rem 1rem;
                    border-radius: 999px;
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                .input-area {
                    padding: 1rem 1.5rem;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                }
                .message-form { display: flex; gap: 0.75rem; align-items: flex-end; }
                .input-wrapper { flex: 1; }
                .message-form textarea {
                    width: 100%;
                    resize: none;
                    min-height: 48px;
                    max-height: 140px;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    border: 1.5px solid #e2e8f0;
                    font-family: inherit;
                    font-size: 0.9rem;
                    outline: none;
                    transition: 0.2s;
                    box-sizing: border-box;
                    line-height: 1.5;
                    background: #f8fafc;
                    margin: 0;
                }
                .message-form textarea:focus {
                    border-color: #6366f1;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .btn-send {
                    width: 48px;
                    height: 48px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: 0.2s;
                    flex-shrink: 0;
                }
                .btn-send:hover:not(:disabled) { filter: brightness(1.1); transform: scale(1.05); }
                .btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
                .mini-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.4);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .bot-active-warning {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.875rem 1rem;
                    background: #f8fafc;
                    border-radius: 0.75rem;
                    border: 1px solid #e2e8f0;
                    font-size: 0.875rem;
                }
                .bot-active-warning span { font-size: 1.25rem; }
                .bot-active-warning p { margin: 0; color: #64748b; }
                .bot-active-warning strong { color: #10b981; }
                .bot-active-warning em { color: #d97706; font-style: normal; font-weight: 600; }

                .no-chat-selected {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    text-align: center;
                    padding: 2rem;
                }
                .no-chat-icon { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.3; }
                .no-chat-selected h2 { color: #334155; margin: 0 0 0.75rem; font-size: 1.25rem; }
                .no-chat-selected p { color: #94a3b8; max-width: 260px; font-size: 0.875rem; line-height: 1.6; margin: 0; }
            `}</style>
        </div>
    );
}
