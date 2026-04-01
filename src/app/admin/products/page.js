'use client';
import { useState, useEffect } from 'react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ nome: '', descricao: '', precoOriginal: '', precoPromocional: '', categoria: 'Porcelanato' });
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
                setForm({ nome: '', descricao: '', precoOriginal: '', precoPromocional: '', categoria: 'Porcelanato' });
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
        <div className="products-container">
            <header className="products-header">
                <div>
                    <h1>Gerenciamento de Catálogo</h1>
                    <p>Configure os produtos que a IA Lia irá oferecer aos seus clientes.</p>
                </div>
            </header>

            <div className="products-layout">
                <div className="catalog-section glass-card">
                    <div className="section-header">
                        <h2>Estoque Digital</h2>
                        <span className="badge-premium">{products.length} itens</span>
                    </div>

                    <div className="table-container">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner-premium" />
                                <p>Sincronizando produtos...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <span>📦</span>
                                <p>Nenhum produto cadastrado.</p>
                            </div>
                        ) : (
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Preço</th>
                                        <th>Categoria</th>
                                        <th className="action-col">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <div className="product-info-cell">
                                                    <div className="product-icon">💎</div>
                                                    <div>
                                                        <strong>{p.nome}</strong>
                                                        <span className="text-muted text-xs">{p.descricao?.slice(0, 30)}...</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="price-tag-premium">R$ {p.precoPromocional || p.precoOriginal}</span>
                                            </td>
                                            <td><span className="tag-outline">{p.categoria}</span></td>
                                            <td className="action-col">
                                                <button className="btn-icon-delete" onClick={() => handleDelete(p._id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <div className="glass-card form-card">
                        <div className="section-header">
                            <h2>✨ Novo Lançamento</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="input-group">
                                <label>Nome do Produto</label>
                                <input
                                    required
                                    value={form.nome}
                                    onChange={e => setForm({ ...form, nome: e.target.value })}
                                    placeholder="Ex: Porcelanato Nero Polido"
                                />
                            </div>
                            <div className="input-group">
                                <label>Descrição</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.descricao}
                                    onChange={e => setForm({ ...form, descricao: e.target.value })}
                                    placeholder="Descreva as características técnicas..."
                                />
                            </div>
                            <div className="grid-form">
                                <div className="input-group">
                                    <label>Categoria</label>
                                    <select
                                        value={form.categoria}
                                        onChange={e => setForm({ ...form, categoria: e.target.value })}
                                    >
                                        <option>Porcelanato</option>
                                        <option>Piso Cerâmico</option>
                                        <option>Metais</option>
                                        <option>Acessórios</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Preço Base (R$)</label>
                                    <input
                                        type="number"
                                        required
                                        value={form.precoOriginal}
                                        onChange={e => setForm({ ...form, precoOriginal: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-submit-premium" disabled={submitting}>
                                {submitting ? 'Gravando...' : 'Adicionar ao Catálogo'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card helper-card">
                        <h3>💡 Dica do Consultor</h3>
                        <p>Produtos com descrições detalhadas ajudam a IA Lia a converter mais vendas pelo WhatsApp.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .products-container { padding: 1rem; animation: fadeUp 0.6s ease-out; }
                @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }

                .products-header { margin-bottom: 2rem; }
                .products-header h1 { font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.03em; }
                .products-header p { color: var(--text-secondary); font-size: 1rem; }

                .products-layout { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; }
                @media (max-width: 1100px) { .products-layout { grid-template-columns: 1fr; } }

                .section-header { padding: 1.5rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; }
                .section-header h2 { font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin: 0; }
                
                .badge-premium { background: var(--accent-color); color: white; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 2rem; border: 1px solid var(--card-border); }

                .table-container { min-height: 400px; }
                .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
                .premium-table th { padding: 1rem 1.5rem; font-size: 0.7rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--card-border); }
                .premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--card-border); font-size: 0.9rem; color: var(--text-main); }
                .premium-table tr:hover td { background: rgba(141, 123, 104, 0.02); }

                .product-info-cell { display: flex; align-items: center; gap: 1rem; }
                .product-icon { width: 40px; height: 40px; border-radius: 0.75rem; background: var(--accent-glow); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid var(--card-border); }
                .product-info-cell strong { display: block; color: var(--text-main); margin-bottom: 0.2rem; }

                .price-tag-premium { color: var(--primary-brand); font-weight: 800; background: rgba(74, 63, 53, 0.05); padding: 0.25rem 0.6rem; border-radius: 0.5rem; }
                .tag-outline { color: var(--text-muted); border: 1px solid var(--card-border); padding: 0.2rem 0.6rem; border-radius: 0.5rem; font-size: 0.75rem; background: rgba(255,255,255,0.03); }

                .btn-icon-delete { background: none; border: none; cursor: pointer; transition: var(--transition); opacity: 0.6; }
                .btn-icon-delete:hover { transform: scale(1.2); opacity: 1; }
                .action-col { text-align: right; }

                .premium-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
                .input-group input, .input-group select, .input-group textarea { background: rgba(255, 255, 255, 0.5); border: 1px solid var(--card-border); border-radius: 0.75rem; padding: 0.75rem 1rem; color: var(--text-main); font-size: 0.95rem; outline: none; transition: var(--transition); }
                .input-group input:focus, .input-group textarea:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px var(--accent-glow); }
                
                .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .btn-submit-premium { background: var(--gradient-accent); color: white; border: none; padding: 1rem; border-radius: 0.75rem; font-weight: 800; cursor: pointer; transition: var(--transition); margin-top: 0.5rem; font-size: 0.95rem; }
                .btn-submit-premium:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px var(--accent-glow); }
                .btn-submit-premium:disabled { opacity: 0.5; cursor: not-allowed; }

                .helper-card { padding: 1.5rem; background: rgba(200, 182, 166, 0.1); border: 1px solid var(--card-border); margin-top: 1rem; }
                .helper-card h3 { font-size: 0.9rem; font-weight: 800; color: var(--primary-brand); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .helper-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

                .loading-state { height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); gap: 1rem; }
                .spinner-premium { width: 32px; height: 32px; border: 3px solid var(--card-border); border-top-color: var(--secondary-brand); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .empty-state { text-align: center; padding: 4rem 1rem; color: var(--text-dim); }
                .empty-state span { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.3; }
                
                .text-xs { font-size: 0.75rem; }
            `}</style>
        </div>
    );
}
