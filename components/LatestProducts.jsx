'use client'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { fadeUp, staggerCards } from '@/hooks/useScrollAnimation'

function DarkFeaturedSkeleton() {
    return (
        <div className="skeleton-dark" style={{
            gridColumn: "span 2", borderRadius: "20px", display: "flex", flexDirection: "column",
            justifyContent: "space-between", minHeight: "280px", position: "relative",
            overflow: "hidden", padding: "40px"
        }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", marginTop: "auto" }}>
                    <div style={{ width: "120px", height: "24px", borderRadius: "980px", backgroundColor: "rgba(255,255,255,0.05)" }} />
                    <div style={{ width: "70%", height: "24px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.05)" }} />
                    <div style={{ width: "90%", height: "14px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.05)" }} />
                    <div style={{ width: "80%", height: "14px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.05)" }} />
                </div>
                <div style={{ width: "160px", height: "180px", flexShrink: 0, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "14px" }} />
            </div>
        </div>
    )
}

function DarkFeaturedCard({ product }) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const avgRating = product.rating?.length > 0
        ? (product.rating.reduce((a, c) => a + c.rating, 0) / product.rating.length).toFixed(1)
        : null
    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null

    return (
        <Link href={`/product/${product.id}`} className="latest-product-el" style={{ textDecoration: "none", display: "block", gridColumn: "span 2" }}>
            <div style={{
                background: "linear-gradient(135deg, #0d1526 0%, #0a0d1a 60%, #1a0d26 100%)",
                borderRadius: "20px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "280px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(0,113,227,0.2)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 24px 64px rgba(0,113,227,0.2)"; e.currentTarget.style.borderColor = "rgba(0,113,227,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(0,113,227,0.2)"; }}
            >
                {/* Glow */}
                <div style={{ position: "absolute", right: -40, top: -40, width: "320px", height: "320px", background: "radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: "40%", bottom: -60, width: "200px", height: "200px", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                {/* Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", position: "relative" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 800, backgroundColor: "rgba(0,113,227,0.15)", color: "#2997ff", border: "1px solid rgba(0,113,227,0.3)", padding: "4px 12px", borderRadius: "980px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <SparklesIcon size={9} /> New Arrival
                    </span>
                    {discount && (
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#34c759", backgroundColor: "rgba(52,199,89,0.1)", border: "1px solid rgba(52,199,89,0.2)", padding: "4px 12px", borderRadius: "980px" }}>
                            -{discount}% OFF
                        </span>
                    )}
                </div>

                {/* Content + image */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", position: "relative" }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.2rem,2vw,1.75rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: "12px", maxWidth: "300px" }}>
                            {product.name}
                        </h3>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", marginBottom: "16px", maxWidth: "280px", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {product.description}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "26px", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>{currency}{product.price}</span>
                            {product.mrp > product.price && (
                                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.32)", textDecoration: "line-through" }}>{currency}{product.mrp}</span>
                            )}
                        </div>
                        {avgRating && (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "10px" }}>
                                {Array(5).fill("").map((_, i) => (
                                    <StarIcon key={i} size={12} style={{ fill: Math.round(avgRating) > i ? "#5ac8fa" : "rgba(255,255,255,0.1)", color: "transparent" }} />
                                ))}
                                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginLeft: "4px" }}>{avgRating} ({product.rating.length})</span>
                            </div>
                        )}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "16px", color: "#2997ff", fontSize: "13px", fontWeight: 600 }}>
                            Shop now <ArrowRightIcon size={13} />
                        </div>
                    </div>

                    {/* Image */}
                    <div style={{ width: "160px", height: "180px", flexShrink: 0, position: "relative" }}>
                        <Image src={product.images[0]} alt={product.name} fill sizes="160px" loading="lazy"
                            style={{ objectFit: "contain", filter: "drop-shadow(0 12px 40px rgba(0,113,227,0.4))" }} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

const LatestProducts = () => {
    const { list: products, loading } = useSelector((state) => state.product)
    const sectionRef = useRef(null)
    const headerRef = useRef(null)

    const sorted = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8)

    const featured = sorted[0]
    const rest     = sorted.slice(1, 7)

    useLayoutEffect(() => {
        if (!loading && sorted.length > 0 && sectionRef.current) {
            const ctx = gsap.context(() => {
                if (headerRef.current) fadeUp(headerRef.current, { y: 30 })
                staggerCards('.latest-product-el')
            }, sectionRef)
            return () => ctx.revert()
        }
    }, [loading, sorted.length])

    return (
        <section ref={sectionRef} style={{ backgroundColor: "#000", paddingBottom: "4px" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "80px 20px" }}>
                {/* Header */}
                <div ref={headerRef} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", marginBottom: "48px", opacity: 0 }}>
                    <div>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>New Arrivals</p>
                        <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.5px" }}>
                            Latest Products
                        </h2>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>
                            {loading ? "Loading…" : `${sorted.length} fresh arrivals`}
                        </p>
                    </div>
                    <Link href="/shop" style={{ fontSize: "13px", color: "#2997ff", textDecoration: "none", whiteSpace: "nowrap", border: "1px solid rgba(41,151,255,0.4)", borderRadius: "980px", padding: "7px 18px", transition: "background-color 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(41,151,255,0.1)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                        See all ›
                    </Link>
                </div>

                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                            <DarkFeaturedSkeleton />
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div className="skeleton-dark" style={{ aspectRatio: "1/1", borderRadius: "14px" }} />
                                <div className="skeleton-dark" style={{ height: "14px", width: "70%", borderRadius: "5px" }} />
                                <div className="skeleton-dark" style={{ height: "12px", width: "40%", borderRadius: "5px" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div className="skeleton-dark" style={{ aspectRatio: "1/1", borderRadius: "14px" }} />
                                <div className="skeleton-dark" style={{ height: "14px", width: "70%", borderRadius: "5px" }} />
                                <div className="skeleton-dark" style={{ height: "12px", width: "40%", borderRadius: "5px" }} />
                            </div>
                        </div>
                    </div>
                ) : sorted.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.36)" }}>No products yet.</p>
                        <Link href="/api/seed" target="_blank" style={{ color: "#2997ff", fontSize: "14px" }}>Seed demo products →</Link>
                    </div>
                ) : (
                    <>
                        {/* Featured hero */}
                        {featured && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "16px" }}>
                                <DarkFeaturedCard product={featured} />
                                <div className="latest-product-el"><ProductCard product={rest[0]} dark /></div>
                                <div className="latest-product-el"><ProductCard product={rest[1]} dark /></div>
                            </div>
                        )}
                        {/* Remaining */}
                        {rest.length > 2 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                                {rest.slice(2).map((p) => (
                                    <div key={p.id} className="latest-product-el"><ProductCard product={p} dark /></div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

export default LatestProducts