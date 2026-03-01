'use client';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/chat', label: 'Inbox / Chat', icon: '💬' },
  { href: '/admin/products', label: 'Produtos', icon: '📦' },
  { href: '/admin/users', label: 'Atendentes', icon: '👥' },
  { href: '/admin/config', label: 'Configurações', icon: '⚙️' },
  { href: '/admin/whatsapp', label: 'WhatsApp', icon: '📱' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-icon">🤖</div>
          <div>
            <h1>VendaFlow</h1>
            <span>Painel Admin</span>
          </div>
        </div>

        <nav>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div>
              <p className="user-name">Administrador</p>
              <p className="user-role">Pereira Acabamentos</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn-logout"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>

      <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                *, *::before, *::after { box-sizing: border-box; }
                :root {
                    --primary: #2563eb;
                    --primary-dark: #1d4ed8;
                    --bg: #f8fafc;
                    --text: #334155;
                    --sidebar-bg: #ffffff;
                    --card-bg: #ffffff;
                    --border: #e2e8f0;
                }
                body {
                    margin: 0;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: var(--bg);
                    color: var(--text);
                    -webkit-font-smoothing: antialiased;
                }
                * { font-family: inherit; }

                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                }

                .admin-sidebar {
                    width: 260px;
                    background: var(--sidebar-bg);
                    color: var(--text);
                    padding: 2rem 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    z-index: 100;
                    border-right: 1px solid var(--border);
                }

                .admin-logo {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.5rem;
                }
                .logo-icon {
                    font-size: 1.5rem;
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }
                .admin-logo h1 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    margin: 0;
                    color: #0f172a;
                    line-height: 1;
                    letter-spacing: -0.02em;
                }
                .admin-logo span {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .admin-sidebar nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                    flex: 1;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.875rem;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    color: #64748b;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .nav-link:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                    transform: translateX(4px);
                }
                .nav-link.active {
                    background: #eff6ff;
                    color: #2563eb;
                    font-weight: 700;
                }
                .nav-icon { font-size: 1.2rem; display: flex; align-items: center; opacity: 0.8; }
                .nav-link.active .nav-icon { opacity: 1; }
                .nav-label { flex: 1; }

                .sidebar-footer {
                    border-top: 1px solid var(--border);
                    padding-top: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                }
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    flex-shrink: 0;
                    color: #0f172a;
                }
                .user-name {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }
                .user-role {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin: 0;
                }

                .btn-logout {
                    background: transparent;
                    color: #ef4444;
                    border: 1px solid #fee2e2;
                    padding: 0.625rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    transition: 0.2s;
                    text-align: center;
                }
                .btn-logout:hover {
                    background: #fef2f2;
                    border-color: #fca5a5;
                }

                .admin-main {
                    flex: 1;
                    margin-left: 260px;
                    padding: 2.5rem;
                    min-height: 100vh;
                    overflow-y: auto;
                }

                .card {
                    background: var(--card-bg);
                    padding: 2rem;
                    border-radius: 1.25rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 12px -4px rgba(0,0,0,0.02);
                    border: 1px solid var(--border);
                }

                input:not([type="checkbox"]), select, textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 0.75rem;
                    font-size: 0.9rem;
                    font-family: 'Inter', sans-serif;
                    background: #f8fafc;
                    color: #1e293b;
                    outline: none;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                input:focus, select:focus, textarea:focus {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }
                button {
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                h2 { font-weight: 800; color: #0f172a; margin: 0 0 0.75rem; letter-spacing: -0.01em; }
            `}</style>
    </div>
  );
}
