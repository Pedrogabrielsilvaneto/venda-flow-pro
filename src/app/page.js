'use client';

export default function Home() {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="container flex justify-between items-center py-6">
          <div className="logo font-black text-2xl tracking-tighter">
            VENDA<span className="text-emerald-500">FLOW</span>
          </div>
          <div className="links hidden md:flex gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-500 transition">Funcionalidades</a>
            <a href="/admin" className="text-emerald-600 font-bold hover:text-emerald-700 transition">Acessar Painel</a>
          </div>
        </div>
      </nav>

      <section className="hero py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hero-content">
            <div className="badge bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold inline-block mb-6">
              Plataforma de Vendas Automáticas 🚀
            </div>
            <h1 className="text-6xl font-black leading-none tracking-tight mb-8">
              O robô que <span className="gradient-text">vende</span> qualquer produto por você.
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              VendaFlow: Atendimento 24h, captação de leads e geração de orçamentos automáticos via WhatsApp. Escale suas vendas sem aumentar sua equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/admin" className="btn-primary">Criar Meu Robô</a>
              <a href="https://developers.facebook.com/docs/whatsapp/cloud-api" target="_blank" className="btn-secondary">Ver Docs da API</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mockup-whatsapp">
              <div className="header">Robô Inteligente</div>
              <div className="messages">
                <div className="msg bot">Olá! Bem-vindo. Como posso te ajudar a encontrar o produto ideal hoje?</div>
                <div className="msg user">Olá, gostaria de ver os preços!</div>
                <div className="msg bot animate-pulse">Com certeza! Temos ofertas exclusivas agora. Qual seu nome?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .gradient-text {
          background: linear-gradient(to right, #10b981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .navbar { border-bottom: 1px solid #e2e8f0; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
        .py-24 { padding-top: 6rem; padding-bottom: 6rem; }
        .gap-8 { gap: 2rem; }
        .gap-16 { gap: 4rem; }
        .btn-primary { 
          background: #10b981; color: white; padding: 1rem 2rem; border-radius: 0.75rem; 
          font-weight: 800; font-size: 1.125rem; text-decoration: none; text-align: center;
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);
          transition: 0.3s;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.4); }
        .btn-secondary { 
          background: #f1f5f9; color: #475569; padding: 1rem 2rem; border-radius: 0.75rem; 
          font-weight: 700; font-size: 1.125rem; text-decoration: none; text-align: center;
          transition: 0.3s;
        }
        .btn-secondary:hover { background: #e2e8f0; }
        
        .mockup-whatsapp {
          background: #e5ddd5;
          border-radius: 2rem;
          padding: 1.5rem;
          height: 480px;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
          display: flex;
          flex-direction: column;
          border: 8px solid #0f172a;
        }
        .mockup-whatsapp .header { background: #075e54; color: white; padding: 1rem; border-radius: 1rem 1rem 0 0; font-weight: bold; }
        .mockup-whatsapp .messages { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
        .msg { padding: 0.75rem 1rem; border-radius: 1rem; max-width: 80%; font-size: 0.875rem; line-height: 1.4; }
        .msg.bot { background: white; align-self: flex-start; border-top-left-radius: 0; }
        .msg.user { background: #dcf8c6; align-self: flex-end; border-top-right-radius: 0; }

        .text-6xl { font-size: 3.75rem; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
    </div>
  );
}
