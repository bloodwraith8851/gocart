import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Only select the fields we actually use in the UI — avoids huge payloads
const PRODUCT_SELECT = {
    id:          true,
    name:        true,
    description: true,
    price:       true,
    mrp:         true,
    category:    true,
    images:      true,
    inStock:     true,
    createdAt:   true,
    store: {
        select: { id: true, name: true, username: true, logo: true },
    },
    rating: {
        select: {
            rating:  true,
            review:  true,
            orderId: true,
            user:    { select: { id: true, name: true, image: true } },
        },
    },
};

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where:   { inStock: true, store: { isActive: true } },
            select:  PRODUCT_SELECT,
            orderBy: { createdAt: "desc" },
            take:    100, // UX optimization: limit global fetch payload
        });

        return NextResponse.json(
            { products },
            {
                headers: {
                    // Fresh for 60 s, serve stale up to 5 min while revalidating in bg
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
                },
            }
        );
    } catch (error) {
        console.error("[/api/products]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
