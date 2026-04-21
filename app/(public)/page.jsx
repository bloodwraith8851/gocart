'use client'
import dynamic from "next/dynamic"
import Hero from "@/components/Hero"
import { useInView } from "@/hooks/useInView"

// Below-fold sections — only bundled/rendered when they scroll into view
const LatestProducts    = dynamic(() => import("@/components/LatestProducts"),    { ssr: false })
const BestSelling       = dynamic(() => import("@/components/BestSelling"),       { ssr: false })
const CategoriesMarquee = dynamic(() => import("@/components/CategoriesMarquee"), { ssr: false })
const OurSpecs          = dynamic(() => import("@/components/OurSpec"),           { ssr: false })
const Newsletter        = dynamic(() => import("@/components/Newsletter"),        { ssr: false })

// Lightweight section placeholder shown until the section enters the viewport
function SectionSkeleton({ height = 400, dark = false }) {
    return (
        <div style={{
            minHeight: height,
            backgroundColor: dark ? "#000" : "#f5f5f7",
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", padding: "20px" }}>
                {Array(4).fill(null).map((_, i) => (
                    <div key={i} className={dark ? "skeleton-dark" : "skeleton"} style={{ width: "200px", height: "260px", borderRadius: "14px" }} />
                ))}
            </div>
        </div>
    )
}

// Lazy wrapper — renders children only once in view, placeholder before
function LazySection({ children, dark = false, height = 420 }) {
    const [ref, visible] = useInView()
    return (
        <div ref={ref}>
            {visible ? children : <SectionSkeleton dark={dark} height={height} />}
        </div>
    )
}

export default function Home() {
    return (
        <div>
            {/* Hero is above-fold — load immediately */}
            <Hero />

            {/* Categories strip — lightweight, load immediately */}
            <CategoriesMarquee />

            {/* Below-fold — lazy loaded */}
            <LazySection dark height={520}>
                <LatestProducts />
            </LazySection>

            <LazySection height={520}>
                <BestSelling />
            </LazySection>

            <LazySection dark height={360}>
                <OurSpecs />
            </LazySection>

            <LazySection dark height={340}>
                <Newsletter />
            </LazySection>
        </div>
    )
}
