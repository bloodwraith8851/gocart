/**
 * lib/prisma.js
 *
 * Optimized Neon + Prisma client:
 *  1. True global singleton (survives hot-reload in dev)
 *  2. HTTP fetch mode — avoids WebSocket handshake latency
 *  3. Eager $connect() — pays connection cost at startup not on first query
 *  4. Periodic keep-alive ping — prevents Neon from suspending after idle
 */

import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"

// ─── Use HTTP fetch transport (fastest for serverless) ────────────────────────
neonConfig.fetchConnectionCache = true  // reuse TLS session across fetches in same process
neonConfig.poolQueryViaFetch    = true  // route all queries over HTTP/2, not WebSockets

// ─── Singleton factory ────────────────────────────────────────────────────────
function makePrisma() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set. Add it to .env.local")
    }

    const adapter = new PrismaNeon({ connectionString })

    const client = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })

    // ── Eager connect: pay the SSL/TCP handshake NOW, not on first user request
    client.$connect().catch((err) => {
        console.warn("[Prisma] Initial connect failed — will retry on first query:", err.message)
    })

    // ── Keep-alive: ping every 4 minutes to prevent Neon auto-suspend
    // Neon suspends after 5 min idle on free plan → this keeps it warm
    if (typeof globalThis.__prismaKeepAlive === "undefined") {
        globalThis.__prismaKeepAlive = setInterval(async () => {
            try {
                await client.$queryRaw`SELECT 1`
            } catch {
                // silent — Neon will reconnect on next real query
            }
        }, 4 * 60 * 1000)  // 4 minutes

        // Don't block process exit
        if (globalThis.__prismaKeepAlive?.unref) {
            globalThis.__prismaKeepAlive.unref()
        }
    }

    return client
}

// ─── Global singleton ─────────────────────────────────────────────────────────
const globalForPrisma = globalThis

export const prisma = globalForPrisma.__prisma ?? makePrisma()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__prisma = prisma
}

export default prisma