import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req: Request) {
    if (!JWT_SECRET) {
        return NextResponse.json({ message: "Jwt secret missing" }, { status: 500 })
    }
    const { username, password } = await req.json()

    if (!username || !password) {
        return NextResponse.json({ message: "username and password are required" }, { status: 400 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user || !bcrypt.compare(password, user.password)) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 400 })
        }
        const token = jwt.sign({ userID: user.id }, JWT_SECRET, { expiresIn: '1h' })
        return NextResponse.json({ message: "User logged in", token: token }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

