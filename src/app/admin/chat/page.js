'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STAGE_LABELS = {
    WELCOME: 'Recepção AI',
    COLLECTING_NAME: 'Coletando Nome',
    IDENTIFYING_NEED: 'Qualificação',
    SHOWING_PRODUCTS: 'Apresentação',
    WAITING_HUMAN: 'Aguardando Consultor',
};

export default function ChatDashboard() {
    const [leads, setLeads] = useState([]);
    const [activeLeadId, setActiveLeadId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const fetchLeads = useCallback(async () => {
        try {
            const res = await fetch('/api/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(prev => {
                    if (activeLeadId) {
                        const prevLead = prev.find(l => l._id === activeLeadId);
                        const newLead = data.find(l => l._id === activeLeadId);
                        if (newLead && prevLead && newLead.history.length > prevLead.history.length) {
                            setTimeout(scrollToBottom, 50);
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
        const interval = setInterval(fetchLeads, 4000);
        return () => clearInterval(interval);
    }, [fetchLeads]);

    useEffect(() => {
        if (activeLeadId) {
            setTimeout(scrollToBottom, 50);
        }
    }, [activeLeadId, scrollToBottom]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeLead) return;

        setSending(true);
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
            if (res.ok) fetchLeads();
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
            console.error('Failed to suggest:', error);
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
        const q = searchQuery.toLowerCase();
        return (lead.nomeCliente || '').toLowerCase().includes(q) || (lead.phoneNumber || '').includes(q);
    });

    const unreadCount = leads.filter(l => l.history?.[l.history.length - 1]?.from === 'customer').length;

    if (loading && leads.length === 0) {
        return (
            <div className="loading-screen">
                <div className="loader" />
                <style jsx>{`
                    .loading-screen { height: 70vh; display: flex; align-items: center; justify-content: center; }
                    .loader { width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="chat-interface glass-card">
            <div className="conversations-sidebar">
                <div className="sidebar-top">
                    <div className="sidebar-header-info">
                        <h2>Conversas</h2>
                        {unreadCount > 0 && <span className="unread-total">{unreadCount}</span>}
                    </div>
                    <div className="search-wrapper glass-card">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar contatos..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="leads-scroller">
                    {filteredLeads.map(lead => {
                        const lastMsg = lead.history?.[lead.history.length - 1];
                        const isUnread = lastMsg?.from === 'customer';
                        const initials = (lead.nomeCliente || lead.phoneNumber || '?')
                            .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                        
                        return (
                            <div
                                key={lead._id}
                                onClick={() => setActiveLeadId(lead._id)}
                                className={`lead-card ${activeLeadId === lead._id ? 'active' : ''} ${isUnread ? 'is-unread' : ''}`}
                            >
                                <div className="avatar-wrapper">
                                    <div className="lead-avatar">{initials}</div>
                                    <div className={`status-blob ${lead.botPaused ? 'paused' : 'active'}`} />
                                </div>
                                <div className="lead-preview-info">
                                    <div className="lead-name-row">
                                        <span className="lead-name">{lead.nomeCliente || lead.phoneNumber}</span>
                                        {lastMsg && <span className="lead-time">{format(new Date(lastMsg.timestamp), 'HH:mm')}</span>}
                                    </div>
                                    <div className="lead-msg-preview-row">
                                        <p className="lead-msg-text">
                                            {lastMsg ? lastMsg.text : 'Sem mensagens'}
                                        </p>
                                        {isUnread && <div className="unread-indicator" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="chat-viewport">
                {activeLead ? (
                    <>
                        <div className="viewport-header">
                            <div className="header-contact-info">
                                <div className="contact-avatar">
                                    {(activeLead.nomeCliente || activeLead.phoneNumber || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3>{activeLead.nomeCliente || activeLead.phoneNumber}</h3>
                                    <div className="contact-meta">
                                        <span className={`stage-tag-premium tag-${activeLead.etapaChat?.toLowerCase()}`}>
                                            {STAGE_LABELS[activeLead.etapaChat] || activeLead.etapaChat}
                                        </span>
                                        <span className="meta-phone"> {activeLead.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button
                                    onClick={toggleBotPause}
                                    className={`btn-control ${activeLead.botPaused ? 'btn-active-bot' : 'btn-pause-bot'}`}
                                >
                                    {activeLead.botPaused ? '🚀 Reativar Robô' : '⏸ Assumir'}
                                </button>
                            </div>
                        </div>

                        <div className="messages-stream">
                            {activeLead.history.map((msg, idx) => {
                                const isMe = msg.from === 'bot' || msg.from === 'agent';
                                return (
                                    <div key={idx} className={`msg-row ${isMe ? 'msg-me' : 'msg-them'}`}>
                                        <div className={`msg-bubble-premium ${msg.from}`}>
                                            <p>{msg.text}</p>
                                            <span className="msg-ts">
                                                {msg.from === 'bot' ? '🤖 ' : msg.from === 'agent' ? '👤 ' : ''}
                                                {format(new Date(msg.timestamp), 'HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="viewport-footer">
                            {activeLead.botPaused ? (
                                <form onSubmit={handleSendMessage} className="chat-composer glass-card">
                                    <button
                                        type="button"
                                        className="btn-magic"
                                        onClick={handleSuggestReply}
                                        disabled={suggesting}
                                    >
                                        {suggesting ? '⏳' : '✨'}
                                    </button>
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Sua resposta aqui..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        rows={1}
                                    />
                                    <button type="submit" disabled={sending || !messageInput.trim()} className="btn-send-msg">
                                        {sending ? '...' : '✈️'}
                                    </button>
                                </form>
                            ) : (
                                <div className="bot-lock-overlay glass-card">
                                    <span>🤖 Robô cuidando deste atendimento...</span>
                                    <button onClick={toggleBotPause} className="btn-takeover">Parar Robô e Assumir</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="nothing-selected">
                        <div className="empty-chat-icon">💬</div>
                        <h2>Gerenciamento de Atendimento</h2>
                        <p>Selecione um cliente para visualizar o histórico de conversas da IA e intervir se necessário.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .chat-interface {
                    display: flex;
                    height: calc(100vh - 8rem);
                    overflow: hidden;
                    padding: 0;
                    background: rgba(15, 23, 42, 0.4);
                }

                /* Sidebar */
                .conversations-sidebar {
                    width: 380px;
                    border-right: 1px solid var(--card-border);
                    display: flex;
                    flex-direction: column;
                    background: rgba(2, 6, 23, 0.2);
                }
                .sidebar-top { padding: 2rem 1.5rem; border-bottom: 1px solid var(--card-border); }
                .sidebar-header-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .sidebar-header-info h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
                .unread-total { background: var(--accent-color); color: var(--primary-brand); font-size: 0.8rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 2rem; }
                
                .search-wrapper { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 1rem; }
                .search-wrapper input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 0.9rem; }

                .leads-scroller { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .lead-card { display: flex; gap: 1rem; padding: 1rem; border-radius: 1rem; cursor: pointer; transition: var(--transition); border: 1px solid transparent; }
                .lead-card:hover { background: rgba(255, 255, 255, 0.03); }
                .lead-card.active { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.2); }
                
                .avatar-wrapper { position: relative; }
                .lead-avatar { width: 52px; height: 52px; border-radius: 1rem; background: var(--secondary-brand); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--accent-color); border: 1px solid var(--card-border); }
                .status-blob { position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px; border-radius: 50%; border: 3px solid var(--background); }
                .status-blob.active { background: var(--status-online); }
                .status-blob.paused { background: var(--status-busy); }

                .lead-preview-info { flex: 1; min-width: 0; }
                .lead-name-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
                .lead-name { font-weight: 700; font-size: 0.95rem; color: #fff; }
                .lead-time { font-size: 0.75rem; color: var(--text-muted); }
                .lead-msg-preview-row { display: flex; justify-content: space-between; align-items: center; }
                .lead-msg-text { font-size: 0.85rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
                .unread-indicator { width: 8px; height: 8px; background: var(--accent-color); border-radius: 50%; box-shadow: 0 0 8px var(--accent-color); flex-shrink: 0; }

                /* Chat Viewport */
                .chat-viewport { flex: 1; display: flex; flex-direction: column; background: rgba(0, 0, 0, 0.1); }
                .viewport-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; background: rgba(2, 6, 23, 0.2); }
                .header-contact-info { display: flex; align-items: center; gap: 1rem; }
                .contact-avatar { width: 48px; height: 48px; border-radius: 1rem; background: var(--gradient-accent); color: var(--primary-brand); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; }
                .contact-meta { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem; }
                .stage-tag-premium { font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 2rem; background: rgba(255,255,255,0.05); color: var(--text-muted); }
                .tag-waiting_human { color: var(--status-busy); background: rgba(245, 158, 11, 0.15); }
                .meta-phone { font-size: 0.8rem; color: var(--text-muted); }

                .btn-control { padding: 0.6rem 1.25rem; border-radius: 0.75rem; font-weight: 700; border: none; cursor: pointer; transition: var(--transition); }
                .btn-active-bot { background: var(--gradient-accent); color: var(--primary-brand); }
                .btn-pause-bot { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--card-border); }

                .messages-stream { flex: 1; overflow-y: auto; padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; background-image: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.03) 0%, transparent 100%); }
                .msg-row { display: flex; width: 100%; }
                .msg-me { justify-content: flex-end; }
                .msg-them { justify-content: flex-start; }
                
                .msg-bubble-premium { max-width: 65%; padding: 1rem 1.25rem; border-radius: 1.25rem; position: relative; }
                .msg-bubble-premium p { margin: 0; line-height: 1.6; font-size: 0.95rem; }
                .msg-ts { font-size: 0.65rem; color: rgba(255, 255, 255, 0.4); margin-top: 0.5rem; display: block; text-align: right; }

                .customer { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--card-border); color: #fff; border-bottom-left-radius: 0.25rem; }
                .agent { background: var(--gradient-accent); color: var(--primary-brand); border-bottom-right-radius: 0.25rem; }
                .bot { background: rgba(56, 189, 248, 0.15); color: var(--accent-color); border: 1px solid rgba(56, 189, 248, 0.2); border-bottom-right-radius: 0.25rem; }

                .viewport-footer { padding: 2rem; background: rgba(2, 6, 23, 0.2); border-top: 1px solid var(--card-border); }
                .chat-composer { display: flex; gap: 1rem; align-items: flex-end; padding: 0.75rem 1.25rem; border-radius: 1.25rem; }
                .chat-composer textarea { flex: 1; background: transparent; border: none; outline: none; color: #fff; resize: none; padding: 0.5rem 0; font-family: inherit; font-size: 1rem; min-height: 24px; max-height: 150px; }
                
                .btn-magic { background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); width: 44px; height: 44px; border-radius: 0.75rem; color: var(--accent-color); cursor: pointer; font-size: 1.25rem; transition: var(--transition); }
                .btn-magic:hover { transform: scale(1.1) rotate(10deg); background: var(--accent-color); color: var(--primary-brand); }
                
                .btn-send-msg { background: var(--accent-color); border: none; width: 44px; height: 44px; border-radius: 0.75rem; color: var(--primary-brand); cursor: pointer; transition: var(--transition); font-size: 1.25rem; }
                .btn-send-msg:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4); }

                .bot-lock-overlay { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; border-radius: 1.25rem; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.1); }
                .btn-takeover { background: var(--accent-color); color: var(--primary-brand); border: none; padding: 0.6rem 1rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: var(--transition); }

                .nothing-selected { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem; opacity: 0.4; }
                .empty-chat-icon { font-size: 4rem; margin-bottom: 2rem; }
            `}</style>
        </div>
    );
}
