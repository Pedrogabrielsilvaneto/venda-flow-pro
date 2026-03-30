'use client';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/chat', label: 'Chat Ao Vivo', icon: '💬' },
  { href: '/admin/products', label: 'Produtos', icon: '📦' },
  { href: '/admin/users', label: 'Equipe', icon: '👥' },
  { href: '/admin/config', label: 'Ajustes', icon: '⚙️' },
  { href: '/admin/whatsapp', label: 'WhatsApp', icon: '📱' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-icon">✨</div>
          <div>
            <h1>Pereira AI</h1>
            <span>Painel Premium</span>
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
            <div className="user-avatar">AD</div>
            <div>
              <p className="user-name">Administrador</p>
              <p className="user-role">SDR Master</p>
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
        :root {
          --sidebar-width: 280px;
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: var(--background);
          color: var(--foreground);
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .admin-sidebar {
          width: var(--sidebar-width);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: var(--glass);
          color: var(--foreground);
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 100;
          border-right: 1px solid var(--card-border);
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0 0.5rem;
        }

        .logo-icon {
          font-size: 1.5rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-accent);
          color: var(--primary-brand);
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(56, 189, 248, 0.3);
        }

        .admin-logo h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .admin-logo span {
          font-size: 0.8rem;
          color: var(--accent-color);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .admin-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          border-radius: 1rem;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.9375rem;
          font-weight: 500;
          transition: var(--transition);
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          transform: translateX(6px);
        }

        .nav-link.active {
          background: rgba(56, 189, 248, 0.1);
          color: var(--accent-color);
          font-weight: 700;
          box-shadow: inset 4px 0 0 var(--accent-color);
        }

        .nav-icon { font-size: 1.4rem; display: flex; align-items: center; }
        .nav-label { flex: 1; }

        .sidebar-footer {
          border-top: 1px solid var(--card-border);
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          background: var(--secondary-brand);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent-color);
          border: 1px solid var(--card-border);
        }

        .user-name {
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0;
          color: #fff;
        }

        .user-role {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
        }

        .btn-logout {
          width: 100%;
          padding: 0.875rem;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-logout:hover {
          background: #ef4444;
          color: #fff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .admin-main {
          margin-left: var(--sidebar-width);
          flex: 1;
          padding: 3rem;
          position: relative;
        }
      `}</style>
    </div>
  );
}
