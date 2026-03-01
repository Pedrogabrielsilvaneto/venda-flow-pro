import { NextResponse } from 'next/server';
import Lead from '@/models/Lead';
import Config from '@/models/Config';
import { suggestReply } from '@/lib/ai-service';
import connectDB from '@/lib/mongodb';

export async function POST(req, { params }) {
    try {
        await connectDB();
        const { id } = await req.json(); // Lead ID

        const lead = await Lead.findById(id);
        if (!lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        const companyDoc = await Config.findOne({ key: 'company_name' });
        const companyName = companyDoc?.value || 'Pereira Acabamentos';

        const suggestion = await suggestReply(lead.history, `Empresa: ${companyName}`);

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error('AI Suggest Error:', error);
        return NextResponse.json({ error: 'Erro ao gerar sugestão' }, { status: 500 });
    }
}
