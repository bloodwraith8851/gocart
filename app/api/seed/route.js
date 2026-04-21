import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Dev-only seeder — creates a demo store + 10 products + sample coupons
// Hit GET /api/seed to populate your database for demo purposes
export async function GET(request) {

    // Safety check — only allow in development
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not available in production" }, { status: 403 });
    }

    try {
        // ── 1. Demo user ──
        const DEMO_USER_ID = "demo_seller_gocart_001";
        let user = await prisma.user.findUnique({ where: { id: DEMO_USER_ID } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: DEMO_USER_ID,
                    name: "GoCart Demo Store",
                    email: "demo@gocart.io",
                    image: "https://ui-avatars.com/api/?name=GoCart&background=0071e3&color=fff&size=128",
                    cart: {},
                },
            });
        }

        // ── 2. Demo store ──
        let store = await prisma.store.findFirst({ where: { userId: DEMO_USER_ID } });
        if (!store) {
            store = await prisma.store.create({
                data: {
                    userId: DEMO_USER_ID,
                    name: "GoCart Official",
                    username: "gocart-official",
                    description: "The official GoCart demo store — featuring the best electronics at unbeatable prices. Curated products, honest reviews, fast shipping.",
                    email: "demo@gocart.io",
                    contact: "+1 212 456 7890",
                    address: "123 Market St, San Francisco, CA 94105",
                    logo: "https://ui-avatars.com/api/?name=GC&background=0071e3&color=fff&bold=true&size=128",
                    status: "approved",
                    isActive: true,
                },
            });
        }

        // ── 3. Products ──
        const PRODUCTS = [
            {
                name: "Sony WH-1000XM5 Wireless Headphones",
                description: "Industry-leading noise cancellation with two processors and eight microphones. 30-hour battery life, quick charge (3 min = 3 hours), and crystal-clear hands-free calling. Foldable and lightweight for travel.",
                mrp: 399,
                price: 279,
                category: "Headphones",
                images: [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
                    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
                ],
            },
            {
                name: "Apple AirPods Pro 2nd Gen",
                description: "Active Noise Cancellation up to 2x more powerful than AirPods Pro 1st gen. Adaptive Transparency, Personalized Spatial Audio, and up to 30 hours total battery life with the case.",
                mrp: 249,
                price: 189,
                category: "Earbuds",
                images: [
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
                    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80",
                ],
            },
            {
                name: "Apple Watch Series 9 GPS 45mm",
                description: "The most advanced Apple Watch yet with the new S9 chip, brighter always-on display up to 2000 nits, and Double Tap gesture. Carbon neutral and built from 100% recycled aluminium.",
                mrp: 429,
                price: 349,
                category: "Watch",
                images: [
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
                    "https://images.unsplash.com/photo-1559818824-4240995b39a7?w=600&q=80",
                ],
            },
            {
                name: "Sony Alpha 7 IV Full-Frame Mirrorless",
                description: "33MP full-frame BSI-CMOS sensor with AI-powered autofocus, 4K 60p video, 10-bit colour, and 828 phase-detection AF points. Perfect for professional photography and video.",
                mrp: 2498,
                price: 2199,
                category: "Camera",
                images: [
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
                    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80",
                ],
            },
            {
                name: "MacBook Air M3 13-inch",
                description: "The most advanced 13-inch MacBook Air. Supercharged by the M3 chip, with up to 18 hours of battery life, an 8-core CPU, and a 10-core GPU. Available in four stunning colours.",
                mrp: 1299,
                price: 1099,
                category: "Electronics",
                images: [
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
                ],
            },
            {
                name: "Bose SoundLink Max Portable Speaker",
                description: "Richer, more immersive audio wherever you go. Up to 20 hours of wireless playtime, IP67 water and dust resistance, and a detachable carrying strap. Two speaker modes: stereo or party.",
                mrp: 399,
                price: 329,
                category: "Speakers",
                images: [
                    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
                ],
            },
            {
                name: "Logitech MX Master 3S Mouse",
                description: "8K DPI Darkfield sensor — works on glass. 70-day battery, silent MagSpeed scroll wheel, ergonomic design with thumb rest. USB-C charging and multi-device Bluetooth.",
                mrp: 99,
                price: 79,
                category: "Mouse",
                images: [
                    "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80",
                    "https://images.unsplash.com/photo-1586104195538-050b9f74f58e?w=600&q=80",
                ],
            },
            {
                name: "LG 27GP850-B 27\" QHD Gaming Monitor",
                description: "1440p Nano IPS display at 165Hz (OC to 180Hz), 1ms GtG, HDR400, NVIDIA G-Sync compatible, AMD FreeSync Premium. HDMI 2.0 and DisplayPort 1.4 inputs.",
                mrp: 449,
                price: 329,
                category: "Electronics",
                images: [
                    "https://images.unsplash.com/photo-1527443224154-c4a573d566fc?w=600&q=80",
                    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
                ],
            },
            {
                name: "Keychron Q1 Pro QMK Wireless Keyboard",
                description: "Full aluminium body, hot-swappable switches, RGB backlighting, QMK/VIA support, gasket-mounted plate. Works with Bluetooth 5.1 and USB-C. Mac + Windows compatible.",
                mrp: 199,
                price: 169,
                category: "Electronics",
                images: [
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
                    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
                ],
            },
            {
                name: "DJI Osmo Mobile 6 Gimbal Stabilizer",
                description: "3-axis stabilization with AI subject tracking, built-in extension rod, 215° tilt range, ActiveTrack 6.0, and magnetic clamp for one-handed use. Compatible with most smartphones.",
                mrp: 159,
                price: 119,
                category: "Camera",
                images: [
                    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80",
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
                ],
            },
        ];

        let seeded = 0;
        for (const p of PRODUCTS) {
            const existing = await prisma.product.findFirst({ where: { name: p.name, storeId: store.id } });
            if (!existing) {
                await prisma.product.create({
                    data: { ...p, storeId: store.id, inStock: true },
                });
                seeded++;
            }
        }

        // ── 4. Sample coupons ──
        const COUPONS = [
            { code: "NEW20", description: "20% off for new users", discount: 20, forNewUser: true, forMember: false, isPublic: true, expiresAt: new Date("2027-12-31") },
            { code: "SAVE10", description: "10% off on all orders", discount: 10, forNewUser: false, forMember: false, isPublic: true, expiresAt: new Date("2027-12-31") },
            { code: "VIP30", description: "30% off for VIP members", discount: 30, forNewUser: false, forMember: true, isPublic: false, expiresAt: new Date("2027-12-31") },
        ];
        for (const coupon of COUPONS) {
            await prisma.coupon.upsert({ where: { code: coupon.code }, update: {}, create: coupon });
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${seeded} new products, ${PRODUCTS.length - seeded} already existed.`,
            store: store.name,
            storeUsername: store.username,
            totalProducts: PRODUCTS.length,
            coupons: COUPONS.map((c) => c.code),
        });
    } catch (err) {
        console.error("[SEED]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
