import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const [orders, products] = await Promise.all([
            prisma.order.findMany({ where: { storeId } }),
            prisma.product.findMany({ where: { storeId } }),
        ]);

        const productIds = products.map((p) => p.id);

        const ratings = await prisma.rating.findMany({
            where: { productId: { in: productIds } },
            include: { user: true, product: true },
        });

        const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((acc, o) => acc + o.total, 0)),
            totalProducts: products.length,
        };

        return NextResponse.json({ dashboardData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}