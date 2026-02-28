'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false,
        });

        if (res?.error) {
            setError('Credenciais inválidas. Tente novamente.');
            setLoading(false);
        } else {
            router.push('/admin');
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
                        <label>E-mail Profissional</label>
                        <input
                            required
                            type="email"
                            placeholder="seu@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 2rem;
          font-family: 'Inter', sans-serif;
        }
        .auth-card { 
          background: white; 
          padding: 3rem; 
          border-radius: 1.5rem; 
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05); 
          width: 100%; 
          max-width: 440px; 
          border: 1px solid #e2e8f0;
        }
        h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 0.5rem; text-align: center; color: #0f172a; }
        h1 span { color: #10b981; }
        p { color: #64748b; text-align: center; margin-bottom: 2rem; font-size: 0.9rem; }
        .success-msg { background: #d1fae5; color: #065f46; padding: 1rem; border-radius: 0.75rem; font-size: 0.875rem; margin-bottom: 1.5rem; text-align: center; font-weight: 600; }
        .error-msg { background: #fee2e2; color: #ef4444; padding: 1rem; border-radius: 0.75rem; font-size: 0.875rem; margin-bottom: 1.5rem; text-align: center; font-weight: 600; }
        .field { margin-bottom: 1.25rem; }
        label { display: block; font-size: 0.875rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.875rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 0.75rem; font-size: 1rem; transition: 0.2s; box-sizing: border-box; }
        input:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
        button { width: 100%; background: #10b981; color: white; border: none; padding: 1rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 700; cursor: pointer; transition: 0.3s; margin-top: 1rem; letter-spacing: 0.02em; }
        button:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .footer-link { margin-top: 1.5rem; margin-bottom: 0; font-size: 0.875rem; text-align: center; }
        .footer-link a { color: #10b981; font-weight: 700; text-decoration: none; }
        .footer-link a:hover { text-decoration: underline; }
      `}</style>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
                <div style={{ textAlign: 'center', fontFamily: 'Inter,sans-serif', color: '#64748b' }}>Carregando...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
