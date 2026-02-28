'use client';
import { useState, useEffect } from 'react';

const SECTIONS = [
    {
        id: 'whatsapp',
        title: '📱 Configurações do WhatsApp',
        desc: 'Credenciais da API do WhatsApp Business para o robô enviar e receber mensagens.',
        fields: [
            { key: 'whatsapp_phone_number_id', label: 'Phone Number ID', type: 'text', placeholder: '123456789012345', help: 'Encontrado no painel do Meta Developers → WhatsApp → API Setup' },
            { key: 'whatsapp_access_token', label: 'Access Token', type: 'password', placeholder: 'EAAxxxxxxx...', help: 'Token permanente gerado no painel do Meta Business' },
            { key: 'whatsapp_verify_token', label: 'Verify Token (Webhook)', type: 'text', placeholder: 'meu_token_secreto_123', help: 'Token que você definiu ao configurar o Webhook no Meta Developers' },
        ]
    },
    {
        id: 'bot',
        title: '🤖 Comportamento do Robô',
        desc: 'Personalize como o robô interage com os clientes.',
        fields: [
            { key: 'bot_name', label: 'Nome do Robô', type: 'text', placeholder: 'Lia', help: 'Nome com que o robô se apresenta nas mensagens' },
            { key: 'company_name', label: 'Nome da Empresa', type: 'text', placeholder: 'Pereira Acabamentos', help: 'Nome que aparece nas mensagens e orçamentos' },
            { key: 'welcome_message', label: 'Mensagem de Boas-vindas', type: 'textarea', placeholder: 'Olá! Bem-vindo à Pereira Acabamentos. Como posso te ajudar?', help: 'Primeira mensagem enviada ao cliente' },
        ]
    },
    {
        id: 'ai',
        title: '✨ Inteligência Artificial (Gemini)',
        desc: 'Ative o "Cérebro IA" para conversas naturais e sugestões de vendas profissionais.',
        fields: [
            { key: 'ai_driven_bot', label: 'Robô Orientado por IA', type: 'select', options: [{ v: 'true', l: 'Ativo (Conversa Natural)' }, { v: 'false', l: 'Inativo (Fluxo Manual)' }], help: 'Quando ativo, o robô usa IA para entender e responder o cliente em vez de seguir um menu fixo.' },
            { key: 'gemini_api_key', label: 'Gemini API Key', type: 'password', placeholder: 'AIzaSy...', help: 'Chave gratuita do Google AI Studio (Gemini 1.5 Flash)' },
            { key: 'ai_custom_instructions', label: 'Instruções Customizadas da IA', type: 'textarea', placeholder: 'Sempre ofereça desconto de 5% se o cliente hesitar...', help: 'Diretrizes extras que a IA seguirá em todas as conversas.' },
        ]
    },
    {
        id: 'budget',
        title: '💰 Regras de Orçamento',
        desc: 'Ajuste como o robô calcula os orçamentos para os clientes.',
        fields: [
            { key: 'budget_margin', label: 'Margem de Segurança (%)', type: 'number', placeholder: '10', help: 'Porcentagem adicionada à metragem para evitar faltas' },
            { key: 'budget_validity_days', label: 'Validade do Orçamento (dias)', type: 'number', placeholder: '7', help: 'Número de dias que o orçamento permanece válido' },
            { key: 'min_order_value', label: 'Pedido Mínimo (R$)', type: 'number', placeholder: '100', help: 'Valor mínimo aceito por pedido' },
        ]
    },
    {
        id: 'contact',
        title: '📞 Contato e Atendimento',
        desc: 'Informações de contato exibidas ao cliente e regras de atendimento humano.',
        fields: [
            { key: 'support_phone', label: 'Telefone de Suporte', type: 'text', placeholder: '(11) 99999-9999', help: 'Número exibido quando o cliente pede atendimento humano' },
            { key: 'support_email', label: 'E-mail de Suporte', type: 'email', placeholder: 'contato@empresa.com.br', help: 'E-mail exibido ao cliente quando necessário' },
            { key: 'business_hours', label: 'Horário de Atendimento', type: 'text', placeholder: 'Seg-Sex 8h às 18h, Sáb 8h às 12h', help: 'Horário informado ao cliente quando fora do expediente' },
        ]
    }
];

export default function AdminConfig() {
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedKey, setSavedKey] = useState('');
    const [showPasswords, setShowPasswords] = useState({});

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                const map = {};
                if (Array.isArray(data)) {
                    data.forEach(c => { map[c.key] = c.value; });
                }
                setValues(map);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const saveSection = async (sectionId) => {
        setSaving(true);
        setSavedKey('');
        const section = SECTIONS.find(s => s.id === sectionId);
        const promises = section.fields.map(f =>
            fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: f.key, value: values[f.key] ?? '' })
            })
        );
        await Promise.all(promises);
        setSaving(false);
        setSavedKey(sectionId);
        setTimeout(() => setSavedKey(''), 3000);
    };

    const handleChange = (key, val) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="config-page">
            <div className="page-header">
                <h1>Configurações do Robô</h1>
                <p>Gerencie todas as configurações do sistema VendaFlow em um só lugar.</p>
            </div>

            {SECTIONS.map(section => (
                <div key={section.id} className="config-card">
                    <div className="card-header">
                        <div>
                            <h2>{section.title}</h2>
                            <p className="card-desc">{section.desc}</p>
                        </div>
                    </div>

                    <div className="fields-grid">
                        {section.fields.map(field => (
                            <div key={field.key} className={`field-group ${field.type === 'textarea' ? 'field-full' : ''}`}>
                                <label>{field.label}</label>
                                <p className="field-help">{field.help}</p>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        rows={3}
                                        placeholder={field.placeholder}
                                        value={values[field.key] ?? ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        value={String(values[field.key] ?? 'false')}
                                        onChange={e => handleChange(field.key, e.target.value === 'true')}
                                    >
                                        {field.options.map(opt => (
                                            <option key={opt.v} value={opt.v}>{opt.l}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'password' ? (
                                    <div className="password-wrap">
                                        <input
                                            type={showPasswords[field.key] ? 'text' : 'password'}
                                            placeholder={field.placeholder}
                                            value={values[field.key] ?? ''}
                                            onChange={e => handleChange(field.key, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="eye-btn"
                                            onClick={() => setShowPasswords(p => ({ ...p, [field.key]: !p[field.key] }))}
                                        >
                                            {showPasswords[field.key] ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={values[field.key] ?? ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="card-footer">
                        {savedKey === section.id && (
                            <span className="saved-badge">✅ Salvo com sucesso!</span>
                        )}
                        <button
                            onClick={() => saveSection(section.id)}
                            disabled={saving}
                            className="save-btn"
                        >
                            {saving ? 'Salvando...' : 'Salvar Seção'}
                        </button>
                    </div>
                </div>
            ))}

            <style jsx>{`
                .config-page { max-width: 900px; padding-bottom: 3rem; }
                .page-header { margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.875rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem; }
                .page-header p { color: #64748b; margin: 0; }

                .config-card {
                    background: white;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
                    margin-bottom: 1.5rem;
                    overflow: hidden;
                }
                .card-header {
                    padding: 1.5rem 1.5rem 0;
                    border-bottom: 1px solid #f1f5f9;
                    padding-bottom: 1rem;
                    margin-bottom: 1rem;
                }
                .card-header h2 { margin: 0 0 0.25rem; font-size: 1.1rem; color: #0f172a; }
                .card-desc { margin: 0; font-size: 0.85rem; color: #64748b; }

                .fields-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                    padding: 0 1.5rem;
                }
                .field-group { display: flex; flex-direction: column; }
                .field-full { grid-column: 1 / -1; }
                label { font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
                .field-help { font-size: 0.78rem; color: #94a3b8; margin: 0 0 0.5rem; }
                input, textarea, select {
                    padding: 0.7rem 0.875rem;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 0.6rem;
                    font-size: 0.9rem;
                    width: 100%;
                    box-sizing: border-box;
                    transition: 0.2s;
                    font-family: inherit;
                    background: #f8fafc;
                    margin: 0;
                }
                input:focus, textarea:focus { outline: none; border-color: #10b981; background: white; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
                textarea { resize: vertical; }

                .password-wrap { position: relative; }
                .password-wrap input { padding-right: 3rem; }
                .eye-btn {
                    position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
                    background: none; border: none; cursor: pointer; font-size: 1.1rem;
                    padding: 0; color: #64748b; width: auto;
                }
                .eye-btn:hover { filter: none; background: none; }

                .card-footer {
                    padding: 1rem 1.5rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                    border-top: 1px solid #f1f5f9;
                }
                .saved-badge {
                    font-size: 0.875rem;
                    color: #059669;
                    font-weight: 600;
                    background: #d1fae5;
                    padding: 0.4rem 0.875rem;
                    border-radius: 2rem;
                }
                .save-btn {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 0.65rem 1.5rem;
                    border-radius: 0.6rem;
                    font-weight: 700;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: 0.2s;
                    width: auto;
                }
                .save-btn:hover { background: #059669; }
                .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .spinner {
                    width: 2.5rem; height: 2.5rem;
                    border: 3px solid #e2e8f0;
                    border-top-color: #10b981;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 640px) {
                    .fields-grid { grid-template-columns: 1fr; }
                    .field-full { grid-column: auto; }
                }
            `}</style>
        </div>
    );
}
