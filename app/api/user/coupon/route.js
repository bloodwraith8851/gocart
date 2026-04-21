import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST — validate a coupon code
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const { code } = await request.json();
        if (!code) return NextResponse.json({ error: "coupon code required" }, { status: 400 });

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!coupon) {
            return NextResponse.json({ error: "invalid coupon code" }, { status: 404 });
        }

        if (new Date(coupon.expiresAt) < new Date()) {
            return NextResponse.json({ error: "coupon has expired" }, { status: 400 });
        }

        // Check if new-user coupon and user already has past orders
        if (coupon.forNewUser) {
            const orderCount = await prisma.order.count({ where: { userId } });
            if (orderCount > 0) {
                return NextResponse.json({ error: "coupon is only for new users" }, { status: 400 });
            }
        }

        return NextResponse.json({ coupon });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
