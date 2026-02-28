'use client';
import { useState, useEffect } from 'react';

export default function AdminConfig() {
    const [margin, setMargin] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                const m = data.find(c => c.key === 'budget_margin');
                if (m) setMargin(m.value);
            });
    }, []);

    const saveConfig = async () => {
        setLoading(true);
        await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'budget_margin', value: margin })
        });
        setLoading(false);
        alert('Configuração salva!');
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Configurações do Robô</h1>

            <div className="card space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">Regras de Orçamento</h2>
                    <p className="text-slate-500 mb-6">Ajuste como o robô calcula os orçamentos para os clientes.</p>

                    <div className="form-group">
                        <label className="block font-semibold mb-1">Margem de Segurança (%)</label>
                        <p className="text-sm text-slate-400 mb-3">O robô adicionará esta porcentagem à metragem informada pelo cliente para evitar faltas.</p>
                        <input
                            type="number"
                            value={margin}
                            onChange={(e) => setMargin(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={saveConfig}
                    disabled={loading}
                    className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : 'Salvar Configurações'}
                </button>
            </div>

            <style jsx>{`
        .max-w-2xl { max-width: 42rem; }
        .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
      `}</style>
        </div>
    );
}
