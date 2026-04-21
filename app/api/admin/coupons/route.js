import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

// GET — list all coupons
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!isAdmin(userId)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json({ coupons });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — create a coupon
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!isAdmin(userId)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const { code, description, discount, forNewUser, forMember, isPublic, expiresAt } = await request.json();

        if (!code || !description || !discount || !expiresAt) {
            return NextResponse.json({ error: "missing coupon fields" }, { status: 400 });
        }

        const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
        if (existing) return NextResponse.json({ error: "coupon code already exists" }, { status: 400 });

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discount: parseFloat(discount),
                forNewUser: !!forNewUser,
                forMember: !!forMember,
                isPublic: !!isPublic,
                expiresAt: new Date(expiresAt),
            },
        });

        return NextResponse.json({ coupon });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE — delete a coupon by code
export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);
        if (!isAdmin(userId)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) return NextResponse.json({ error: "coupon code required" }, { status: 400 });

        await prisma.coupon.delete({ where: { code: code.toUpperCase() } });
        return NextResponse.json({ message: "coupon deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
