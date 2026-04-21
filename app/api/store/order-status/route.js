import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";

// PATCH — update order status
export async function PATCH(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const { orderId, status } = await request.json();
        const validStatuses = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

        if (!orderId || !validStatuses.includes(status)) {
            return NextResponse.json({ error: "invalid order ID or status" }, { status: 400 });
        }

        // Ensure the order belongs to this store
        const order = await prisma.order.findFirst({ where: { id: orderId, storeId } });
        if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 });

        const updated = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return NextResponse.json({ order: updated });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
