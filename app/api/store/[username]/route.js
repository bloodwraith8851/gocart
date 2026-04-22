import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    try {
        // params is a Promise in Next.js 15, we need to await it
        const resolvedParams = await params;
        const { username } = resolvedParams;

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        const store = await prisma.store.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                description: true,
                logo: true,
                createdAt: true,
                username: true,
                isActive: true,
            }
        })

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 })
        }

        return NextResponse.json({ store }, { status: 200 })
    } catch (error) {
        console.error("Fetch store details error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
