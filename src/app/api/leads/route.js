import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Lead from '@/models/Lead';

const MONGODB_URI = process.env.MONGODB_URI;

export async function GET() {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(MONGODB_URI);
        }
        const leads = await Lead.find().sort({ lastInteraction: -1 }).lean();
        return NextResponse.json(leads, { status: 200 });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
