'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            router.push('/auth/login?message=Conta criada com sucesso!');
        } else {
            setError(data.error || 'Erro ao registrar.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Venda<span>Flow</span></h1>
                <p>Crie sua conta para começar a vender mais.</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Seu Nome</label>
                        <input
                            required
                            type="text"
                            placeholder="Ex: Pedro Neto"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
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
                        <label>Nome da sua Empresa</label>
                        <input
                            required
                            type="text"
                            placeholder="Ex: Pereira Acabamentos"
                            value={form.businessName}
                            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        />
                    </div>
                    <div className="field">
                        <label>Senha Segura</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Criando conta...' : 'Cadastrar na Plataforma'}
                    </button>
                </form>
                <p className="footer-link">Já tem uma conta? <a href="/auth/login">Entrar agora</a></p>
            </div>

            <style jsx>{`
        .auth-container { 
          min-height: 100vh; 
          background: #f8fafc; 
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
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); 
          width: 100%; 
          max-width: 480px; 
        }
        h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 0.5rem; text-align: center; }
        h1 span { color: #10b981; }
        p { color: #64748b; text-align: center; margin-bottom: 2rem; }
        .error-msg { background: #fee2e2; color: #ef4444; padding: 1rem; border-radius: 0.75rem; font-size: 0.875rem; margin-bottom: 1.5rem; text-align: center; font-weight: 600; }
        .field { margin-bottom: 1.25rem; }
        label { display: block; font-size: 0.875rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.875rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 1rem; transition: 0.2s; }
        input:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
        button { width: 100%; background: #10b981; color: white; border: none; padding: 1rem; border-radius: 0.75rem; font-size: 1.125rem; font-weight: 700; cursor: pointer; transition: 0.3s; margin-top: 1rem; }
        button:hover { background: #059669; transform: translateY(-2px); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .footer-link { margin-top: 2rem; margin-bottom: 0; font-size: 0.875rem; }
        .footer-link a { color: #10b981; font-weight: 700; text-decoration: none; }
      `}</style>
        </div>
    );
}
