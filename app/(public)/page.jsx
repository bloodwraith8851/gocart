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
// Lightweight section placeholder shown until the section enters the viewport
function SectionSkeleton({ height = 400, dark = false }) {
    return (
        <div style={{
            minHeight: height,
            backgroundColor: dark ? "#000" : "#f5f5f7",
            padding: "80px 20px"
        }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <div className={dark ? "skeleton-dark" : "skeleton"} style={{ width: "80px", height: "12px", borderRadius: "980px", marginBottom: "12px" }} />
                        <div className={dark ? "skeleton-dark" : "skeleton"} style={{ width: "240px", height: "36px", borderRadius: "8px" }} />
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                    {Array(4).fill(null).map((_, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div className={dark ? "skeleton-dark" : "skeleton"} style={{ aspectRatio: "1/1", borderRadius: "14px" }} />
                            <div className={dark ? "skeleton-dark" : "skeleton"} style={{ height: "14px", width: "80%", borderRadius: "5px" }} />
                            <div className={dark ? "skeleton-dark" : "skeleton"} style={{ height: "14px", width: "60%", borderRadius: "5px" }} />
                        </div>
                    ))}
                </div>
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
