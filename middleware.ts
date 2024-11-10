import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
const JWT_SECRET = process.env.JWT_SECRET as string

export default function authenticate(req: NextRequest) {
    if (!JWT_SECRET) {
        return NextResponse.json({ message: "jwt secret required" }, { status: 400 })
    }
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
        return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded)
        req.nextUrl.searchParams.set('user', JSON.stringify(decoded))
        console.log(req)
        return NextResponse.next()
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 403 })
    }
}

export const config = {
    matcher: '/api/dashboard/:path*'//path
}
