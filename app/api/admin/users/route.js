import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { checkAdmin } from "@/lib/adminAuth"

export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = await checkAdmin(userId)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { buyerOrders: true }
                }
            },
            orderBy: { id: 'desc' }
        })

        return NextResponse.json({ users }, { status: 200 })
    } catch (error) {
        console.error("Admin fetch users error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
