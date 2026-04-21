import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST — sync cart state to DB for persistence
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const { cart } = await request.json();

        await prisma.user.upsert({
            where: { id: userId },
            update: { cart: cart || {} },
            create: { id: userId, cart: cart || {}, name: "User", email: "", image: "" },
        });

        return NextResponse.json({ message: "cart synced" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
