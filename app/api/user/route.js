import { getAuth, clerkClient } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * GET /api/user
 * Upserts the signed-in Clerk user into the DB.
 * Optimized:
 *  - Single upsert (no separate findUnique → create round-trips)
 *  - select only the fields the client uses
 *  - Clerk fetch and upsert run in minimal sequential order
 *    (Clerk data needed before upsert — truly unavoidable)
 */
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 })
        }

        // 1. Fetch Clerk profile and existing DB cart IN PARALLEL
        const [clerkUser, existingUser] = await Promise.all([
            clerkClient().then((c) => c.users.getUser(userId)),
            prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, cart: true },  // only need id + cart for the check
            }),
        ])

        const name  = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User"
        const email = clerkUser.emailAddresses[0]?.emailAddress || ""
        const image = clerkUser.imageUrl || ""

        // 2. Upsert — single DB round-trip regardless of whether user exists
        const user = await prisma.user.upsert({
            where:  { id: userId },
            create: { id: userId, name, email, image, cart: {} },
            update: { name, email, image },           // keep cart untouched on update
            select: { id: true, name: true, email: true, image: true, cart: true },
        })

        return NextResponse.json(
            { user },
            {
                headers: {
                    // Private cache — valid 30 s per user session
                    "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
                },
            }
        )
    } catch (error) {
        console.error("[GET /api/user]", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
