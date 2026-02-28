import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Config from '@/models/Config';

export async function GET() {
    await dbConnect();
    const config = await Config.find({});
    return NextResponse.json(config);
}

export async function POST(request) {
    await dbConnect();
    const { key, value } = await request.json();
    const config = await Config.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
    );
    return NextResponse.json(config);
}
