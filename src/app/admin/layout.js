'use client';
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>VendaFlow</h1>
          <span>Admin Panel</span>
        </div>
        <nav>
          <a href="/admin">Dashboard</a>
          <a href="/admin/products">Produtos</a>
          <a href="/admin/config">Configurações</a>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              marginTop: 'auto',
              background: 'transparent',
              color: '#ef4444',
              textAlign: 'left',
              paddingLeft: '1rem',
              fontSize: '0.875rem'
            }}
          >
            Sair da Conta
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
      <style jsx global>{`
        :root {
          --primary: #10b981;
          --secondary: #064e3b;
          --bg: #f8fafc;
          --text: #1e293b;
        }
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); }
        .admin-layout { display: flex; min-height: 100vh; }
        .admin-sidebar { 
          width: 260px; 
          background: #020617; 
          color: white; 
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .admin-logo h1 { font-size: 1.5rem; margin: 0; color: var(--primary); }
        .admin-sidebar nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .admin-sidebar nav a { 
          color: #94a3b8; 
          text-decoration: none; 
          padding: 0.75rem 1rem; 
          border-radius: 0.5rem;
          transition: 0.2s;
        }
        .admin-sidebar nav a:hover { background: #1e293b; color: white; }
        .admin-main { flex: 1; padding: 2rem; overflow-y: auto; }
        
        .card { 
          background: white; 
          padding: 1.5rem; 
          border-radius: 1rem; 
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e2e8f0;
        }
        h2 { font-weight: 700; color: #0f172a; }
        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
        }
        button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        button:hover { filter: brightness(1.1); }
      `}</style>
    </div>
  );
}
