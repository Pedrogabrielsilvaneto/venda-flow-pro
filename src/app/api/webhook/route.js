import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { handleIncomingMessage } from '@/lib/bot-logic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse(null, { status: 403 });
        }
    }
    return new NextResponse(null, { status: 400 });
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json();

    // Verifica se é uma mensagem do WhatsApp
    if (body.object === 'whatsapp_business_account') {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const msg = body.entry[0].changes[0].value.messages[0];
            const from = msg.from; // Número do cliente
            const text = msg.text?.body;

            if (text) {
                // Envia para a lógica do bot assincronamente (ou aguarda se for pequeno)
                await handleIncomingMessage(from, text);
            }
        }
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
    } else {
        return new NextResponse(null, { status: 404 });
    }
}
