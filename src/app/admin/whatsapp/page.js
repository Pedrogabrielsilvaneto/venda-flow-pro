'use client';
import { useState, useEffect } from 'react';

export default function WhatsAppSettings() {
    const [status, setStatus] = useState({ ready: false, qrCode: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const BOT_URL = process.env.NEXT_PUBLIC_BOT_URL || 'http://localhost:3001';

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${BOT_URL}/api/bot/status`);
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
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
        const interval = setInterval(fetchStatus, 3000);
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
            <div className="loading-state">
                <div className="spinner" />
                <p>Iniciando Motor do Robô...</p>
                <style jsx>{`
                    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; color: #64748b; }
                    .spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="wa-page">
            <div className="page-header">
                <div>
                    <h1>📱 Conexão WhatsApp</h1>
                    <p>Conecte o seu WhatsApp pessoal ou empresarial via QR Code de forma <strong>100% gratuita</strong>.</p>
                </div>
            </div>

            <div className="main-grid">
                <div className="left-col">
                    <div className="card connection-card">
                        <div className="card-header">
                            <h2>Status da Conexão</h2>
                            <span className={`status-dot ${status.ready ? 'online' : 'offline'}`} />
                        </div>

                        <div className="connection-body">
                            {error ? (
                                <div className="error-box">
                                    <span className="icon">⚠️</span>
                                    <div>
                                        <strong>Motor Offline</strong>
                                        <p>O serviço local do robô não está rodando na porta 3001.</p>
                                    </div>
                                </div>
                            ) : status.ready ? (
                                <div className="online-box">
                                    <div className="success-icon">✅</div>
                                    <h3>O Robô está Online!</h3>
                                    <p>As mensagens recebidas serão processadas automaticamente pela <strong>IA Lia</strong>.</p>
                                    <button className="btn-logout" onClick={handleLogout} disabled={loggingOut}>
                                        {loggingOut ? 'Desconectando...' : 'Desconectar WhatsApp'}
                                    </button>
                                </div>
                            ) : status.qrCode ? (
                                <div className="qr-container">
                                    <img src={status.qrCode} alt="QR Code" />
                                    <div className="qr-instructions">
                                        <h3>Escaneie o código</h3>
                                        <ol>
                                            <li>Abra o WhatsApp no seu celular</li>
                                            <li>Toque em <strong>Aparelhos conectados</strong></li>
                                            <li>Toque em <strong>Conectar um aparelho</strong></li>
                                            <li>Aponte o celular para esta tela</li>
                                        </ol>
                                    </div>
                                </div>
                            ) : (
                                <div className="loading-qr">
                                    <div className="mini-spinner" />
                                    <p>Gerando QR Code...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card info-card">
                        <h2>🚀 Vantagens do Modo QR Code</h2>
                        <ul className="perks-list">
                            <li><strong>Custo Zero</strong>: Não paga por mensagem nem por número.</li>
                            <li><strong>Simples</strong>: Funciona igual ao WhatsApp Web.</li>
                            <li><strong>IA Nativa</strong>: Respostas inteligentes via Google Gemini.</li>
                        </ul>
                    </div>
                </div>

                <div className="right-col">
                    <div className="card tips-card">
                        <h2>⚠️ Recomendações</h2>
                        <ul className="tips-list">
                            <li>Mantenha o celular com <strong>internet estável</strong>.</li>
                            <li>Evite o uso de "Mods" (WhatsApp GB, etc).</li>
                            <li>Certifique-se que o motor do robô está rodando no servidor.</li>
                        </ul>
                    </div>

                    <div className="card developer-card">
                        <h2>🛠️ Debug Status</h2>
                        <div className="debug-info">
                            <p>Motor URL: <code>{BOT_URL}</code></p>
                            <p>Status: <code>{status.ready ? 'READY' : 'WAITING_QR'}</code></p>
                            <p>Browser: <code>Chromium (Puppeteer)</code></p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .wa-page { max-width: 1000px; margin: 0 auto; }
                .page-header { margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
                .page-header h1 { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
                .page-header p { color: #64748b; margin: 0; font-size: 1rem; }
                .page-header strong { color: #2563eb; }

                .main-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
                @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }

                .left-col, .right-col { display: flex; flex-direction: column; gap: 2rem; }

                .card { background: white; border-radius: 1.25rem; border: 1px solid #e2e8f0; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
                .card-header h2 { margin: 0; font-size: 1.1rem; }

                .status-dot { width: 12px; height: 12px; border-radius: 50%; }
                .status-dot.online { background: #10b981; box-shadow: 0 0 12px rgba(16, 185, 129, 0.4); }
                .status-dot.offline { background: #cbd5e1; }

                .connection-body { min-height: 200px; display: flex; align-items: center; justify-content: center; text-align: center; }

                .online-box h3 { color: #0f172a; font-size: 1.5rem; margin: 1rem 0 0.5rem; }
                .online-box p { color: #64748b; margin-bottom: 1.5rem; }
                .success-icon { font-size: 3rem; animation: bounce 1s infinite alternate; }
                @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }

                .qr-container { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
                .qr-container img { width: 220px; height: 220px; padding: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 1rem; }
                .qr-instructions { text-align: left; }
                .qr-instructions h3 { font-size: 1.1rem; margin-bottom: 1rem; color: #0f172a; }
                .qr-instructions ol { padding-left: 1.25rem; color: #64748b; font-size: 0.875rem; line-height: 1.8; }

                .btn-logout { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.875rem; transition: 0.2s; }
                .btn-logout:hover { background: #fee2e2; border-color: #fca5a5; }

                .perks-list { list-style: none; padding: 0; margin-top: 1rem; }
                .perks-list li { margin-bottom: 0.75rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
                .perks-list li::before { content: "✨"; }

                .tips-list { padding-left: 1.25rem; color: #64748b; font-size: 0.875rem; line-height: 1.8; }
                .debug-info { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem; font-size: 0.8rem; font-family: monospace; }
                .debug-info p { margin: 0.25rem 0; }
                code { color: #2563eb; }

                .error-box { background: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; padding: 1.25rem; border-radius: 1rem; display: flex; gap: 1rem; text-align: left; }
                .error-box .icon { font-size: 1.5rem; }

                .mini-spinner { width: 24px; height: 24px; border: 2px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 0.5rem; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
