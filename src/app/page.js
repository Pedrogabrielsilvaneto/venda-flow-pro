'use client';

export default function Home() {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="container flex justify-between items-center py-6">
          <div className="logo font-black text-2xl tracking-tighter">
            VENDA<span className="text-blue-600">FLOW</span>
          </div>
          <div className="links hidden md:flex gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Funcionalidades</a>
            <a href="/admin" className="text-blue-700 font-bold hover:text-blue-800 transition">Acessar Painel</a>
          </div>
        </div>
      </nav>

      <section className="hero py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hero-content">
            <div className="badge bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold inline-block mb-6 border border-blue-100">
              Plataforma de Vendas Automáticas 🚀
            </div>
            <h1 className="text-6xl font-black leading-none tracking-tight mb-8">
              O robô que <span className="gradient-text">vende</span> qualquer produto por você.
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              VendaFlow: Atendimento 24h, captação de leads e geração de orçamentos automáticos via WhatsApp. Escale suas vendas sem aumentar sua equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/admin" className="btn-primary">Criar Meu Robô</a>
              <a href="https://developers.facebook.com/docs/whatsapp/cloud-api" target="_blank" className="btn-secondary">Ver Docs da API</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mockup-whatsapp">
              <div className="header">Lia - Inteligência em Vendas</div>
              <div className="messages">
                <div className="msg bot">Olá! Bem-vindo à VendaFlow. Como posso te ajudar a encontrar o produto ideal hoje?</div>
                <div className="msg user">Olá, gostaria de ver os preços de porcelanatos!</div>
                <div className="msg bot animate-pulse">Com certeza! Temos modelos de alto padrão com preços exclusivos hoje. Qual seu nome para eu preparar um orçamento?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .gradient-text {
          background: linear-gradient(to right, #2563eb, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .navbar { border-bottom: 1px solid #f1f5f9; background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); position: sticky; top:0; z-index: 10; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
        .py-24 { padding-top: 6rem; padding-bottom: 6rem; }
        .gap-8 { gap: 2rem; }
        .gap-16 { gap: 4rem; }
        
        .text-blue-600 { color: #2563eb; }
        .text-blue-700 { color: #1d4ed8; }
        .bg-blue-50 { background: #eff6ff; }
        .border-blue-100 { border-color: #dbeafe; }
        
        .btn-primary { 
          background: #2563eb; color: white; padding: 1rem 2rem; border-radius: 1rem; 
          font-weight: 800; font-size: 1.125rem; text-decoration: none; text-align: center;
          box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
          transition: all 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.23); background: #1d4ed8; }
        .btn-secondary { 
          background: white; color: #0f172a; padding: 1rem 2rem; border-radius: 1rem; 
          font-weight: 800; font-size: 1.125rem; text-decoration: none; text-align: center;
          transition: all 0.2s; box-shadow: inset 0 0 0 1px #e2e8f0;
        }
        .btn-secondary:hover { background: #f8fafc; box-shadow: inset 0 0 0 1px #cbd5e1; }
        
        .mockup-whatsapp {
          background: #f1f5f9;
          border-radius: 2rem;
          padding: 1.5rem;
          height: 480px;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
          display: flex;
          flex-direction: column;
          border: 8px solid #0f172a;
          overflow: hidden;
        }
        .mockup-whatsapp .header { 
          background: #0f172a; color: white; padding: 1.25rem; 
          margin: -1.5rem -1.5rem 1rem -1.5rem;
          font-weight: 800; font-size: 1rem;
          text-align: center;
        }
        .mockup-whatsapp .messages { flex: 1; padding: 0.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .msg { padding: 1rem 1.25rem; border-radius: 1.25rem; max-width: 85%; font-size: 0.95rem; line-height: 1.5; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .msg.bot { background: white; color: #0f172a; align-self: flex-start; border-top-left-radius: 0.25rem; }
        .msg.user { background: #2563eb; color: white; align-self: flex-end; border-top-right-radius: 0.25rem; }

        .text-6xl { font-size: 4rem; letter-spacing: -0.02em; }
        .text-slate-500 { color: #64748b; }
        .font-medium { font-weight: 500; }
        
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
      `}</style>
    </div>
  );
}
