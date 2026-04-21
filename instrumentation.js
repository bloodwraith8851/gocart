/**
 * instrumentation.js
 *
 * Next.js server instrumentation hook — runs ONCE when the server starts.
 * Use this to warm up expensive cold-start resources (DB connections, etc.)
 * so the first user request is fast.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
    // Only run in the Node.js runtime (not edge workers)
    if (process.env.NEXT_RUNTIME === "nodejs") {
        try {
            // Importing prisma here triggers makePrisma() → $connect() eagerly
            // This means the DB connection is established at startup, not on the
            // first user request — eliminating the cold-start spike entirely.
            const { prisma } = await import("@/lib/prisma")

            // Verify the connection with a cheap query
            await prisma.$queryRaw`SELECT 1`
            console.log("[GoCart] ✓ Database connection established")
        } catch (err) {
            // Don't crash the server — log and continue
            console.error("[GoCart] ✗ Database warm-up failed:", err.message)
        }
    }
}
