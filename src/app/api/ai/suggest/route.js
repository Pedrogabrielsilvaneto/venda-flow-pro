import { NextResponse } from 'next/server';
import Lead from '@/models/Lead';
import Config from '@/models/Config';
import Product from '@/models/Product';
import { suggestReply } from '@/lib/ai-service';
import connectDB from '@/lib/mongodb';

export async function POST(req) {
    try {
        await connectDB();
        const { id } = await req.json();

        const lead = await Lead.findById(id);
        if (!lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        const companyDoc = await Config.findOne({ key: 'company_name' });
        const companyName = companyDoc?.value || 'Pereira Acabamentos';

        // Buscar produtos para dar contexto à IA
        const products = await Product.find({});
        const productContext = products.map(p =>
            `- ${p.nome} (${p.categoria}): R$ ${p.precoPromocional} (De: R$ ${p.precoOriginal})`
        ).join('\n');

        const context = `
            Empresa: ${companyName}
            Estágio Atual do Lead: ${lead.stage}
            Produtos em Catálogo:
            ${productContext || 'Nenhum produto cadastrado no momento.'}
        `;

        const suggestion = await suggestReply(lead.history, context);

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error('AI Suggest Error:', error);
        return NextResponse.json({ error: 'Erro ao gerar sugestão' }, { status: 500 });
    }
}
