import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId, rating, review, orderId = "unverified" } = await request.json();

        if (!productId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid rating data" }, { status: 400 });
        }

        // Schema unique constraint: userId_productId_orderId
        const newRating = await prisma.rating.upsert({
            where: { userId_productId_orderId: { userId, productId, orderId } },
            update: { rating, review: review || "" },
            create: { userId, productId, orderId, rating, review: review || "" },
            include: { user: { select: { name: true, image: true } } },
        });

        return NextResponse.json({ rating: newRating });
    } catch (err) {
        console.error("[RATING]", err);
        return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
    }
}
