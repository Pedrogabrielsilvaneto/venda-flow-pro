'use client';
import { useState, useEffect } from 'react';

export default function WhatsAppSettings() {
    const [config, setConfig] = useState({
        phoneNumberId: '',
        accessToken: '',
        verifyToken: '',
    });
    const [apiStatus, setApiStatus] = useState(null); // null | 'checking' | 'ok' | 'error'
    const [apiInfo, setApiInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                const map = {};
                if (Array.isArray(data)) {
                    data.forEach(c => { map[c.key] = c.value; });
                }
                setConfig({
                    phoneNumberId: map['whatsapp_phone_number_id'] || '',
                    accessToken: map['whatsapp_access_token'] || '',
                    verifyToken: map['whatsapp_verify_token'] || '',
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const testConnection = async () => {
        if (!config.phoneNumberId || !config.accessToken) {
            setErrorMsg('Preencha o Phone Number ID e o Access Token antes de testar.');
            return;
        }
        setApiStatus('checking');
        setApiInfo(null);
        setErrorMsg('');

        try {
            const res = await fetch(
                `https://graph.facebook.com/v22.0/${config.phoneNumberId}?fields=id,display_phone_number,verified_name,quality_rating,platform_type,status`,
                { headers: { Authorization: `Bearer ${config.accessToken}` } }
            );
            const data = await res.json();

            if (data.error) {
                setApiStatus('error');
                setErrorMsg(data.error.message || 'Credenciais inválidas.');
            } else {
                setApiStatus('ok');
                setApiInfo(data);
            }
        } catch (err) {
            setApiStatus('error');
            setErrorMsg('Erro de conexão. Verifique as credenciais.');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        setErrorMsg('');
        const entries = [
            { key: 'whatsapp_phone_number_id', value: config.phoneNumberId },
            { key: 'whatsapp_access_token', value: config.accessToken },
            { key: 'whatsapp_verify_token', value: config.verifyToken },
        ];
        try {
            await Promise.all(entries.map(e =>
                fetch('/api/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(e),
                })
            ));
            setSaved(true);
            setTimeout(() => setSaved(false), 4000);
        } catch {
            setErrorMsg('Erro ao salvar. Tente novamente.');
        }
        setSaving(false);
    };

    const [showToken, setShowToken] = useState(false);

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/webhook`
        : 'https://seu-app.vercel.app/api/webhook';

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="spinner" />
                <style jsx>{`.spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="wa-page">
            <div className="page-header">
                <h1>📱 WhatsApp Business API</h1>
                <p>Configure as credenciais da Meta / WhatsApp Cloud API para o robô Lia funcionar.</p>
            </div>

            {/* Status Banner */}
            {apiStatus && (
                <div className={`status-banner ${apiStatus}`}>
                    {apiStatus === 'checking' && (
                        <><span className="mini-spinner" /> Verificando conexão com a Meta API...</>
                    )}
                    {apiStatus === 'ok' && apiInfo && (
                        <>
                            <span className="status-icon">✅</span>
                            <div>
                                <strong>Conectado com sucesso!</strong>
                                <p>
                                    Número: <strong>{apiInfo.display_phone_number}</strong> ·
                                    Nome: <strong>{apiInfo.verified_name}</strong> ·
                                    Qualidade: <strong>{apiInfo.quality_rating}</strong> ·
                                    Status: <strong>{apiInfo.status}</strong>
                                </p>
                            </div>
                        </>
                    )}
                    {apiStatus === 'error' && (
                        <>
                            <span className="status-icon">❌</span>
                            <div>
                                <strong>Falha na conexão</strong>
                                <p>{errorMsg}</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {errorMsg && apiStatus !== 'error' && (
                <div className="error-alert">{errorMsg}</div>
            )}

            {/* Main Grid */}
            <div className="main-grid">
                <div className="left-col">
                    {/* Credentials Card */}
                    <div className="card">
                        <div className="card-top">
                            <h2>🔑 Credenciais da API</h2>
                            <p>Obtidas no <a href="https://developers.facebook.com" target="_blank" rel="noreferrer">Meta for Developers</a>.</p>
                        </div>

                        <div className="form-section">
                            <div className="form-group">
                                <label>Phone Number ID</label>
                                <p className="field-help">Encontrado em: Meta Developers → WhatsApp → API Setup</p>
                                <input
                                    type="text"
                                    placeholder="Ex: 123456789012345"
                                    value={config.phoneNumberId}
                                    onChange={e => setConfig(c => ({ ...c, phoneNumberId: e.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Access Token (Permanente)</label>
                                <p className="field-help">Token de sistema gerado no Meta Business com permissão <code>whatsapp_business_messaging</code></p>
                                <div className="password-wrap">
                                    <input
                                        type={showToken ? 'text' : 'password'}
                                        placeholder="EAAxxxxxxx..."
                                        value={config.accessToken}
                                        onChange={e => setConfig(c => ({ ...c, accessToken: e.target.value }))}
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowToken(v => !v)}>
                                        {showToken ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Verify Token (Webhook)</label>
                                <p className="field-help">Token secreto que você define ao configurar o webhook no Meta Developers</p>
                                <input
                                    type="text"
                                    placeholder="Ex: meu_token_secreto_123"
                                    value={config.verifyToken}
                                    onChange={e => setConfig(c => ({ ...c, verifyToken: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="card-footer">
                            <button className="btn-test" onClick={testConnection} disabled={apiStatus === 'checking'}>
                                {apiStatus === 'checking' ? 'Verificando...' : '🔍 Testar Conexão'}
                            </button>
                            <button className="btn-save" onClick={handleSave} disabled={saving}>
                                {saving ? 'Salvando...' : saved ? '✅ Salvo!' : '💾 Salvar Credenciais'}
                            </button>
                        </div>
                    </div>

                    {/* Webhook Info Card */}
                    <div className="card">
                        <div className="card-top">
                            <h2>🔗 URL do Webhook</h2>
                            <p>Configure esta URL no painel do Meta Developers para receber mensagens.</p>
                        </div>

                        <div className="webhook-url-box">
                            <code>{webhookUrl}</code>
                            <button
                                className="btn-copy"
                                onClick={() => navigator.clipboard.writeText(webhookUrl)}
                            >
                                📋 Copiar
                            </button>
                        </div>

                        <div className="steps-list">
                            <h3>Como configurar no Meta Developers:</h3>
                            <ol>
                                <li>Acesse <a href="https://developers.facebook.com" target="_blank" rel="noreferrer">developers.facebook.com</a> → seu app</li>
                                <li>Vá em <strong>WhatsApp → Configuration → Webhook</strong></li>
                                <li>Clique em <strong>Edit</strong> e cole a URL acima</li>
                                <li>No campo <strong>Verify Token</strong>, use o mesmo token configurado aqui</li>
                                <li>Clique em <strong>Verify and Save</strong></li>
                                <li>Ative o campo <strong>messages</strong> em Webhook fields</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Right Col - Info & Tips */}
                <div className="right-col">
                    <div className="card info-card">
                        <h2>🤖 Como Funciona</h2>
                        <div className="info-steps">
                            <div className="info-step">
                                <div className="step-num">1</div>
                                <div>
                                    <strong>Cliente manda mensagem</strong>
                                    <p>O WhatsApp entrega ao webhook (<code>/api/webhook</code>) desta aplicação</p>
                                </div>
                            </div>
                            <div className="info-step">
                                <div className="step-num">2</div>
                                <div>
                                    <strong>Bot processa</strong>
                                    <p>A Lia analisa a mensagem e decide a resposta baseada no estágio do lead</p>
                                </div>
                            </div>
                            <div className="info-step">
                                <div className="step-num">3</div>
                                <div>
                                    <strong>Resposta enviada</strong>
                                    <p>A API do Meta envia a resposta via WhatsApp Business para o cliente</p>
                                </div>
                            </div>
                            <div className="info-step">
                                <div className="step-num">4</div>
                                <div>
                                    <strong>Atendente intervém (opcional)</strong>
                                    <p>Via Inbox, o atendente pode pausar o bot e assumir a conversa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card tips-card">
                        <h2>⚠️ Atenção</h2>
                        <ul className="tips-list">
                            <li>Use um <strong>Token Permanente</strong> (não o token temporário de 24h)</li>
                            <li>O número precisa estar <strong>verifivado</strong> no Meta Business</li>
                            <li>O webhook só funciona em URLs <strong>HTTPS</strong> (Vercel já garante isso)</li>
                            <li>Na janela de 24h do WhatsApp, só é possível responder mensagens recebidas</li>
                            <li>Para mensagens fora da janela, use <strong>Templates aprovados</strong></li>
                        </ul>
                    </div>

                    <div className="card links-card">
                        <h2>🔗 Links Úteis</h2>
                        <div className="links-list">
                            <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank" rel="noreferrer">
                                📖 Documentação Cloud API
                            </a>
                            <a href="https://business.facebook.com/settings" target="_blank" rel="noreferrer">
                                🏢 Meta Business Suite
                            </a>
                            <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer">
                                🛠️ Meta for Developers
                            </a>
                            <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noreferrer">
                                🔬 Graph API Explorer
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .wa-page { padding-bottom: 3rem; }
                .page-header { margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.875rem; font-weight: 800; color: #0f172a; margin: 0 0 0.4rem; }
                .page-header p { color: #64748b; margin: 0; }

                .status-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-radius: 0.875rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                .status-banner.checking {
                    background: #eff6ff;
                    border-color: #bfdbfe;
                    color: #1d4ed8;
                    align-items: center;
                }
                .status-banner.ok { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
                .status-banner.error { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
                .status-banner p { margin: 0.2rem 0 0; font-size: 0.82rem; }
                .status-icon { font-size: 1.5rem; flex-shrink: 0; }
                .mini-spinner {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(29,78,216,0.3);
                    border-top-color: #1d4ed8;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-right: 0.5rem;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .error-alert {
                    background: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                    padding: 0.875rem 1rem;
                    border-radius: 0.625rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.875rem;
                }

                .main-grid {
                    display: grid;
                    grid-template-columns: 3fr 2fr;
                    gap: 1.5rem;
                    align-items: start;
                }
                @media (max-width: 900px) {
                    .main-grid { grid-template-columns: 1fr; }
                }
                .left-col, .right-col {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .card {
                    background: white;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .card-top {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .card-top h2 { margin: 0 0 0.25rem; font-size: 1rem; color: #0f172a; }
                .card-top p { margin: 0; color: #64748b; font-size: 0.82rem; }
                .card-top a { color: #6366f1; }

                .form-section { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
                .form-group label { font-size: 0.875rem; font-weight: 600; color: #374151; }
                .field-help { font-size: 0.76rem; color: #94a3b8; margin: 0 0 0.35rem; }
                code {
                    background: #f1f5f9;
                    padding: 0.1rem 0.35rem;
                    border-radius: 0.25rem;
                    font-family: monospace;
                    font-size: 0.8rem;
                    color: #6366f1;
                }

                .password-wrap { position: relative; }
                .password-wrap input { padding-right: 3rem; }
                .eye-btn {
                    position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
                    background: none; border: none; cursor: pointer; font-size: 1.1rem;
                    padding: 0; color: #94a3b8; line-height: 1;
                }
                .eye-btn:hover { color: #475569; }

                .card-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #f1f5f9;
                    display: flex;
                    gap: 0.75rem;
                    justify-content: flex-end;
                    flex-wrap: wrap;
                }
                .btn-test {
                    background: #f8fafc;
                    color: #6366f1;
                    border: 1.5px solid #c7d2fe;
                    padding: 0.6rem 1.25rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                .btn-test:hover:not(:disabled) { background: #eff6ff; }
                .btn-test:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-save {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 0.6rem 1.5rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                .btn-save:hover:not(:disabled) { background: #059669; }
                .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

                .webhook-url-box {
                    margin: 1.25rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.625rem;
                    padding: 0.75rem 1rem;
                }
                .webhook-url-box code {
                    flex: 1;
                    background: none;
                    color: #1e293b;
                    font-size: 0.825rem;
                    word-break: break-all;
                    padding: 0;
                }
                .btn-copy {
                    background: white;
                    border: 1px solid #e2e8f0;
                    color: #475569;
                    padding: 0.4rem 0.75rem;
                    border-radius: 0.4rem;
                    font-size: 0.78rem;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .btn-copy:hover { background: #f1f5f9; }

                .steps-list { padding: 0 1.5rem 1.25rem; }
                .steps-list h3 { font-size: 0.875rem; font-weight: 700; color: #374151; margin: 0 0 0.75rem; }
                .steps-list ol { margin: 0; padding-left: 1.25rem; color: #64748b; font-size: 0.82rem; line-height: 2; }
                .steps-list a { color: #6366f1; }
                .steps-list strong { color: #334155; }

                /* Right col cards */
                .info-card, .tips-card, .links-card { padding: 1.25rem 1.5rem; }
                .info-card h2, .tips-card h2, .links-card h2 {
                    font-size: 0.95rem;
                    margin: 0 0 1rem;
                    color: #0f172a;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .info-steps { display: flex; flex-direction: column; gap: 1rem; }
                .info-step {
                    display: flex;
                    gap: 0.875rem;
                    align-items: flex-start;
                }
                .step-num {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    font-size: 0.78rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                .info-step strong { font-size: 0.875rem; color: #1e293b; display: block; margin-bottom: 0.2rem; }
                .info-step p { margin: 0; font-size: 0.78rem; color: #64748b; line-height: 1.5; }
                .info-step code { font-size: 0.75rem; }

                .tips-list {
                    margin: 0;
                    padding-left: 1.25rem;
                    color: #64748b;
                    font-size: 0.82rem;
                    line-height: 1.9;
                }
                .tips-list strong { color: #334155; }

                .links-list { display: flex; flex-direction: column; gap: 0.5rem; }
                .links-list a {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #6366f1;
                    text-decoration: none;
                    padding: 0.6rem 0.875rem;
                    border-radius: 0.5rem;
                    border: 1px solid #e0e7ff;
                    background: #f5f3ff;
                    font-weight: 500;
                    transition: 0.15s;
                }
                .links-list a:hover { background: #ede9fe; border-color: #c4b5fd; color: #4f46e5; }
            `}</style>
        </div>
    );
}
