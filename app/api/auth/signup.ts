import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword
            }
        })

        return res.status(201).json({ message: "User created", user: newUser })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
