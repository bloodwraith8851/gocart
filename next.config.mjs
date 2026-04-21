/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },

    // ── Turbopack (default in Next 15 dev) — already fast but ensure it's on
    // This is the default in Next 15, listed here for clarity

    // ── Experimental optimizations ──────────────────────────────────────────
    experimental: {
        // Eagerly compile all pages on dev server start instead of on first visit.
        // Eliminates the 5-30s "○ Compiling /admin..." spikes you see in the logs.
        // Trade-off: slightly slower initial `npm run dev` start, but ZERO compile
        // wait when navigating to any page.
        webpackBuildWorker: true,

        // Enable instrumentation.js (runs once at server start for DB warm-up)
        instrumentationHook: true,

        // Reduce JS bundle size by not including unused Turbopack chunks early
        optimizePackageImports: [
            "lucide-react",
            "recharts",
            "@clerk/nextjs",
            "react-hot-toast",
            "date-fns",
        ],
    },

    // ── Compiler options ────────────────────────────────────────────────────
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === "production"
            ? { exclude: ["error", "warn"] }
            : false,
    },
};

export default nextConfig;
