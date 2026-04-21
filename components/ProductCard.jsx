'use client'
import { StarIcon, HeartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'

const ProductCard = ({ product, dark = false }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [hovered,   setHovered]   = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)
    const { toggle, isWishlisted }  = useWishlist()
    const wishlisted = isWishlisted(product.id)

    const avgRating = product.rating?.length > 0
        ? Math.round(product.rating.reduce((a, c) => a + c.rating, 0) / product.rating.length)
        : 0

    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : null

    // Dark vs light theme
    const imgBg     = dark ? "#1c1c1e" : "#f5f5f7"
    const cardText  = dark ? "#fff"    : "#1d1d1f"
    const subText   = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)"
    const strikeClr = dark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.36)"
    const learnClr  = dark ? "#2997ff" : "#0066cc"

    const isNew = (() => {
        if (!product.createdAt) return false
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return new Date(product.createdAt) > sevenDaysAgo
    })()

    return (
        <Link
            href={`/product/${product.id}`}
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", width: "100%", transition: "transform 0.22s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
            {/* Image container */}
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    backgroundColor: imgBg,
                    borderRadius: "14px",
                    aspectRatio: "1 / 1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden", padding: "16px",
                    outline: dark ? "1px solid rgba(255,255,255,0.06)" : "none",
                    boxShadow: hovered
                        ? dark
                            ? "0 8px 40px rgba(0,0,0,0.6)"
                            : "0 8px 40px rgba(0,0,0,0.14)"
                        : "none",
                    transition: "box-shadow 0.25s ease",
                }}
            >
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 600px) 50vw, 25vw"
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    style={{
                        objectFit: "contain", padding: "16px",
                        transform: hovered ? "scale(1.07)" : "scale(1)",
                        transition: "transform 0.35s ease, opacity 0.3s ease",
                        opacity: imgLoaded ? 1 : 0,
                    }}
                />

                {/* Discount badge — top left */}
                {discount && discount > 0 && (
                    <div style={{
                        position: "absolute", top: "10px", left: "10px",
                        backgroundColor: "#0071e3", color: "#fff",
                        fontSize: "11px", fontWeight: 800,
                        padding: "3px 10px", borderRadius: "980px",
                        letterSpacing: "-0.2px",
                    }}>
                        -{discount}%
                    </div>
                )}

                {/* NEW badge — top right */}
                {isNew && (
                    <div style={{
                        position: "absolute", top: "10px", right: "10px",
                        backgroundColor: "#34c759", color: "#fff",
                        fontSize: "10px", fontWeight: 800,
                        padding: "3px 9px", borderRadius: "980px",
                        letterSpacing: "0.04em", textTransform: "uppercase",
                    }}>
                        New
                    </div>
                )}

                {/* Out of stock overlay */}
                {!product.inStock && (
                    <div style={{
                        position: "absolute", inset: 0, borderRadius: "14px",
                        backgroundColor: "rgba(0,0,0,0.55)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, backgroundColor: "rgba(0,0,0,0.5)", padding: "5px 14px", borderRadius: "980px" }}>
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Heart — wishlist button */}
                <button
                    onClick={(e) => { e.preventDefault(); toggle(product); }}
                    style={{
                        position: "absolute", bottom: "10px", right: "10px",
                        width: "32px", height: "32px", borderRadius: "50%",
                        backgroundColor: wishlisted ? "rgba(255,59,48,0.15)" : "rgba(0,0,0,0.25)",
                        border: `1px solid ${wishlisted ? "rgba(255,59,48,0.4)" : "rgba(255,255,255,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", backdropFilter: "blur(8px)",
                        transition: "transform 0.2s, background-color 0.2s",
                        opacity: hovered || wishlisted ? 1 : 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon size={14} style={{
                        fill: wishlisted ? "#ff3b30" : "none",
                        color: wishlisted ? "#ff3b30" : "#fff",
                        transition: "fill 0.2s, color 0.2s",
                    }} />
                </button>
            </div>

            {/* Info */}
            <div style={{ paddingTop: "12px" }}>
                {/* Stars */}
                {avgRating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "5px" }}>
                        {Array(5).fill("").map((_, i) => (
                            <StarIcon key={i} size={11}
                                style={{ fill: avgRating > i ? "#0071e3" : (dark ? "rgba(255,255,255,0.16)" : "#e5e7eb"), color: "transparent" }} />
                        ))}
                        <span style={{ fontSize: "11px", color: subText, marginLeft: "3px" }}>
                            ({product.rating?.length})
                        </span>
                    </div>
                )}

                {/* Name */}
                <p style={{
                    fontSize: "14px", fontWeight: 500, color: cardText, lineHeight: 1.35,
                    marginBottom: "6px",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}>
                    {product.name}
                </p>

                {/* Prices */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: cardText }}>
                        {currency}{product.price}
                    </span>
                    {product.mrp > product.price && (
                        <span style={{ fontSize: "12px", color: strikeClr, textDecoration: "line-through" }}>
                            {currency}{product.mrp}
                        </span>
                    )}
                </div>

                <p style={{ fontSize: "12px", color: learnClr, fontWeight: 500 }}>Learn more ›</p>
            </div>
        </Link>
    )
}

export default ProductCard