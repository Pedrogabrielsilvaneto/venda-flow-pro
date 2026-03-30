import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const username = 'admin';
        const hashedPassword = await bcrypt.hash('admin', 12);

        // Delete existing admin if any to ensures password is updated
        await User.deleteOne({ username });

        await User.create({
            name: 'Administrador',
            username: username,
            password: hashedPassword,
            role: 'admin',
            status: 'offline'
        });

        return NextResponse.json({
            message: 'Admin user created/updated successfully',
            credentials: {
                username: 'admin',
                password: 'admin'
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
