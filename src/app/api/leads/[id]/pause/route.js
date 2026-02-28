import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Lead from '@/models/Lead';

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(req, { params }) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(MONGODB_URI);
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { id } = await params;

        const { paused } = await req.json();

        const lead = await Lead.findById(id);
        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        lead.botPaused = paused === true;
        await lead.save();

        return NextResponse.json({ success: true, botPaused: lead.botPaused }, { status: 200 });
    } catch (error) {
        console.error('Error pausing bot:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
