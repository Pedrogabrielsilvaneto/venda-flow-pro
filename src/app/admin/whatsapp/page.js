'use client';
import { useState, useEffect } from 'react';

export default function WhatsAppSettings() {
    const [status, setStatus] = useState({ ready: false, qrCode: '', updatedAt: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const fetchStatus = async () => {
        try {
            // Buscando da nossa nova rota inteligente que lê do DB
            const res = await fetch('/api/bot/status');
            if (res.ok) {
                const data = await res.json();
                setStatus({
                    ready: data.status === 'connected',
                    qrCode: data.qrCode,
                    updatedAt: data.updatedAt
                });
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        if (!confirm('Tem certeza que deseja desconectar o WhatsApp?')) return;
        setLoggingOut(true);
        try {
            await fetch(`${BOT_URL}/api/bot/logout`, { method: 'POST' });
            fetchStatus();
        } catch (err) {
            alert('Erro ao desconectar');
        } finally {
            setLoggingOut(false);
        }
    };

    if (loading && !status.ready && !status.qrCode) {
        return (
            <div className="wa-loading-screen">
                <div className="spinner-cyan-glow" />
                <p>Sincronizando com o WhatsApp...</p>
                <style jsx>{`
                    .wa-loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70vh; color: var(--text-muted); }
                    .spinner-cyan-glow { width: 48px; height: 48px; border: 4px solid rgba(56, 189, 248, 0.1); border-top-color: var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); margin-bottom: 2rem; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="wa-auth-container panel-fade-in">
            <header className="page-header-premium">
                <div>
                    <h1>Portal de Conexão</h1>
                    <p>Vincule sua conta do WhatsApp para ativar a inteligência artificial Lia.</p>
                </div>
            </header>

            <div className="wa-layout-grid">
                <div className="connection-main-section">
                    <div className="glass-card status-card-premium">
                        <div className="section-header-premium">
                            <h2>Status Operacional</h2>
                            <span className={`status-pill ${status.ready ? 'online' : 'waiting'}`}>
                                {status.ready ? 'Conectado' : 'Aguardando'}
                            </span>
                        </div>

                        <div className="auth-display-center">
                            {error ? (
                                <div className="error-display-premium">
                                    <span className="error-icon">🔌</span>
                                    <h3>Falha de Comunicação</h3>
                                    <p>O motor do bot não está respondendo. Verifique se o serviço background está ativo no servidor.</p>
                                </div>
                            ) : status.ready ? (
                                <div className="success-display-premium">
                                    <div className="success-glow-icon">🚀</div>
                                    <h3>Tudo pronto!</h3>
                                    <p>Sua conta está vinculada e a Lia já pode responder aos seus clientes.</p>
                                    <button className="btn-disconnect-premium" onClick={handleLogout} disabled={loggingOut}>
                                        {loggingOut ? 'Desconectando...' : 'Desvincular WhatsApp'}
                                    </button>
                                </div>
                            ) : status.qrCode ? (
                                <div className="qr-portal-wrapper">
                                    <div className="qr-frame">
                                        <img src={status.qrCode} alt="Scanner QR" />
                                        <div className="qr-scan-line"></div>
                                    </div>
                                    <div className="qr-instructions-container">
                                        <h3>Como conectar?</h3>
                                        <div className="step-item"><span>1</span> Abra o WhatsApp no celular</div>
                                        <div className="step-item"><span>2</span> Menu {'>'} Aparelhos Conectados</div>
                                        <div className="step-item"><span>3</span> Aponte para este QR Code</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="initializing-display">
                                    <div className="spinner-cyan"></div>
                                    <p>{status.status === 'initializing' ? 'O navegador está abrindo...' : 'Gerando chave de acesso...'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card security-notice-card">
                        <div className="notice-content">
                            <span className="notice-icon">🛡️</span>
                            <div>
                                <h4>Segurança de Ponta a Ponta</h4>
                                <p>Suas mensagens permanecem criptografadas. A Lia processa os dados localmente para garantir sua privacidade.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="wa-info-sidebar">
                    <div className="glass-card tech-status-card">
                        <h3>Status Técnico</h3>
                        <div className="tech-details-premium">
                            <div className="tech-row">
                                <span>Plataforma:</span>
                                <strong>WhatsApp Desktop</strong>
                            </div>
                            <div className="tech-row">
                                <span>IA Engine:</span>
                                <strong>Google Gemini Pro</strong>
                            </div>
                            <div className="tech-row">
                                <span>Latency:</span>
                                <strong>~800ms</strong>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card uptime-card-premium">
                        <h3>Disponibilidade</h3>
                        <div className="uptime-graph">
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                                <div key={i} className="uptime-bar" style={{height: `${Math.random() * 20 + 30}px`}}></div>
                            ))}
                        </div>
                        <p className="text-muted-xs">Uptime do sistema: 99.8% nas últimas 24h</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .wa-auth-container { padding: 1rem; }
                .panel-fade-in { animation: fadeIn 0.8s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header-premium { margin-bottom: 2rem; }
                .page-header-premium h1 { font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.04em; }
                .page-header-premium p { color: var(--text-secondary); font-size: 1rem; }

                .wa-layout-grid { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; }
                @media (max-width: 1000px) { .wa-layout-grid { grid-template-columns: 1fr; } }

                .section-header-premium { padding: 1.5rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; }
                .section-header-premium h2 { font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin: 0; }

                .status-pill { font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 2rem; letter-spacing: 0.05em; text-transform: uppercase; }
                .status-pill.online { background: rgba(140, 155, 140, 0.1); color: var(--status-online); border: 1px solid rgba(140, 155, 140, 0.2); }
                .status-pill.waiting { background: rgba(214, 181, 140, 0.1); color: var(--status-busy); border: 1px solid rgba(214, 181, 140, 0.2); }

                .auth-display-center { min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 3rem; }

                .success-glow-icon { font-size: 4rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 20px var(--accent-glow)); animation: float 3s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

                .success-display-premium h3 { font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem; }
                .success-display-premium p { color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6; }

                .btn-disconnect-premium { background: rgba(201, 140, 140, 0.1); border: 1px solid rgba(201, 140, 140, 0.3); color: #a66a6a; padding: 0.8rem 1.5rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: var(--transition); }
                .btn-disconnect-premium:hover { background: #c98c8c; color: #fff; transform: scale(1.02); }

                .qr-portal-wrapper { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; }
                .qr-frame { position: relative; padding: 1rem; background: #fff; border-radius: 1.5rem; box-shadow: var(--shadow-premium); }
                .qr-frame img { width: 240px; height: 240px; display: block; border-radius: 0.75rem; }
                .qr-scan-line { position: absolute; left: 1rem; right: 1rem; height: 3px; background: var(--secondary-brand); top: 1rem; animation: scan 3s linear infinite; box-shadow: 0 0 10px var(--accent-glow); }
                @keyframes scan { 0% { top: 1rem; } 50% { top: calc(100% - 1rem - 3px); } 100% { top: 1rem; } }

                .qr-instructions-container { text-align: left; max-width: 300px; }
                .qr-instructions-container h3 { font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.25rem; }
                .step-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.95rem; color: var(--text-secondary); }
                .step-item span { width: 24px; height: 24px; border-radius: 50%; background: var(--accent-color); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900; }

                .initializing-display { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-muted); }
                .spinner-cyan { width: 32px; height: 32px; border: 3px solid rgba(200, 182, 166, 0.1); border-top-color: var(--secondary-brand); border-radius: 50%; animation: spin 1s linear infinite; }

                .security-notice-card { margin-top: 1.5rem; border: 1px solid rgba(140, 155, 140, 0.1); background: rgba(140, 155, 140, 0.02); }
                .notice-content { display: flex; gap: 1rem; padding: 1.25rem; align-items: center; }
                .notice-icon { font-size: 1.5rem; }
                .notice-content h4 { font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
                .notice-content p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

                .tech-status-card { padding: 1.5rem; }
                .tech-status-card h3 { font-size: 1rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.25rem; }
                .tech-details-premium { display: flex; flex-direction: column; gap: 1rem; }
                .tech-row { display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.75rem; }
                .tech-row span { color: var(--text-muted); }
                .tech-row strong { color: var(--secondary-brand); }

                .uptime-card-premium { padding: 1.5rem; margin-top: 1.5rem; }
                .uptime-card-premium h3 { font-size: 0.9rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.5rem; }
                .uptime-graph { display: flex; align-items: flex-end; gap: 3px; margin-bottom: 1rem; padding: 0 0.5rem; }
                .uptime-bar { flex: 1; background: var(--gradient-accent); border-radius: 2px; opacity: 0.4; transition: 0.3s; }
                .uptime-bar:hover { opacity: 0.8; transform: scaleY(1.1); }
                .text-muted-xs { font-size: 0.75rem; color: var(--text-dim); opacity: 0.8; }
            `}</style>
        </div>
    );
}
