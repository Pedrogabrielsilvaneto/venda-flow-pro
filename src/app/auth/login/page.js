'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                username: form.username,
                password: form.password,
                redirect: false,
            });

            if (res?.error) {
                setError('Credenciais inválidas ou acesso negado. (NextAuth Error: ' + res.error + ')');
                setLoading(false);
            } else if (res?.ok) {
                router.push('/admin');
            } else {
                setError('Ocorreu um erro inesperado no login (Resource Blocked).');
                setLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Falha na comunicação. Se estiver usando antivírus (Bitdefender), desative a Proteção Web temporariamente. Erro: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>VENDA<span>FLOW</span></h1>
                <p>Acesse seu painel para gerenciar o seu robô.</p>

                {message && <div className="success-msg">{message}</div>}
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Usuário</label>
                        <input
                            required
                            type="text"
                            placeholder="Digite seu usuário"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                    </div>
                    <div className="field">
                        <label>Senha</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar no Painel'}
                    </button>
                </form>
                <p className="footer-link">Ainda não tem conta? <a href="/auth/register">Começar agora</a></p>
            </div>

            <style jsx>{`
        .auth-container { 
          min-height: 100vh; 
          background: #020617;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .auth-container::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 40%),
                      radial-gradient(circle at 100% 100%, rgba(14, 165, 233, 0.05) 0%, transparent 40%);
          z-index: 0;
        }
        .auth-card { 
          position: relative;
          z-index: 1;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(16px);
          padding: 3rem; 
          border-radius: 1.5rem; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
          width: 100%; 
          max-width: 400px; 
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        h1 { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 0.5rem; text-align: center; color: white; }
        h1 span { color: #38BDF8; text-shadow: 0 0 20px rgba(56, 189, 248, 0.4); }
        p { color: #94A3B8; text-align: center; margin-bottom: 2rem; font-size: 0.95rem; }
        .success-msg { background: rgba(16, 185, 129, 0.1); color: #34D399; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; margin-bottom: 1.5rem; text-align: center; border: 1px solid rgba(16, 185, 129, 0.2); }
        .error-msg { background: rgba(239, 68, 68, 0.15); color: #F87171; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.8rem; margin-bottom: 1.5rem; text-align: left; border: 1px solid rgba(239, 68, 68, 0.3); line-height: 1.4; }
        .field { margin-bottom: 1.5rem; }
        label { display: block; font-size: 0.875rem; font-weight: 700; color: #E2E8F0; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        input { width: 100%; padding: 0.85rem 1rem; background: rgba(2, 6, 23, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.75rem; font-size: 1rem; color: white; transition: 0.3s; box-sizing: border-box; outline: none; }
        input:focus { border-color: #38BDF8; box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1); }
        button { width: 100%; background: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%); color: #020617; border: none; padding: 1rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 800; cursor: pointer; transition: 0.3s; margin-top: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
        button:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 24px rgba(56, 189, 248, 0.4); }
        button:active { transform: translateY(0); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .footer-link { margin-top: 1.5rem; margin-bottom: 0; font-size: 0.875rem; text-align: center; }
        .footer-link a { color: #38BDF8; font-weight: 700; text-decoration: none; transition: 0.2s; }
        .footer-link a:hover { filter: brightness(1.2); }
      `}</style>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
                <div style={{ textAlign: 'center', fontFamily: 'Inter,sans-serif', color: '#64748b' }}>Carregando Portal...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
