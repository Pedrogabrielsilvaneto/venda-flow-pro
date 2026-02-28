import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    precoOriginal: { type: Number, required: true },
    precoPromocional: { type: Number, required: true },
    unidade: { type: String, default: 'm²' },
    categoria: { type: String, required: true },
    destaque: { type: Boolean, default: false },
    imagem: { type: String }, // URL da imagem
    estoque: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
