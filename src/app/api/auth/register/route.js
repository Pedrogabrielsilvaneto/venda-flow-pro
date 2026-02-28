import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await dbConnect();
        const { name, email, password, businessName } = await request.json();

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            businessName,
            role: 'user', // Default role for new signups
        });

        return NextResponse.json({
            message: 'Usuário criado com sucesso!',
            user: { id: user._id, name: user.name, email: user.email }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 500 });
    }
}
