import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    precoOriginal: { type: Number, required: true },
    precoPromocional: { type: Number },
    unidade: { type: String, default: 'm²' },
    categoria: { type: String, required: true }, // ex: Porcelanatos, Metais, Tintas
    destaque: { type: Boolean, default: false },
    imagens: { type: [String], default: [] }, // Array de URLs das imagens
    estoque: { type: Number, default: 0 },
    tags: { type: [String], default: [] }, // Para buscas rápidas da IA
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
