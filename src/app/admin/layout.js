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
                    --primary: #10b981;
                    --primary-dark: #059669;
                    --bg: #f8fafc;
                    --text: #1e293b;
                    --sidebar-bg: #0f172a;
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
                    width: 240px;
                    background: var(--sidebar-bg);
                    color: white;
                    padding: 1.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    z-index: 100;
                    border-right: 1px solid rgba(255,255,255,0.05);
                }

                .admin-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.875rem;
                    padding: 0.5rem;
                }
                .logo-icon {
                    font-size: 1.75rem;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(16,185,129,0.15);
                    border-radius: 0.625rem;
                    border: 1px solid rgba(16,185,129,0.25);
                }
                .admin-logo h1 {
                    font-size: 1.1rem;
                    font-weight: 800;
                    margin: 0;
                    color: #10b981;
                    line-height: 1.2;
                }
                .admin-logo span {
                    font-size: 0.7rem;
                    color: #475569;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .admin-sidebar nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    flex: 1;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.7rem 0.875rem;
                    border-radius: 0.625rem;
                    text-decoration: none;
                    color: #64748b;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.15s;
                }
                .nav-link:hover {
                    background: rgba(255,255,255,0.06);
                    color: #cbd5e1;
                }
                .nav-link.active {
                    background: rgba(16,185,129,0.15);
                    color: #10b981;
                    font-weight: 600;
                }
                .nav-icon { font-size: 1.1rem; width: 20px; text-align: center; }
                .nav-label { flex: 1; }

                .sidebar-footer {
                    border-top: 1px solid rgba(255,255,255,0.06);
                    padding-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                }
                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                }
                .user-name {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #cbd5e1;
                    margin: 0;
                }
                .user-role {
                    font-size: 0.7rem;
                    color: #475569;
                    margin: 0;
                }

                .btn-logout {
                    background: rgba(239,68,68,0.1);
                    color: #f87171;
                    border: 1px solid rgba(239,68,68,0.2);
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    transition: 0.2s;
                    text-align: center;
                }
                .btn-logout:hover {
                    background: rgba(239,68,68,0.2);
                    color: #fca5a5;
                }

                .admin-main {
                    flex: 1;
                    margin-left: 240px;
                    padding: 2rem;
                    min-height: 100vh;
                    overflow-y: auto;
                }

                /* Global shared card style */
                .card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    border: 1px solid #e2e8f0;
                }

                /* Form elements global */
                input:not([type="checkbox"]), select, textarea {
                    width: 100%;
                    padding: 0.7rem 0.875rem;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-family: 'Inter', sans-serif;
                    background: #f8fafc;
                    color: #1e293b;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }
                input:focus, select:focus, textarea:focus {
                    border-color: #10b981;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
                }
                button {
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                h2 { font-weight: 700; color: #0f172a; margin: 0 0 0.5rem; }
            `}</style>
    </div>
  );
}
