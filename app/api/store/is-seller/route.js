import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";


export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const storeInfo = await Prisma.store.findUnique({
            where: { userID }
        })

        return NextResponse.json({ isSeller, storeInfo })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}