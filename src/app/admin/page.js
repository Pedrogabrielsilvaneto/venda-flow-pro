'use client';
import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STAGE_LABELS = {
    WELCOME: 'Boas-vindas',
    COLLECTING_NAME: 'Coletando Nome',
    IDENTIFYING_NEED: 'Identificando Necessidade',
    SHOWING_PRODUCTS: 'Exibindo Produtos',
    WAITING_HUMAN: 'Aguardando Humano',
};

function StatCard({ label, value, growth, icon, color = 'blue', loading }) {
    return (
        <div className="stat-card glass-card">
            <div className="stat-icon-wrapper">
                <span className="stat-icon">{icon}</span>
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
                        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}% <span className="growth-label">vs ontem</span>
                    </div>
                )}
            </div>
            <style jsx>{`
                .stat-card {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                }
                .stat-icon-wrapper {
                    width: 60px;
                    height: 60px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--card-border);
                    border-radius: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .stat-icon { font-size: 1.5rem; }
                .stat-body { flex: 1; }
                .stat-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    display: block;
                    margin-bottom: 0.25rem;
                }
                .stat-value {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text-main);
                    margin: 0;
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                }
                .stat-growth {
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                .growth-label { color: var(--text-muted); font-weight: 400; }
                .positive { color: #8c9b8c; }
                .negative { color: #a66a6a; }
                .skeleton {
                    background: rgba(141, 123, 104, 0.05);
                    border-radius: 0.5rem;
                    position: relative;
                    overflow: hidden;
                }
                .skeleton::after {
                    content: "";
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    animation: shimmer 1.5s infinite;
                }
                .skeleton-number { height: 2rem; width: 60%; }
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
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
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="title-premium">Dashboard</h1>
                    <p className="subtitle">Gestão comercial inteligente e em tempo real.</p>
                </div>
                <div className="header-date glass-card">
                    <span className="calendar-icon">📅</span>
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </div>
            </header>

            <div className="stats-grid">
                <StatCard
                    label="Contatos Totais"
                    value={stats?.totalLeads ?? '-'}
                    growth={stats?.leadsGrowth}
                    icon="👥"
                    loading={loading}
                />
                <StatCard
                    label="Interessados"
                    value={stats?.budgetsGenerated ?? '-'}
                    growth={stats?.budgetGrowth}
                    icon="📋"
                    loading={loading}
                />
                <StatCard
                    label="Eficiência IA"
                    value={`${stats?.conversionRate ?? '-'}%`}
                    icon="⚡"
                    loading={loading}
                />
                <StatCard
                    label="Fila Humana"
                    value={stats?.botPausedCount ?? '-'}
                    icon="🧑‍💻"
                    loading={loading}
                />
            </div>

            <div className="content-grid">
                <div className="glass-card main-column">
                    <div className="card-header">
                        <div className="header-title">
                            <span className="header-icon">💬</span>
                            <h2>Atividade Recente</h2>
                        </div>
                        <a href="/admin/chat" className="link-premium">Ver Inbox →</a>
                    </div>
                    
                    <div className="leads-list">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton-lead" />)
                        ) : recentLeads.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🤖</div>
                                <p>Nenhum lead detectado ainda.</p>
                            </div>
                        ) : (
                            recentLeads.map((lead) => {
                                const lastMsg = lead.history?.[lead.history?.length - 1];
                                const initials = (lead.nomeCliente || lead.phoneNumber || '?')
                                    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                                return (
                                    <a key={lead._id} href="/admin/chat" className="lead-item">
                                        <div className="lead-avatar">{initials}</div>
                                        <div className="lead-info">
                                            <div className="lead-top">
                                                <span className="lead-name">{lead.nomeCliente || lead.phoneNumber}</span>
                                                <span className="lead-time">
                                                    {lead.lastInteraction
                                                        ? formatDistanceToNow(new Date(lead.lastInteraction), { locale: ptBR, addSuffix: true })
                                                        : ''}
                                                </span>
                                            </div>
                                            <div className="lead-meta">
                                                <span className={`stage-badge stage-${lead.etapaChat?.toLowerCase()}`}>
                                                    {STAGE_LABELS[lead.etapaChat] || lead.etapaChat}
                                                </span>
                                                {lastMsg && (
                                                    <span className="last-message">
                                                        {lastMsg.text?.slice(0, 60)}{lastMsg.text?.length > 60 ? '...' : ''}
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

                <div className="glass-card side-column">
                    <div className="card-header">
                        <div className="header-title">
                            <span className="header-icon">📊</span>
                            <h2>Funil de Vendas</h2>
                        </div>
                    </div>
                    
                    <div className="funnel-container">
                        {loading ? (
                            <div className="skeleton-funnel" />
                        ) : (
                            <div className="funnel-metrics">
                                {(stats?.stageDistribution || []).map(({ _id: stage, count }) => {
                                    const total = stats?.totalLeads || 1;
                                    const pct = Math.round((count / total) * 100);
                                    return (
                                        <div key={stage} className="funnel-row">
                                            <div className="funnel-info">
                                                <span className="funnel-label">{STAGE_LABELS[stage] || stage}</span>
                                                <span className="funnel-val">{count}</span>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="quick-actions-section">
                        <h3>Gestão Rápida</h3>
                        <div className="action-buttons">
                            <a href="/admin/products" className="action-link"><span>📦</span> Catálogo de Produtos</a>
                            <a href="/admin/users" className="action-link"><span>👥</span> Gerenciar Equipe</a>
                            <a href="/admin/whatsapp" className="action-link"><span>📱</span> Status do Gateway</a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dashboard-container { display: flex; flex-direction: column; gap: 2.5rem; }
                
                .dashboard-header { display: flex; justify-content: space-between; align-items: center; }
                .subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-top: 0.5rem; }
                .header-date { padding: 0.75rem 1.25rem; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem; border-radius: var(--radius-md); color: var(--text-main); }
                .calendar-icon { font-size: 1.1rem; opacity: 0.8; }

                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }

                .content-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; align-items: start; }
                @media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; } }

                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .header-title { display: flex; align-items: center; gap: 0.75rem; }
                .header-icon { font-size: 1.25rem; }
                .header-title h2 { font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--text-main); }
                .link-premium { color: var(--secondary-brand); font-weight: 600; font-size: 0.9rem; transition: var(--transition); }
                .link-premium:hover { letter-spacing: 0.05em; }

                .leads-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .lead-item { display: flex; gap: 1rem; align-items: center; padding: 1rem; border-radius: var(--radius-md); transition: var(--transition); border: 1px solid transparent; text-decoration: none; }
                .lead-item:hover { background: rgba(141, 123, 104, 0.03); border-color: var(--card-border); transform: translateX(8px); }
                
                .lead-avatar { width: 48px; height: 48px; border-radius: 0.75rem; background: var(--secondary-brand); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; color: white; border: 1px solid var(--card-border); }
                .lead-info { flex: 1; min-width: 0; }
                .lead-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
                .lead-name { font-weight: 700; color: var(--text-main); }
                .lead-time { font-size: 0.75rem; color: var(--text-muted); }
                
                .lead-meta { display: flex; align-items: center; gap: 1rem; overflow: hidden; }
                .stage-badge { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 2rem; background: rgba(0,0,0,0.05); color: var(--text-dim); text-transform: uppercase; }
                .stage-welcoming, .stage-collecting_name { color: #8d7b68; background: rgba(141, 123, 104, 0.1); }
                .stage-showing_products { color: var(--text-main); background: rgba(74, 63, 53, 0.1); }
                .stage-waiting_human { color: #d6b58c; background: rgba(214, 181, 140, 0.1); }
                
                .last-message { font-size: 0.85rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                .funnel-container { margin-bottom: 2.5rem; }
                .funnel-row { margin-bottom: 1.25rem; }
                .funnel-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.85rem; }
                .funnel-label { color: var(--text-muted); font-weight: 500; }
                .funnel-val { color: var(--text-main); font-weight: 700; }
                .progress-bg { height: 6px; background: rgba(0, 0, 0, 0.05); border-radius: 10px; overflow: hidden; }
                .progress-fill { height: 100%; background: var(--gradient-accent); border-radius: 10px; transition: width 1s ease-out; }

                .quick-actions-section h3 { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1.25rem; letter-spacing: 0.05em; }
                .action-buttons { display: flex; flex-direction: column; gap: 0.75rem; }
                .action-link { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: white; border: 1px solid var(--card-border); border-radius: 0.75rem; font-size: 0.9rem; font-weight: 600; color: var(--text-main); transition: var(--transition); text-decoration: none; }
                .action-link:hover { background: rgba(200, 182, 166, 0.05); border-color: var(--accent-color); transform: translateY(-2px); }
                
                .empty-state { padding: 3rem 1rem; text-align: center; color: var(--text-muted); }
                .empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5; }

                .skeleton-lead { height: 68px; border-radius: 1rem; background: rgba(0,0,0,0.03); margin-bottom: 0.75rem; }
                .skeleton-funnel { height: 200px; border-radius: 1rem; background: rgba(0,0,0,0.03); }
            `}</style>
        </div>
    );
}
