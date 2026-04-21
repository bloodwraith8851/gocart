import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — list user's addresses
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ addresses });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — create a new address
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const body = await request.json();
        const { name, email, street, city, state, zip, country, phone } = body;

        if (!name || !email || !street || !city || !state || !zip || !country || !phone) {
            return NextResponse.json({ error: "missing address fields" }, { status: 400 });
        }

        const address = await prisma.address.create({
            data: { userId, name, email, street, city, state, zip, country, phone },
        });

        return NextResponse.json({ address });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
