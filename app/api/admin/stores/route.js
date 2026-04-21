import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

// GET — list all stores
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!isAdmin(userId)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const stores = await prisma.store.findMany({
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ stores });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH — approve or reject a store
export async function PATCH(request) {
    try {
        const { userId } = getAuth(request);
        if (!isAdmin(userId)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const { storeId, status } = await request.json();
        const validStatuses = ["approved", "rejected", "pending"];

        if (!storeId || !validStatuses.includes(status)) {
            return NextResponse.json({ error: "invalid storeId or status" }, { status: 400 });
        }

        const store = await prisma.store.update({
            where: { id: storeId },
            data: {
                status,
                isActive: status === "approved",
            },
        });

        return NextResponse.json({ store });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
