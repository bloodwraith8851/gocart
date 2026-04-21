import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

function isAdmin(userId) {
    return userId && ADMIN_USER_ID && userId === ADMIN_USER_ID;
}

// GET — admin dashboard stats
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!isAdmin(userId)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const [products, orders, stores] = await Promise.all([
            prisma.product.count(),
            prisma.order.findMany({ select: { total: true, createdAt: true } }),
            prisma.store.count(),
        ]);

        const revenue = orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);

        return NextResponse.json({
            dashboardData: {
                products,
                orders: orders.length,
                stores,
                revenue,
                allOrders: orders,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
