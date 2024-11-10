import prism from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const url = new URL(req.url);
    const userID = url.searchParams.get('userID');

    if (!userID) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }
    const parsedUserID = parseInt(userID, 10)

    try {
        const user = await prism.user.findFirst({
            where: {
                id: parsedUserID
            }
        })

        if (!user) {
            return NextResponse.json({ message: "Username with the given userID not found" }, { status: 404 })
        }

        return NextResponse.json({ user }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
