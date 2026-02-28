import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Conexão simulada caso chame fora, mas ideal importar lib/mongodb
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
}

export async function GET() {
    await connectToDatabase();
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { name, email, password, role } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Usuário (e-mail) já cadastrado.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'user'; // 'admin' ou 'user' (vendedor/atendente)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
        });

        const userObj = newUser.toObject();
        delete userObj.password;

        return NextResponse.json(userObj, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
