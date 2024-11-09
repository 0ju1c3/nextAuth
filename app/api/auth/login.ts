import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (!JWT_SECRET) {
        return res.status(400).json({ message: "Missing jwt secret" })
    }
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required" })
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user || !bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Invalid username or password" })
        }
        const token = jwt.sign({ userID: user.id }, JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).json({ message: "Login successfult", token })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
