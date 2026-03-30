import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BotStatus from '@/models/BotStatus';

export async function POST() {
    try {
        await dbConnect();
        // Limpando o rastro no banco de dados para sincronizar o logout
        await BotStatus.findOneAndUpdate(
            { identifier: 'main_bot' },
            { status: 'disconnected', qrCode: '', updatedAt: new Date() },
            { upsert: true }
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao limpar status:', error);
        return NextResponse.json({ error: 'Falha ao desvincular' }, { status: 500 });
    }
}
