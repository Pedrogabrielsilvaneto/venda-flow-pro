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
          padding-bottom: 3rem;
        }

        .header h1 {
          font - size: 2rem;
        color: #0f172a;
        margin-bottom: 0.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        }

        .header p {
          color: #64748b;
        font-size: 1.05rem;
        margin: 0;
        }

        .error-alert {
          background: #fef2f2;
        color: #dc2626;
        padding: 1rem 1.5rem;
        border-radius: 1rem;
        border: 1px solid #fecaca;
        font-weight: 500;
        }

        .card {
          background: #ffffff;
        border-radius: 1.25rem;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02);
        border: 1px solid #f1f5f9;
        }

        .card h2 {
          font - size: 1.25rem;
        margin: 0 0 1.5rem;
        color: #0f172a;
        font-weight: 800;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f1f5f9;
        }

        .loading-state {
          padding: 2.5rem;
        text-align: center;
        color: #94a3b8;
        font-weight: 500;
        }

        .users-table {
          width: 100%;
        border-collapse: collapse;
        text-align: left;
        }

        .users-table th {
          padding: 1rem;
        color: #64748b;
        font-weight: 700;
        font-size: 0.875rem;
        border-bottom: 1px solid #f1f5f9;
        background: #f8fafc;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        }
        .users-table th:first-child {border - top - left - radius: 0.75rem; border-bottom-left-radius: 0.75rem; }
        .users-table th:last-child {border - top - right - radius: 0.75rem; border-bottom-right-radius: 0.75rem; }

        .users-table td {
          padding: 1.25rem 1rem;
        border-bottom: 1px solid #f8fafc;
        color: #334155;
        font-size: 0.95rem;
        }

        .users-table tr:hover td {
          background: #fcfcfd;
        }

        .badge {
          padding: 0.35rem 0.85rem;
        border-radius: 2rem;
        font-size: 0.75rem;
        font-weight: 700;
        }

        .badge-admin {
          background: #eff6ff;
        color: #2563eb;
        }

        .badge-user {
          background: #e0f2fe;
        color: #0284c7;
        }

        .status-active {
          display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #10b981;
        font-size: 0.875rem;
        font-weight: 700;
        }

        .dot {
          width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(16,185,129,0.5);
        }

        .form-grid {
          display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        }

        .form-group {
          display: flex;
        flex-direction: column;
        gap: 0.4rem;
        }

        .form-group label {
          font - weight: 700;
        color: #334155;
        font-size: 0.875rem;
        }

        .form-group input, .form-group select {
          padding: 0.8rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        outline: none;
        transition: all 0.2s;
        font-family: inherit;
        font-size: 0.95rem;
        background: #fcfcfd;
        color: #0f172a;
        }

        .form-group input:focus, .form-group select:focus {
          border - color: #2563eb;
        background: white;
        box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
        }

        .form-actions {
          margin - top: 2rem;
        display: flex;
        justify-content: flex-end;
        padding-top: 1.5rem;
        border-top: 1px solid #f1f5f9;
        }

        .btn-primary {
          background: #2563eb;
        color: white;
        padding: 0.75rem 1.75rem;
        border-radius: 0.75rem;
        font-weight: 800;
        font-size: 0.95rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-primary:hover {
          background: #1d4ed8;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
        }

        @media (max-width: 768px) {
          .form - grid {
          grid - template - columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
