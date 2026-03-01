'use client';
import { useState, useEffect } from 'react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ nome: '', precoOriginal: '', precoPromocional: '', categoria: 'Porcelanato' });
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = () => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error('Erro ao excluir:', err);
        }
    };

    return (
        <div className="products-page">
            <header className="page-header">
                <div>
                    <h1>📦 Catálogo de Produtos</h1>
                    <p>Gerencie os itens que o robô irá oferecer aos clientes durante o atendimento.</p>
                </div>
            </header>

            <div className="main-grid">
                <div className="left-col">
                    <div className="card list-card">
                        <div className="card-header">
                            <h2>Produtos Cadastrados</h2>
                            <span className="count-badge">{products.length} itens</span>
                        </div>
                        <div className="table-wrap">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="spinner" />
                                    <p>Carregando catálogo...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="empty-state">
                                    <span className="icon">🛒</span>
                                    <p>Nenhum produto cadastrado ainda.</p>
                                    <p className="sub">Use o formulário ao lado para começar.</p>
                                </div>
                            ) : (
                                <table className="products-table">
                                    <thead>
                                        <tr>
                                            <th>Nome do Produto</th>
                                            <th>Categoria</th>
                                            <th>Preço Original</th>
                                            <th>Preço Promo</th>
                                            <th className="text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p._id}>
                                                <td>
                                                    <div className="product-name">
                                                        <strong>{p.nome}</strong>
                                                    </div>
                                                </td>
                                                <td><span className="category-tag">{p.categoria}</span></td>
                                                <td><span className="price-old">R$ {p.precoOriginal}</span></td>
                                                <td><span className="price-promo">R$ {p.precoPromocional}</span></td>
                                                <td className="text-right">
                                                    <button className="btn-delete" onClick={() => handleDelete(p._id)}>
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className="right-col">
                    <div className="card form-card">
                        <div className="card-header">
                            <h2>Novo Produto</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-group">
                                <label>Nome do Produto</label>
                                <input
                                    required
                                    value={form.nome}
                                    onChange={e => setForm({ ...form, nome: e.target.value })}
                                    placeholder="Ex: Porcelanato Bianco 80x80"
                                />
                            </div>
                            <div className="form-group">
                                <label>Categoria</label>
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
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Preço Original (R$)</label>
                                    <input
                                        type="number"
                                        required
                                        value={form.precoOriginal}
                                        onChange={e => setForm({ ...form, precoOriginal: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Preço Promo (R$)</label>
                                    <input
                                        type="number"
                                        required
                                        value={form.precoPromocional}
                                        onChange={e => setForm({ ...form, precoPromocional: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-submit" disabled={submitting}>
                                {submitting ? 'Cadastrando...' : '🚀 Cadastrar Produto'}
                            </button>
                        </form>
                    </div>

                    <div className="card tips-card">
                        <h3>💡 Dica da Lia</h3>
                        <p>Mantenha as categorias organizadas para que eu possa encontrar os produtos mais rapidamente quando o cliente perguntar.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .products-page { padding-bottom: 3rem; }
                
                .page-header { margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem; letter-spacing: -0.03em; }
                .page-header p { color: #64748b; margin: 0; font-size: 1rem; }

                .main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
                @media (max-width: 1100px) { .main-grid { grid-template-columns: 1fr; } }

                .left-col, .right-col { display: flex; flex-direction: column; gap: 2rem; }

                .card { background: white; border-radius: 1.25rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.02); overflow: hidden; }
                
                .card-header { padding: 1.5rem 1.75rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .card-header h2 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.01em; }
                
                .count-badge { font-size: 0.75rem; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 0.25rem 0.75rem; border-radius: 2rem; }

                .table-wrap { min-height: 200px; }
                .products-table { width: 100%; border-collapse: collapse; text-align: left; }
                .products-table th { padding: 1rem 1.75rem; font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #f1f5f9; }
                .products-table td { padding: 1.25rem 1.75rem; border-bottom: 1px solid #f8fafc; font-size: 0.9rem; }
                .products-table tr:hover td { background: #f8fafc; }
                
                .product-name { color: #0f172a; }
                .category-tag { font-size: 0.75rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 0.2rem 0.6rem; border-radius: 0.5rem; }
                .price-old { color: #94a3b8; text-decoration: line-through; font-size: 0.8rem; }
                .price-promo { color: #10b981; font-weight: 800; font-size: 1rem; }
                
                .btn-delete { color: #ef4444; font-size: 0.75rem; font-weight: 700; border: none; background: none; cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; transition: 0.2s; }
                .btn-delete:hover { background: #fef2f2; }
                .text-right { text-align: right; }

                .product-form { padding: 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-size: 0.875rem; font-weight: 700; color: #334155; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .btn-submit { background: #0f172a; color: white; padding: 0.875rem; border-radius: 0.75rem; font-weight: 700; border: none; cursor: pointer; transition: 0.2s; margin-top: 0.5rem; }
                .btn-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }
                .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

                .tips-card { padding: 1.5rem; background: #eff6ff; border-color: #dbeafe; }
                .tips-card h3 { font-size: 0.875rem; font-weight: 800; color: #2563eb; margin: 0 0 0.5rem; }
                .tips-card p { font-size: 0.875rem; color: #1e40af; line-height: 1.5; margin: 0; }

                .empty-state { text-align: center; padding: 4rem 2rem; color: #94a3b8; }
                .empty-state .icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
                .empty-state .sub { font-size: 0.875rem; margin-top: 0.25rem; }

                .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; color: #64748b; }
                .spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
