import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Lead from '@/models/Lead';
import { sendWhatsAppMessage } from '@/lib/bot-logic';

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(req, { params }) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(MONGODB_URI);
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { id } = await params;

        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const lead = await Lead.findById(id);
        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Assumir atendimento humano automaticamente ao enviar
        lead.botPaused = true;
        lead.lastInteraction = new Date();

        const newMsg = {
            from: 'agent',
            text: text,
            timestamp: new Date()
        };

        lead.history.push(newMsg);
        await lead.save();

        // Enviar via Meta Oficial
        await sendWhatsAppMessage(lead.phoneNumber, text);

        return NextResponse.json(lead, { status: 200 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
