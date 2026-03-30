'use client';
import { useState, useEffect } from 'react';

const SECTIONS = [
    {
        id: 'bot',
        title: '🤖 Identidade da Lia',
        desc: 'Personalize a personalidade e o tom de voz da sua assistente virtual.',
        fields: [
            { key: 'bot_name', label: 'Nome da IA', type: 'text', placeholder: 'Lia', help: 'Como ela se apresenta nas conversas' },
            { key: 'company_name', label: 'Empresa', type: 'text', placeholder: 'Pereira Acabamentos', help: 'Nome da marca que ela representa' },
            { key: 'welcome_message', label: 'Saudação Inicial', type: 'textarea', placeholder: 'Olá! Sou a Lia...', help: 'Primeiro contato automático' },
        ]
    },
    {
        id: 'ai',
        title: '✨ Cérebro Artificial (Gemini)',
        desc: 'Configure o motor de inteligência por trás das vendas.',
        fields: [
            { key: 'ai_driven_bot', label: 'Autonomia da IA', type: 'select', options: [{ v: 'true', l: 'Autônoma (IA Decide o Fluxo)' }, { v: 'false', l: 'Manual (Fluxo de Menu)' }], help: 'Define se a IA pode conduzir a venda livremente' },
            { key: 'gemini_api_key', label: 'Gemini API Key', type: 'password', placeholder: 'AIzaSy...', help: 'Chave do Google AI Studio' },
            { key: 'ai_custom_instructions', label: 'DNA de Vendas (Instructions)', type: 'textarea', placeholder: 'Você é uma especialista em acabamentos...', help: 'Diretrizes permanentes para o comportamento da IA' },
        ]
    },
    {
        id: 'whatsapp',
        title: '📱 Meta Cloud API',
        desc: 'Configurações técnicas para envio oficial de mensagens.',
        fields: [
            { key: 'whatsapp_phone_number_id', label: 'Phone Number ID', type: 'text', placeholder: '123456...', help: 'ID oficial do número no Meta Developers' },
            { key: 'whatsapp_access_token', label: 'System User Token', type: 'password', placeholder: 'EAAxxxx...', help: 'Token permanente de acesso estruturado' },
            { key: 'whatsapp_verify_token', label: 'Webhook Verify Token', type: 'text', placeholder: 'meu_token_123', help: 'Token de segurança para o Webhook' },
        ]
    },
    {
        id: 'budget',
        title: '💰 Motor de Precificação',
        desc: 'Regras de cálculo para orçamentos automáticos.',
        fields: [
            { key: 'budget_margin', label: 'Margem Técnica (%)', type: 'number', placeholder: '10', help: 'Adicional de segurança para metragem' },
            { key: 'budget_validity_days', label: 'Validade (Dias)', type: 'number', placeholder: '7', help: 'Tempo de expiração do orçamento' },
            { key: 'min_order_value', label: 'Pedido Mínimo (R$)', type: 'number', placeholder: '100', help: 'Valor base para formalizar venda' },
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
            <div className="config-loading">
                <div className="spinner-cyan"></div>
                <style jsx>{`
                    .config-loading { height: 70vh; display: flex; align-items: center; justify-content: center; }
                    .spinner-cyan { width: 42px; height: 42px; border: 4px solid rgba(56, 189, 248, 0.1); border-top-color: var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="config-container panel-fade-in">
            <header className="page-header-premium">
                <div>
                    <h1>Engrenagens do Sistema</h1>
                    <p>Central de controle avançado para a inteligência artificial e conectividade.</p>
                </div>
            </header>

            <div className="config-grid">
                {SECTIONS.map(section => (
                    <div key={section.id} className="glass-card config-section-card">
                        <div className="section-header-premium">
                            <div>
                                <h2>{section.title}</h2>
                                <p className="text-muted-xs">{section.desc}</p>
                            </div>
                            <button
                                onClick={() => saveSection(section.id)}
                                disabled={saving}
                                className="btn-save-mini"
                            >
                                {savedKey === section.id ? '✅ Salvo' : saving ? '...' : 'Salvar'}
                            </button>
                        </div>

                        <div className="config-form-body">
                            {section.fields.map(field => (
                                <div key={field.key} className={`config-field-row ${field.type === 'textarea' ? 'row-full' : ''}`}>
                                    <div className="label-col">
                                        <label>{field.label}</label>
                                        <span className="field-help-text">{field.help}</span>
                                    </div>
                                    <div className="input-col">
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                rows={4}
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
                                        ) : (
                                            <div className="input-wrapper-premium">
                                                <input
                                                    type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'}
                                                    placeholder={field.placeholder}
                                                    value={values[field.key] ?? ''}
                                                    onChange={e => handleChange(field.key, e.target.value)}
                                                />
                                                {field.type === 'password' && (
                                                    <button
                                                        type="button"
                                                        className="btn-toggle-eye"
                                                        onClick={() => setShowPasswords(p => ({ ...p, [field.key]: !p[field.key] }))}
                                                    >
                                                        {showPasswords[field.key] ? '🙈' : '👁️'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .config-container { padding: 1rem; }
                .panel-fade-in { animation: fadeIn 0.8s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header-premium { margin-bottom: 2.5rem; }
                .page-header-premium h1 { font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.04em; }
                .page-header-premium p { color: var(--text-muted); font-size: 1rem; }

                .config-grid { display: flex; flex-direction: column; gap: 2rem; }

                .config-section-card { overflow: hidden; }
                .section-header-premium { padding: 1.5rem 2rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.01); }
                .section-header-premium h2 { margin: 0; font-size: 1.15rem; font-weight: 700; color: #fff; }
                .text-muted-xs { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }

                .btn-save-mini { background: var(--gradient-accent); color: var(--primary-brand); border: none; padding: 0.5rem 1.25rem; border-radius: 0.6rem; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: var(--transition); }
                .btn-save-mini:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3); }

                .config-form-body { padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                @media (max-width: 900px) { .config-form-body { grid-template-columns: 1fr; } }

                .config-field-row { display: flex; flex-direction: column; gap: 0.75rem; }
                .row-full { grid-column: 1 / -1; }

                .label-col label { display: block; font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
                .field-help-text { font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; display: block; }

                .input-wrapper-premium { position: relative; }
                input, select, textarea { width: 100%; background: rgba(2, 6, 23, 0.4); border: 1px solid var(--card-border); border-radius: 0.75rem; padding: 0.75rem 1rem; color: #fff; font-size: 0.95rem; outline: none; transition: var(--transition); font-family: inherit; }
                input:focus, textarea:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
                
                textarea { resize: vertical; min-height: 100px; }

                .btn-toggle-eye { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.1rem; padding: 0.25rem; }
                .btn-toggle-eye:hover { color: #fff; }

                .text-muted-xs { font-size: 0.8rem; color: var(--text-muted); }
            `}</style>
        </div>
    );
}
