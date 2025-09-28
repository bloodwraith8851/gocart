import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import { use } from "react";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const storeID = await authSeller(userId)

        const orders = await prisma.order.findMany({
            where: {
                storeID
            },
        })

        const products = await prisma.product.findMany({
            where: {
                storeID
            },
        })

        const ratings = await prisma.rating.findMany({
            where: {
                productID: {
                    in: products.map(product => product.id)
                }
            },
            include: {
                user: true,
                product: true
            }
        })

        const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((acc, order) => acc + order.total, 0)),
            totalProducts: products.length,
        }

        return NextResponse.json({ dashboardData })
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message }, {status: 400});
    }
}