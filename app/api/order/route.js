import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST — place a new order
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

        const body = await request.json();
        const { addressId, paymentMethod, cartItems, couponCode } = body;

        if (!addressId || !paymentMethod || !cartItems || Object.keys(cartItems).length === 0) {
            return NextResponse.json({ error: "missing order information" }, { status: 400 });
        }

        // Validate address belongs to user
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!address) return NextResponse.json({ error: "invalid address" }, { status: 400 });

        // Fetch all products
        const productIds = Object.keys(cartItems);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        if (products.length === 0) {
            return NextResponse.json({ error: "no valid products in cart" }, { status: 400 });
        }

        // Group by storeId — each store gets its own order
        const storeMap = {};
        for (const product of products) {
            if (!storeMap[product.storeId]) storeMap[product.storeId] = [];
            storeMap[product.storeId].push(product);
        }

        // Handle coupon
        let coupon = null;
        if (couponCode) {
            coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
        }

        const createdOrders = [];

        for (const [storeId, storeProducts] of Object.entries(storeMap)) {
            let subtotal = storeProducts.reduce((sum, p) => {
                return sum + p.price * (cartItems[p.id] || 0);
            }, 0);

            const discount = coupon ? (coupon.discount / 100) * subtotal : 0;
            const total = parseFloat((subtotal - discount).toFixed(2));

            const order = await prisma.order.create({
                data: {
                    userId,
                    storeId,
                    addressId,
                    total,
                    paymentMethod,
                    isCouponUsed: !!coupon,
                    coupon: coupon || {},
                    orderItems: {
                        create: storeProducts.map((p) => ({
                            productId: p.id,
                            quantity: cartItems[p.id] || 1,
                            price: p.price,
                        })),
                    },
                },
            });
            createdOrders.push(order);
        }

        // Clear cart in DB
        await prisma.user.update({
            where: { id: userId },
            data: { cart: {} },
        });

        return NextResponse.json({ orders: createdOrders, message: "order placed successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
