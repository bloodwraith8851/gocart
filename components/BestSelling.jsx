'use client'
import ProductCard from './ProductCard'
import SkeletonCard from './SkeletonCard'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ArrowRightIcon } from 'lucide-react'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { fadeUp, staggerCards } from '@/hooks/useScrollAnimation'

function FeaturedSkeleton() {
    return (
        <div className="skeleton" style={{
            gridColumn: "span 2", borderRadius: "20px", display: "flex", flexDirection: "column",
            justifyContent: "space-between", minHeight: "280px", position: "relative",
            overflow: "hidden", padding: "40px"
        }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", marginTop: "auto" }}>
                    <div style={{ width: "120px", height: "24px", borderRadius: "980px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                    <div style={{ width: "70%", height: "24px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                    <div style={{ width: "90%", height: "14px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                    <div style={{ width: "80%", height: "14px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                </div>
                <div style={{ width: "160px", height: "180px", flexShrink: 0, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "14px" }} />
            </div>
        </div>
    )
}

function FeaturedCard({ product }) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const avgRating = product.rating?.length > 0
        ? (product.rating.reduce((a, c) => a + c.rating, 0) / product.rating.length).toFixed(1)
        : null
    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null

    return (
        <Link href={`/product/${product.id}`} className="bestselling-product-el" style={{ textDecoration: "none", display: "block", gridColumn: "span 2" }}>
            <div style={{
                backgroundColor: "#f0f0f5",
                borderRadius: "20px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "280px",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 24px 64px rgba(0,0,0,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
                {/* Background accent */}
                <div style={{ position: "absolute", right: -30, top: -30, width: "280px", height: "280px", background: "radial-gradient(circle, rgba(0,113,227,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />

                {/* Top badge row */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", position: "relative" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, backgroundColor: "#0071e3", color: "#fff", padding: "4px 12px", borderRadius: "980px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        🏆 #1 Best Seller
                    </span>
                    {discount && (
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#0071e3", backgroundColor: "rgba(0,113,227,0.08)", padding: "4px 12px", borderRadius: "980px" }}>
                            -{discount}% off
                        </span>
                    )}
                </div>

                {/* Content + image */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                        <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.2rem,2vw,1.75rem)", fontWeight: 800, color: "#1d1d1f", lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: "12px", maxWidth: "300px" }}>
                            {product.name}
                        </h3>
                        <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)", marginBottom: "16px", maxWidth: "280px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {product.description}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "26px", fontWeight: 900, color: "#1d1d1f", letterSpacing: "-1px" }}>{currency}{product.price}</span>
                            {product.mrp > product.price && (
                                <span style={{ fontSize: "14px", color: "rgba(0,0,0,0.36)", textDecoration: "line-through" }}>{currency}{product.mrp}</span>
                            )}
                        </div>
                        {avgRating && (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "10px" }}>
                                {Array(5).fill("").map((_, i) => (
                                    <StarIcon key={i} size={12} style={{ fill: Math.round(avgRating) > i ? "#0071e3" : "rgba(0,0,0,0.12)", color: "transparent" }} />
                                ))}
                                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", marginLeft: "4px" }}>{avgRating} ({product.rating.length} reviews)</span>
                            </div>
                        )}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "16px", color: "#0066cc", fontSize: "13px", fontWeight: 600 }}>
                            Shop now <ArrowRightIcon size={13} />
                        </div>
                    </div>

                    {/* Product image */}
                    <div style={{ width: "160px", height: "180px", flexShrink: 0, position: "relative" }}>
                        <Image src={product.images[0]} alt={product.name} fill sizes="160px" loading="lazy"
                            style={{ objectFit: "contain", filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.15))" }} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

const BestSelling = () => {
    const { list: products, loading } = useSelector((state) => state.product)
    const sectionRef = useRef(null)
    const headerRef = useRef(null)

    const sorted = [...products]
        .sort((a, b) => (b.rating?.length || 0) - (a.rating?.length || 0))
        .slice(0, 8)

    const featured = sorted[0]
    const rest     = sorted.slice(1, 7)

    useLayoutEffect(() => {
        if (!loading && sorted.length > 0 && sectionRef.current) {
            const ctx = gsap.context(() => {
                if (headerRef.current) fadeUp(headerRef.current, { y: 30 })
                staggerCards('.bestselling-product-el')
            }, sectionRef)
            return () => ctx.revert()
        }
    }, [loading, sorted.length])


    return (
        <section ref={sectionRef} style={{ backgroundColor: "#f5f5f7" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "80px 20px" }}>
                {/* Header */}
                <div ref={headerRef} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", marginBottom: "48px", opacity: 0 }}>
                    <div>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Top Picks</p>
                        <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, color: "#1d1d1f", lineHeight: 1.05, letterSpacing: "-0.5px" }}>
                            Best Selling
                        </h2>
                        <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.48)", marginTop: "6px" }}>
                            {loading ? "Loading…" : `${sorted.length} most popular products`}
                        </p>
                    </div>
                    <Link href="/shop" style={{ fontSize: "13px", color: "#0066cc", textDecoration: "none", whiteSpace: "nowrap", border: "1px solid rgba(0,102,204,0.4)", borderRadius: "980px", padding: "7px 18px", transition: "background-color 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0,102,204,0.1)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                        See all ›
                    </Link>
                </div>

                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                            <FeaturedSkeleton />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    </div>
                ) : sorted.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <p style={{ fontSize: "17px", color: "rgba(0,0,0,0.36)" }}>No products yet.</p>
                        <Link href="/api/seed" target="_blank" style={{ color: "#0066cc", fontSize: "14px" }}>Seed demo products →</Link>
                    </div>
                ) : (
                    <>
                        {/* Featured hero + 2 side cards */}
                        {featured && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "16px" }}>
                                <FeaturedCard product={featured} />
                                <div className="bestselling-product-el"><ProductCard product={rest[0]} /></div>
                                <div className="bestselling-product-el"><ProductCard product={rest[1]} /></div>
                            </div>
                        )}

                        {/* Remaining grid */}
                        {rest.length > 2 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                                {rest.slice(2).map((p) => (
                                    <div key={p.id} className="bestselling-product-el"><ProductCard product={p} /></div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

export default BestSelling