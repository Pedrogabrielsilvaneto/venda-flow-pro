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
        <div className="users-page">
            <div className="header">
                <h1>Gerenciar Equipe (Atendentes e Admins)</h1>
                <p>Cadastre novos atendentes (vendedores) para acessar o painel e gerenciar as conversas da Lia, ou Administradores que podem configurar o robô.</p>
            </div>

            {errorMsg && <div className="error-alert">{errorMsg}</div>}

            <div className="card list-card">
                <h2>Usuários Ativos</h2>
                {users.length === 0 ? (
                    <div className="loading-state">Carregando equipe...</div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Permissão</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td><strong>{u.name}</strong></td>
                                    <td>{u.email}</td>
                                    <td>
                                        {u.role === 'admin' ? (
                                            <span className="badge badge-admin">Administrador</span>
                                        ) : (
                                            <span className="badge badge-user">Atendente</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="status-active"><span className="dot"></span> Ativo</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card form-card">
                <h2>Cadastrar Novo Membro</h2>
                <form onSubmit={handleCreateUser}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: João da Silva" />
                        </div>

                        <div className="form-group">
                            <label>E-mail de Acesso</label>
                            <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="joao@empresa.com" />
                        </div>

                        <div className="form-group">
                            <label>Senha Inicial</label>
                            <input type="password" required minLength="6" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="******" />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Acesso</label>
                            <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                                <option value="user">Atendente (Conversar com Clientes)</option>
                                <option value="admin">Administrador (Configurar Robô e Usuários)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Cadastrando...' : 'Adicionar Membro'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .users-page {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .header h1 {
          font-size: 2rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        
        .header p {
          color: #64748b;
          font-size: 1rem;
        }

        .error-alert {
          background: #fee2e2;
          color: #ef4444;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #f87171;
        }

        .card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }

        .card h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: #1e293b;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .loading-state {
          padding: 2rem;
          text-align: center;
          color: #94a3b8;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .users-table th {
          padding: 1rem;
          color: #64748b;
          font-weight: 600;
          font-size: 0.875rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .users-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .users-table tr:hover {
          background: #f8fafc;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-admin {
          background: #e0e7ff;
          color: #4338ca;
        }

        .badge-user {
          background: #ccfbf1;
          color: #0f766e;
        }

        .status-active {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #475569;
          font-size: 0.875rem;
        }

        .form-group input, .form-group select {
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus, .form-group select:focus {
          border-color: #3b82f6;
        }

        .form-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }

        .btn-primary {
          background: #10b981;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-primary:hover {
          background: #059669;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
