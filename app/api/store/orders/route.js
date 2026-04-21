import { routeHandler, withAuth, apiOk, apiError } from "@/lib/api"
import prisma from "@/lib/prisma"
import authSeller from "@/middlewares/authSeller"

// Only select fields the store orders UI actually renders
const ORDER_SELECT = {
    id:        true,
    total:     true,
    status:    true,
    createdAt: true,
    address: {
        select: { name: true, city: true, state: true, zip: true },
    },
    user: {
        select: { name: true, email: true },
    },
    orderItems: {
        select: {
            quantity: true,
            price:    true,
            product: {
                select: { id: true, name: true, images: true },
            },
        },
    },
}

// GET — seller's orders (optimized select, no full includes)
export const GET = routeHandler(async (request) => {
    const { userId } = withAuth(request)
    const storeId    = await authSeller(userId)
    if (!storeId) return apiError("Unauthorized", 401)

    const orders = await prisma.order.findMany({
        where:   { storeId },
        select:  ORDER_SELECT,
        orderBy: { createdAt: "desc" },
        take:    100,  // guard against full table scans on large stores
    })

    return apiOk({ orders }, { cache: "private, max-age=30, stale-while-revalidate=60" })
})
