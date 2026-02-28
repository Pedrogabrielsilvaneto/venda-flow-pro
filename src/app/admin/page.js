'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ leads: 0, messages: 0 });

    return (
        <div className="dashboard">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Bem-vindo, Pereira! 🚀</h1>
                    <p className="text-slate-500">Veja o desempenho do seu bot de atendimento.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <span className="text-slate-500 text-sm font-medium">Contatos Totais</span>
                    <h3 className="text-4xl font-bold mt-2">124</h3>
                    <div className="mt-4 text-emerald-500 text-sm font-medium">↑ 12% desde ontem</div>
                </div>
                <div className="card">
                    <span className="text-slate-500 text-sm font-medium">Orçamentos Gerados</span>
                    <h3 className="text-4xl font-bold mt-2">45</h3>
                    <div className="mt-4 text-emerald-500 text-sm font-medium">↑ 8% desde ontem</div>
                </div>
                <div className="card">
                    <span className="text-slate-500 text-sm font-medium">Taxa de Conversão</span>
                    <h3 className="text-4xl font-bold mt-2">36%</h3>
                    <div className="mt-4 text-slate-400 text-sm font-medium">Meta: 40%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Últimas Interações</h2>
                    <div className="space-y-4">
                        {/* Mocking interactions */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                                    {i === 1 ? 'M' : i === 2 ? 'J' : 'P'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{i === 1 ? 'Maria Silva' : i === 2 ? 'João Pedro' : 'Pedro Neto'}</p>
                                    <p className="text-sm text-slate-500">Interessado em Porcelanato Polido</p>
                                </div>
                                <div className="text-xs text-slate-400">14:4{i}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Configuração Rápida do Robô</h2>
                    <p className="text-slate-500 text-sm mb-6">Ajuste o comportamento do bot instantaneamente.</p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Mensagem de Boas-vindas</label>
                            <textarea
                                className="w-full p-3 bg-slate-50 border rounded-xl"
                                defaultValue="Olá! Bem-vindo à Pereira Acabamentos. Como posso te ajudar hoje?"
                            />
                        </div>
                        <button className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 768px) { .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (min-width: 1024px) { .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-4xl { font-size: 2.25rem; }
        .text-xl { font-size: 1.25rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-emerald-500 { color: #10b981; }
        .text-emerald-700 { color: #047857; }
        .bg-emerald-100 { background-color: #d1fae5; }
        .bg-slate-50 { background-color: #f8fafc; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .flex { display: flex; }
        .flex-1 { flex: 1 1 0%; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
        .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
      `}</style>
        </div>
    );
}
