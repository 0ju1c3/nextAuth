import prism from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function getDashboard(req: NextApiRequest, res: NextApiResponse) {
    const userID = req.query.userID as string
    if (!userID) {
        return res.status(400).json({ message: "User ID is required" })
    }
    const parsedUserID = parseInt(userID, 10)

    try {
        const user = await prism.user.findFirst({
            where: {
                id: parsedUserID
            }
        })

        if (!user) {
            return res.status(404).json({ message: "Username with the given userID not found" })
        }

        return res.status(200).json({ user })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
