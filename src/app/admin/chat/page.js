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

    const [suggesting, setSuggesting] = useState(false);

    const handleSuggestReply = async () => {
        if (!activeLead) return;
        setSuggesting(true);
        try {
            const res = await fetch('/api/ai/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: activeLead._id })
            });
            if (res.ok) {
                const data = await res.json();
                setMessageInput(data.suggestion);
            }
        } catch (error) {
            console.error('Failed to get suggestion:', error);
        } finally {
            setSuggesting(false);
        }
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
                                <button
                                    type="button"
                                    className="btn-ai-suggest"
                                    onClick={handleSuggestReply}
                                    disabled={suggesting}
                                    title="Sugerir resposta com IA"
                                >
                                    {suggesting ? <span className="mini-spinner" /> : '✨'}
                                </button>
                                <div className="input-wrapper">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Digite sua resposta ou use o ✨ para sugestão..."
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
                    height: calc(100vh - 5rem);
                    background: white;
                    border-radius: 1.5rem;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    margin: 0;
                }

                /* Sidebar */
                .sidebar {
                    width: 360px;
                    min-width: 300px;
                    border-right: 1px solid #f1f5f9;
                    background: #fcfcfd;
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                }
                .sidebar-header {
                    padding: 1.75rem 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .sidebar-title { margin-bottom: 1.25rem; }
                .sidebar-title h2 {
                    font-size: 1.5rem;
                    color: #0f172a;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    letter-spacing: -0.02em;
                    margin: 0 0 0.25rem;
                }
                .sidebar-title p { color: #64748b; font-size: 0.875rem; margin: 0; font-weight: 500; }
                .badge {
                    background: #2563eb;
                    color: white;
                    font-size: 0.75rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 2rem;
                    font-weight: 800;
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.875rem;
                    padding: 0.625rem 1rem;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                }
                .search-box:focus-within {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                .search-icon { font-size: 0.875rem; color: #94a3b8; }
                .search-box input {
                    border: none;
                    outline: none;
                    font-size: 0.9rem;
                    color: #0f172a;
                    background: transparent;
                    width: 100%;
                    padding: 0;
                }
                .search-box input::placeholder { color: #94a3b8; }
                
                .leads-list { flex: 1; overflow-y: auto; padding: 0.5rem; }
                .empty-leads { padding: 3rem 1.5rem; text-align: center; color: #94a3b8; font-size: 0.875rem; }
                
                .lead-item {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    padding: 1rem 1rem;
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 0.25rem;
                }
                .lead-item:hover { background: #f1f5f9; }
                .lead-item.active { 
                    background: #eff6ff;
                }
                .lead-item.active .lead-avatar {
                    box-shadow: 0 0 0 2px #white, 0 0 0 4px #2563eb;
                }
                
                .lead-avatar {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    border-radius: 1rem;
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: white;
                    font-size: 1rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: all 0.2s;
                }
                .lead-dot {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 3px solid #fcfcfd;
                }
                .lead-dot.active { background: #10b981; }
                .lead-dot.paused { background: #f59e0b; }
                
                .lead-info { flex: 1; min-width: 0; }
                .lead-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.25rem;
                }
                .lead-name {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #0f172a;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .lead-time { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
                .lead-preview-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    justify-content: space-between;
                }
                .lead-preview {
                    font-size: 0.825rem;
                    color: #64748b;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .lead-item.unread .lead-preview { color: #0f172a; font-weight: 600; }
                .unread-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #2563eb;
                    flex-shrink: 0;
                    box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
                }

                /* Main Chat */
                .main-chat {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    background: #fff;
                }
                .chat-header {
                    padding: 1.25rem 2rem;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .chat-header-info { display: flex; align-items: center; gap: 1rem; }
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 1rem;
                    background: linear-gradient(135deg, #1e293b, #334155);
                    color: white;
                    font-size: 1rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .chat-header h2 {
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 0.15rem;
                    letter-spacing: -0.01em;
                }
                .phone-badge {
                    font-size: 0.8rem;
                    color: #64748b;
                    background: #f1f5f9;
                    padding: 0.2rem 0.6rem;
                    border-radius: 0.5rem;
                    margin-left: 0.75rem;
                    font-weight: 600;
                }
                .chat-header p { margin: 0; font-size: 0.875rem; color: #64748b; font-weight: 500; }
                .stage-highlight { color: #2563eb; font-weight: 700; background: #eff6ff; padding: 0.1rem 0.5rem; border-radius: 2rem; margin-right: 0.5rem; }
                .last-seen { color: #94a3b8; font-weight: 400; font-size: 0.8rem; }

                .btn-toggle {
                    padding: 0.625rem 1.25rem;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-resume { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }
                .btn-resume:hover { background: #dbeafe; transform: translateY(-1px); }
                .btn-pause { background: #0f172a; color: white; }
                .btn-pause:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }

                .messages-area {
                    flex: 1;
                    padding: 2rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    background: #f8fafc;
                }

                .date-divider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 1.5rem 0 0.5rem;
                    position: relative;
                }
                .date-divider::before {
                    content: '';
                    position: absolute;
                    left: 0; right: 0; top: 50%;
                    height: 1px;
                    background: #e2e8f0;
                }
                .date-divider span {
                    position: relative;
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 700;
                    background: #f8fafc;
                    padding: 0 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .message-wrapper {
                    display: flex;
                    flex-direction: column;
                    max-width: 75%;
                    animation: messageIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes messageIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .message-out { align-self: flex-end; align-items: flex-end; }
                .message-in { align-self: flex-start; align-items: flex-start; }
                
                .message-bubble {
                    padding: 0.875rem 1.125rem;
                    border-radius: 1.125rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    position: relative;
                }
                .message-bubble p {
                    margin: 0;
                    white-space: pre-wrap;
                    line-height: 1.55;
                    font-size: 0.95rem;
                }
                
                .bubble-customer {
                    background: white;
                    border: 1px solid #e2e8f0;
                    color: #0f172a;
                    border-bottom-left-radius: 0.25rem;
                }
                .bubble-agent {
                    background: #0f172a;
                    color: white;
                    border-bottom-right-radius: 0.25rem;
                }
                .bubble-bot {
                    background: #e2e8f0;
                    color: #334155;
                    border-bottom-right-radius: 0.25rem;
                }
                
                .message-meta { font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem; font-weight: 500; }
                .meta-bot { color: #2563eb; font-weight: 800; }
                .meta-agent { color: #64748b; font-weight: 800; }

                .input-area {
                    padding: 1.5rem 2rem;
                    background: white;
                    border-top: 1px solid #f1f5f9;
                }
                .message-form { display: flex; gap: 1rem; align-items: flex-end; }
                .input-wrapper { flex: 1; }
                .message-form textarea {
                    width: 100%;
                    resize: none;
                    min-height: 52px;
                    max-height: 200px;
                    padding: 0.875rem 1.25rem;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                    font-family: inherit;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    background: #fcfcfd;
                    color: #0f172a;
                }
                .message-form textarea:focus {
                    border-color: #2563eb;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
                }
                
                .btn-ai-suggest {
                    width: 52px;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    color: #2563eb;
                    border: 1px solid #e2e8f0;
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 1.5rem;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .btn-ai-suggest:hover:not(:disabled) {
                    border-color: #2563eb;
                    background: #eff6ff;
                    transform: scale(1.05);
                }
                
                .btn-send {
                    width: 52px;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }
                .btn-send:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3); }
                .btn-send:active { transform: scale(0.95); }
                .btn-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                .bot-active-warning {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    background: #f8fafc;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                    font-size: 0.95rem;
                    color: #64748b;
                }
                .bot-active-warning strong { color: #2563eb; }
                .bot-active-warning em { color: #0f172a; font-style: normal; font-weight: 800; text-decoration: underline; cursor: pointer; }

                .no-chat-selected {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 3rem;
                    background: #fff;
                }
                .no-chat-icon {
                    width: 80px; height: 80px;
                    background: #f1f5f9;
                    border-radius: 2rem;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                    color: #94a3b8;
                }
                .no-chat-selected h2 { color: #0f172a; font-weight: 800; font-size: 1.5rem; margin: 0 0 0.75rem; }
                .no-chat-selected p { color: #64748b; max-width: 300px; font-size: 1rem; line-height: 1.6; margin: 0; }

                .spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .mini-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
            `}</style>
        </div>
    );
}
