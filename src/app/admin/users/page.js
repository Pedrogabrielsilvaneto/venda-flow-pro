'use client';
import { useState, useEffect } from 'react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, role: newRole }),
            });
            const data = await res.json();

            if (res.ok) {
                setNewName('');
                setNewEmail('');
                setNewPassword('');
                setNewRole('user');
                fetchUsers();
            } else {
                setErrorMsg(data.error || 'Erro ao criar usuário');
            }
        } catch (error) {
            setErrorMsg('Erro de conexão ao criar usuário');
        }
        setLoading(false);
    };

    return (
        <div className="users-container panel-fade-in">
            <header className="page-header-premium">
                <div>
                    <h1>Controle de Acesso</h1>
                    <p>Gerencie sua equipe de consultores e administradores do sistema.</p>
                </div>
            </header>

            {errorMsg && (
                <div className="alert-premium error">
                    <span className="alert-icon">⚠️</span>
                    <p>{errorMsg}</p>
                </div>
            )}

            <div className="users-layout-grid">
                <div className="users-list-section glass-card">
                    <div className="section-header-premium">
                        <h2>Membros da Equipe</h2>
                        <span className="count-badge-premium">{users.length} usuários</span>
                    </div>

                    <div className="table-responsive">
                        {users.length === 0 ? (
                            <div className="loading-state-premium">
                                <div className="spinner-cyan"></div>
                                <p>Carregando equipe...</p>
                            </div>
                        ) : (
                            <table className="premium-data-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Nível</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="user-profile-cell">
                                                    <div className="user-avatar-mini">
                                                        {u.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <strong>{u.name}</strong>
                                                </div>
                                            </td>
                                            <td><span className="text-muted-xs">{u.email}</span></td>
                                            <td>
                                                <span className={`role-badge ${u.role}`}>
                                                    {u.role === 'admin' ? 'Administrador' : 'Consultor'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="status-indicator-premium">
                                                    <span className="status-dot-pulse"></span>
                                                    Ativo
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="user-form-section">
                    <div className="glass-card form-premium-card">
                        <div className="section-header-premium">
                            <h2>Novo Membro</h2>
                        </div>
                        <form onSubmit={handleCreateUser} className="premium-stack-form">
                            <div className="input-field-group">
                                <label>Nome Completo</label>
                                <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Lucas Silva" />
                            </div>

                            <div className="input-field-group">
                                <label>E-mail Corporativo</label>
                                <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="lucas@pereira.com" />
                            </div>

                            <div className="input-field-group">
                                <label>Senha Temporária</label>
                                <input type="password" required minLength="6" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="******" />
                            </div>

                            <div className="input-field-group">
                                <label>Nível de Acesso</label>
                                <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                                    <option value="user">Consultor (Apenas Chat)</option>
                                    <option value="admin">Administrador (Total)</option>
                                </select>
                            </div>

                            <button type="submit" disabled={loading} className="btn-action-premium">
                                {loading ? 'Processando...' : 'Cadastrar Membro'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card security-card-premium">
                        <h3>🔒 Segurança de Dados</h3>
                        <p>Cada membro da equipe terá acesso apenas às ferramentas permitidas pelo seu nível de acesso. Administradores podem visualizar relatórios globais.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .users-container { padding: 1rem; }
                .panel-fade-in { animation: fadeIn 0.8s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .page-header-premium { margin-bottom: 2rem; }
                .page-header-premium h1 { font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.04em; }
                .page-header-premium p { color: var(--text-secondary); font-size: 1rem; }

                .alert-premium { padding: 1rem 1.5rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
                .alert-premium.error { background: rgba(201, 140, 140, 0.1); border: 1px solid rgba(201, 140, 140, 0.2); color: #a66a6a; }

                .users-layout-grid { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; }
                @media (max-width: 1100px) { .users-layout-grid { grid-template-columns: 1fr; } }

                .section-header-premium { padding: 1.5rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; }
                .section-header-premium h2 { font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin:0; }
                
                .count-badge-premium { background: var(--accent-color); color: white; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 2rem; border: 1px solid var(--card-border); }

                .premium-data-table { width: 100%; border-collapse: collapse; text-align: left; }
                .premium-data-table th { padding: 1.25rem 1.5rem; font-size: 0.7rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--card-border); }
                .premium-data-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--card-border); font-size: 0.9rem; color: var(--text-main); }
                .premium-data-table tr:hover td { background: rgba(141, 123, 104, 0.02); }

                .user-profile-cell { display: flex; align-items: center; gap: 1rem; }
                .user-avatar-mini { width: 36px; height: 36px; border-radius: 0.6rem; background: var(--secondary-brand); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; border: 1px solid var(--card-border); }

                .role-badge { font-size: 0.75rem; font-weight: 800; padding: 0.3rem 0.75rem; border-radius: 2rem; }
                .role-badge.admin { background: rgba(141, 123, 104, 0.1); color: var(--primary-brand); }
                .role-badge.user { background: rgba(255, 255, 255, 0.5); color: var(--text-muted); border: 1px solid var(--card-border); }

                .status-indicator-premium { display: flex; align-items: center; gap: 0.5rem; color: var(--status-online); font-weight: 700; font-size: 0.8rem; }
                .status-dot-pulse { width: 8px; height: 8px; background: var(--status-online); border-radius: 50%; box-shadow: 0 0 10px var(--status-online); animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

                .premium-stack-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
                .input-field-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-field-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
                .input-field-group input, .input-field-group select { background: rgba(255, 255, 255, 0.5); border: 1px solid var(--card-border); border-radius: 0.75rem; padding: 0.75rem 1rem; color: var(--text-main); font-size: 0.95rem; outline: none; transition: var(--transition); }
                .input-field-group input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px var(--accent-glow); }
                
                .btn-action-premium { background: var(--gradient-accent); color: white; border: none; padding: 1rem; border-radius: 0.75rem; font-weight: 800; cursor: pointer; transition: var(--transition); font-size: 0.95rem; box-shadow: 0 4px 15px var(--accent-glow); }
                .btn-action-premium:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-glow); }
                .btn-action-premium:disabled { opacity: 0.5; cursor: not-allowed; }

                .security-card-premium { padding: 1.5rem; background: rgba(200, 182, 166, 0.1); border: 1px solid var(--card-border); margin-top: 1rem; }
                .security-card-premium h3 { font-size: 0.9rem; font-weight: 800; color: var(--primary-brand); margin-bottom: 0.75rem; }
                .security-card-premium p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

                .loading-state-premium { padding: 3rem; text-align: center; color: var(--text-muted); }
                .spinner-cyan { width: 32px; height: 32px; border: 3px solid rgba(56, 189, 248, 0.1); border-top-color: var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .text-muted-xs { font-size: 0.8rem; color: var(--text-muted); opacity: 0.8; }
            `}</style>
        </div>
    );
}
