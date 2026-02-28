import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Config from '@/models/Config';

// Seed default values from env vars if not in DB yet
const ENV_DEFAULTS = {
    whatsapp_phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    whatsapp_access_token: process.env.WHATSAPP_ACCESS_TOKEN || '',
    whatsapp_verify_token: process.env.WHATSAPP_VERIFY_TOKEN || '',
};

export async function GET() {
    await dbConnect();
    let configs = await Config.find({});

    // Fill in env defaults for WhatsApp keys if not yet saved in DB
    const configMap = {};
    configs.forEach(c => { configMap[c.key] = c; });

    const extras = [];
    for (const [key, value] of Object.entries(ENV_DEFAULTS)) {
        if (!configMap[key] && value) {
            extras.push({ key, value });
        }
    }

    const allConfigs = [...configs, ...extras];
    return NextResponse.json(allConfigs);
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
