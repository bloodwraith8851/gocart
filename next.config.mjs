/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },

    experimental: {
        // Enable instrumentation.js (DB warm-up at server start)
        instrumentationHook: true,

        // Tree-shake heavy packages — reduces per-page bundle size significantly
        optimizePackageImports: [
            "lucide-react",
            "recharts",
            "@clerk/nextjs",
            "react-hot-toast",
            "date-fns",
        ],
    },

    // Strip console.log from production bundle (keep warn/error)
    compiler: {
        removeConsole: process.env.NODE_ENV === "production"
            ? { exclude: ["error", "warn"] }
            : false,
    },

    // Required for Railway — listens on the PORT env var Railway provides
    // Next.js reads this automatically via `next start -p $PORT`
    // (Railway sets PORT=8080 by default)
};

export default nextConfig;
