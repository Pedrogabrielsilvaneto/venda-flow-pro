import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BotStatus from '@/models/BotStatus';

export async function GET() {
    try {
        await dbConnect();
        const statusDoc = await BotStatus.findOne({ identifier: 'main_bot' });
        
        if (!statusDoc) {
            return NextResponse.json({ 
                status: 'disconnected', 
                qrCode: '', 
                updatedAt: new Date()
            });
        }

        return NextResponse.json({
            status: statusDoc.status,
            qrCode: statusDoc.qrCode,
            updatedAt: statusDoc.updatedAt
        });
    } catch (error) {
        console.error('Erro ao ler status do DB:', error);
        return NextResponse.json({ error: 'Falha ao sincronizar status' }, { status: 500 });
    }
}

// Permitir reinicialização vindo do dashboard (mesmo que seja só limpeza no DB)
export async function POST() {
    try {
        await dbConnect();
        await BotStatus.findOneAndUpdate(
            { identifier: 'main_bot' },
            { status: 'disconnected', qrCode: '', updatedAt: new Date() },
            { upsert: true }
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao resetar' }, { status: 500 });
    }
}
