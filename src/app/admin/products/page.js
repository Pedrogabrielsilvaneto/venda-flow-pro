'use client';
import { useState, useEffect } from 'react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ nome: '', precoOriginal: '', precoPromocional: '', categoria: 'Porcelanato' });

    useEffect(() => {
        fetch('/api/products').then(res => res.json()).then(setProducts);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            const newProduct = await res.json();
            setProducts([newProduct, ...products]);
            setForm({ nome: '', precoOriginal: '', precoPromocional: '', categoria: 'Porcelanato' });
        }
    };

    return (
        <div className="products-page">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Catálogo de Produtos</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Produtos Cadastrados</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b text-slate-400 text-sm">
                                        <th className="pb-3 font-medium">Nome</th>
                                        <th className="pb-3 font-medium">Categoria</th>
                                        <th className="pb-3 font-medium">Preço (Promocional)</th>
                                        <th className="pb-3 font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {products.map(p => (
                                        <tr key={p._id} className="hover:bg-slate-50">
                                            <td className="py-4 font-medium">{p.nome}</td>
                                            <td className="py-4 text-slate-500">{p.categoria}</td>
                                            <td className="py-4 text-emerald-600 font-bold">R$ {p.precoPromocional}</td>
                                            <td className="py-4"><button className="text-red-500 text-sm">Excluir</button></td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr><td colSpan="4" className="py-8 text-center text-slate-400">Nenhum produto cadastrado.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card h-fit">
                    <h2 className="text-xl font-bold mb-4">Novo Produto</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nome do Produto</label>
                            <input
                                required
                                value={form.nome}
                                onChange={e => setForm({ ...form, nome: e.target.value })}
                                placeholder="Ex: Porcelanato Bianco 80x80"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Categoria</label>
                            <select
                                value={form.categoria}
                                onChange={e => setForm({ ...form, categoria: e.target.value })}
                            >
                                <option>Porcelanato</option>
                                <option>Piso Cerâmico</option>
                                <option>Revestimento</option>
                                <option>Piso Vinílico</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Preço Original</label>
                                <input
                                    type="number"
                                    required
                                    value={form.precoOriginal}
                                    onChange={e => setForm({ ...form, precoOriginal: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Preço Promo</label>
                                <input
                                    type="number"
                                    required
                                    value={form.precoPromocional}
                                    onChange={e => setForm({ ...form, precoPromocional: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-lg">
                            Cadastrar Produto
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
        .lg\:col-span-2 { grid-column: span 2 / span 2; }
        .h-fit { height: fit-content; }
        table { border-collapse: collapse; }
        th, td { padding-right: 1rem; }
        .text-red-500 { color: #ef4444; }
        .bg-slate-900 { background-color: #0f172a; }
      `}</style>
        </div>
    );
}
