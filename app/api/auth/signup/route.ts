import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const checkUser = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (checkUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 })
        }

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
