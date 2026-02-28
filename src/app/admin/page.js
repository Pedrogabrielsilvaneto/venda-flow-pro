'use client';
import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STAGE_LABELS = {
    WELCOME: 'Boas-vindas',
    WAITING_NAME: 'Aguardando nome',
    WAITING_EMAIL: 'Aguardando e-mail',
    SHOWING_CATEGORIES: 'Escolhendo categoria',
    BROWSING: 'Navegando catálogo',
    WAITING_MEASUREMENT: 'Aguardando medida',
    DONE: 'Orçamento gerado',
};

function StatCard({ label, value, growth, icon, color = 'emerald', loading }) {
    const colors = {
        emerald: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' },
        indigo: { bg: 'rgba(99,102,241,0.1)', text: '#6366f1', border: 'rgba(99,102,241,0.2)' },
        amber: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
        rose: { bg: 'rgba(244,63,94,0.1)', text: '#f43f5e', border: 'rgba(244,63,94,0.2)' },
    };
    const c = colors[color];

    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            </div>
            <div className="stat-body">
                <span className="stat-label">{label}</span>
                {loading ? (
                    <div className="skeleton skeleton-number" />
                ) : (
                    <h3 className="stat-value">{value}</h3>
                )}
                {growth !== undefined && !loading && (
                    <div className={`stat-growth ${growth >= 0 ? 'positive' : 'negative'}`}>
                        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}% vs ontem
                    </div>
                )}
            </div>
            <style jsx>{`
                .stat-card {
                    background: white;
                    border-radius: 1rem;
                    padding: 1.5rem;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                    transition: box-shadow 0.2s, transform 0.2s;
                }
                .stat-card:hover {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                .stat-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .stat-body { flex: 1; }
                .stat-label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0.25rem 0 0.25rem;
                    line-height: 1;
                }
                .stat-growth {
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .positive { color: #10b981; }
                .negative { color: #f43f5e; }
                .skeleton {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                }
                .skeleton-number { height: 2.5rem; width: 80%; margin-top: 0.25rem; }
                @keyframes shimmer { to { background-position: -200% 0; } }
            `}</style>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const recentLeads = stats?.recentLeads || [];

    return (
        <div className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Visão geral do desempenho do bot em tempo real.</p>
                </div>
                <div className="header-date">
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    label="Contatos Totais"
                    value={stats?.totalLeads ?? '-'}
                    growth={stats?.leadsGrowth}
                    icon="👥"
                    color="emerald"
                    loading={loading}
                />
                <StatCard
                    label="Orçamentos Gerados"
                    value={stats?.budgetsGenerated ?? '-'}
                    growth={stats?.budgetGrowth}
                    icon="📋"
                    color="indigo"
                    loading={loading}
                />
                <StatCard
                    label="Taxa de Conversão"
                    value={`${stats?.conversionRate ?? '-'}%`}
                    icon="🎯"
                    color="amber"
                    loading={loading}
                />
                <StatCard
                    label="Atendimento Humano"
                    value={stats?.botPausedCount ?? '-'}
                    icon="🧑‍💻"
                    color="rose"
                    loading={loading}
                />
            </div>

            <div className="bottom-grid">
                {/* Recent Interactions */}
                <div className="card">
                    <div className="card-header">
                        <h2>Últimas Interações</h2>
                        <a href="/admin/chat" className="view-all">Ver todas →</a>
                    </div>
                    <div className="interactions-list">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="interaction-item">
                                    <div className="skeleton skeleton-avatar" />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton skeleton-line-lg" />
                                        <div className="skeleton skeleton-line-sm" />
                                    </div>
                                </div>
                            ))
                        ) : recentLeads.length === 0 ? (
                            <div className="empty-state">
                                <p>💬 Nenhuma interação ainda.</p>
                                <p>Aguarde os primeiros clientes chegarem!</p>
                            </div>
                        ) : (
                            recentLeads.map((lead) => {
                                const lastMsg = lead.history?.[lead.history?.length - 1];
                                const initials = (lead.name || lead.phoneNumber || '?')
                                    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                                return (
                                    <a key={lead._id} href="/admin/chat" className="interaction-item">
                                        <div className="avatar">{initials}</div>
                                        <div className="interaction-body">
                                            <div className="interaction-header">
                                                <span className="interaction-name">{lead.name || lead.phoneNumber}</span>
                                                <span className="interaction-time">
                                                    {lead.lastInteraction
                                                        ? formatDistanceToNow(new Date(lead.lastInteraction), { locale: ptBR, addSuffix: true })
                                                        : ''}
                                                </span>
                                            </div>
                                            <div className="interaction-preview">
                                                <span className="stage-tag">
                                                    {STAGE_LABELS[lead.stage] || lead.stage}
                                                </span>
                                                {lastMsg && (
                                                    <span className="last-msg">
                                                        {lastMsg.from === 'bot' ? '🤖 ' : lastMsg.from === 'agent' ? '👨‍💻 ' : ''}
                                                        {lastMsg.text?.slice(0, 40)}{lastMsg.text?.length > 40 ? '...' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </a>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Stage Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h2>Funil de Atendimento</h2>
                    </div>
                    {loading ? (
                        <div style={{ padding: '1rem' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ marginBottom: '1rem' }}>
                                    <div className="skeleton" style={{ height: '1rem', width: '60%', marginBottom: '0.5rem', borderRadius: '4px' }} />
                                    <div className="skeleton" style={{ height: '0.75rem', width: '100%', borderRadius: '4px' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="funnel-list">
                            {(stats?.stageDistribution || []).map(({ _id: stage, count }) => {
                                const total = stats?.totalLeads || 1;
                                const pct = Math.round((count / total) * 100);
                                const stageColors = {
                                    DONE: '#10b981',
                                    WAITING_MEASUREMENT: '#6366f1',
                                    BROWSING: '#f59e0b',
                                    SHOWING_CATEGORIES: '#0ea5e9',
                                    WAITING_EMAIL: '#a855f7',
                                    WAITING_NAME: '#f43f5e',
                                    WELCOME: '#64748b',
                                };
                                const color = stageColors[stage] || '#94a3b8';
                                return (
                                    <div key={stage} className="funnel-item">
                                        <div className="funnel-header">
                                            <span className="funnel-label">{STAGE_LABELS[stage] || stage}</span>
                                            <span className="funnel-count">{count} <small>({pct}%)</small></span>
                                        </div>
                                        <div className="funnel-bar-bg">
                                            <div
                                                className="funnel-bar-fill"
                                                style={{ width: `${pct}%`, background: color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {(!stats?.stageDistribution || stats.stageDistribution.length === 0) && (
                                <div className="empty-state">
                                    <p>🤖 Nenhum dado de funil ainda.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick actions */}
                    <div className="quick-actions">
                        <h3>Ações Rápidas</h3>
                        <div className="actions-grid">
                            <a href="/admin/chat" className="action-btn">
                                <span>💬</span> Inbox
                            </a>
                            <a href="/admin/products" className="action-btn">
                                <span>📦</span> Produtos
                            </a>
                            <a href="/admin/config" className="action-btn">
                                <span>⚙️</span> Configurações
                            </a>
                            <a href="/admin/users" className="action-btn">
                                <span>👥</span> Equipe
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dashboard { padding-bottom: 3rem; }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .page-header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 0.25rem;
                }
                .page-header p {
                    color: #64748b;
                    margin: 0;
                }
                .header-date {
                    font-size: 0.875rem;
                    color: #64748b;
                    background: #f8fafc;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                    text-transform: capitalize;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.25rem;
                    margin-bottom: 2rem;
                }

                @media (max-width: 1100px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                    .stats-grid { grid-template-columns: 1fr; }
                }

                .bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                @media (max-width: 900px) {
                    .bottom-grid { grid-template-columns: 1fr; }
                }

                .card {
                    background: white;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    overflow: hidden;
                }

                .card-header {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .card-header h2 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }
                .view-all {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #10b981;
                    text-decoration: none;
                }
                .view-all:hover { text-decoration: underline; }

                .interactions-list { overflow-y: auto; max-height: 320px; }

                .interaction-item {
                    display: flex;
                    gap: 0.875rem;
                    align-items: center;
                    padding: 0.875rem 1.5rem;
                    border-bottom: 1px solid #f8fafc;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background 0.15s;
                }
                .interaction-item:hover { background: #f8fafc; }
                .interaction-item:last-child { border-bottom: none; }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.875rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .interaction-body { flex: 1; min-width: 0; }
                .interaction-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.25rem;
                }
                .interaction-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #1e293b;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .interaction-time {
                    font-size: 0.72rem;
                    color: #94a3b8;
                    white-space: nowrap;
                    margin-left: 0.5rem;
                }
                .interaction-preview {
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                }
                .stage-tag {
                    font-size: 0.72rem;
                    color: #6366f1;
                    font-weight: 600;
                }
                .last-msg {
                    font-size: 0.78rem;
                    color: #94a3b8;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .funnel-list { padding: 1.25rem 1.5rem; }
                .funnel-item { margin-bottom: 1rem; }
                .funnel-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.35rem;
                    align-items: center;
                }
                .funnel-label {
                    font-size: 0.825rem;
                    font-weight: 600;
                    color: #334155;
                }
                .funnel-count {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #0f172a;
                }
                .funnel-count small { color: #94a3b8; font-weight: 400; }
                .funnel-bar-bg {
                    height: 8px;
                    background: #f1f5f9;
                    border-radius: 999px;
                    overflow: hidden;
                }
                .funnel-bar-fill {
                    height: 100%;
                    border-radius: 999px;
                    transition: width 0.6s ease;
                }

                .quick-actions {
                    padding: 1.25rem 1.5rem;
                    border-top: 1px solid #f1f5f9;
                }
                .quick-actions h3 {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 0.75rem;
                }
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.5rem;
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 0.875rem;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    font-size: 0.825rem;
                    font-weight: 600;
                    color: #334155;
                    text-decoration: none;
                    transition: 0.2s;
                    cursor: pointer;
                }
                .action-btn:hover {
                    background: #e0e7ff;
                    border-color: #c7d2fe;
                    color: #4338ca;
                }

                .empty-state {
                    text-align: center;
                    padding: 2rem;
                    color: #94a3b8;
                }
                .empty-state p { margin: 0.25rem 0; font-size: 0.875rem; }

                .skeleton {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                }
                .skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; }
                .skeleton-line-lg { height: 0.9rem; width: 70%; margin-bottom: 0.35rem; border-radius: 4px; }
                .skeleton-line-sm { height: 0.75rem; width: 90%; border-radius: 4px; }
                @keyframes shimmer { to { background-position: -200% 0; } }
            `}</style>
        </div>
    );
}
