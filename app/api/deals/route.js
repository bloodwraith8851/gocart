import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            where: { isPublic: true },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ coupons }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 })
    }
}
