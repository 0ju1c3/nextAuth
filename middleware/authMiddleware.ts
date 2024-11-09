import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET

export function authenticate(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    if (!JWT_SECRET) {
        return res.status(400).json({ message: "jwt secret required" })
    }
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next()
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" })
    }
}

export const config = {
    matcher: '/dashboard/:userID'//path
}
