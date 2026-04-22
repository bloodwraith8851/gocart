'use client'
import { StarIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'
import { useScrollAnimation, fadeUp } from '@/hooks/useScrollAnimation'
import { gsap } from '@/lib/gsap'

const ProductCard = ({ product, dark = false, listView = false, staggerMode = false }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const [hovered, setHovered] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)
    const { toggle, isWishlisted } = useWishlist()
    const wishlisted = isWishlisted(product.id)

    const avgRating = product.rating?.length > 0
        ? Math.round(product.rating.reduce((a, c) => a + c.rating, 0) / product.rating.length)
        : 0

    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : null

    const isNew = (() => {
        if (!product.createdAt) return false
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return new Date(product.createdAt) > sevenDaysAgo
    })()

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!product.inStock) return toast.error('Product is out of stock')
        dispatch(addToCart({ productId: product.id }))
        toast.success('Added to Cart')
    }

    // GSAP Reveal Animation
    const elementRef = useRef(null)
    useScrollAnimation((ref) => {
        if (!staggerMode) {
            fadeUp(ref, { y: 20 })
        }
    }, [staggerMode])

    const imgBg = dark ? "#1c1c1e" : "#f5f5f7"
    const cardText = dark ? "#fff" : "#1d1d1f"
    const subText = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)"

    // ─── LIST VIEW ───
    if (listView) {
        return (
            <Link ref={elementRef} className="product-card-el" href={`/product/${product.id}`} style={{ textDecoration: "none", display: "flex", width: "100%", backgroundColor: dark ? "#161618" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: "16px", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: hovered ? (dark ? "0 8px 40px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.14)") : "none", transform: hovered ? "translateY(-4px)" : "none" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <div style={{ width: "200px", minWidth: "140px", backgroundColor: imgBg, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                    <Image src={product.images[0]} alt={product.name} fill sizes="200px" style={{ objectFit: "contain", padding: "16px", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s", transform: hovered ? "scale(1.05)" : "scale(1)" }} onLoad={() => setImgLoaded(true)} />
                    {discount && discount > 0 && <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#0071e3", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "980px" }}>-{discount}%</div>}
                    {!product.inStock && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, backgroundColor: "rgba(0,0,0,0.6)", padding: "4px 12px", borderRadius: "980px" }}>Out of Stock</span></div>}
                </div>
                <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {avgRating > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "6px" }}>
                            {Array(5).fill("").map((_, i) => <StarIcon key={i} size={13} style={{ fill: avgRating > i ? "#0071e3" : (dark ? "rgba(255,255,255,0.16)" : "#e5e7eb"), color: "transparent" }} />)}
                            <span style={{ fontSize: "12px", color: subText, marginLeft: "4px" }}>({product.rating?.length})</span>
                        </div>
                    )}
                    <h3 style={{ fontSize: "18px", fontWeight: 600, color: cardText, marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</h3>
                    <p style={{ fontSize: "14px", color: subText, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "20px", fontWeight: 700, color: cardText }}>{currency}{product.price}</span>
                            {product.mrp > product.price && <span style={{ fontSize: "14px", color: subText, textDecoration: "line-through" }}>{currency}{product.mrp}</span>}
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={(e) => { e.preventDefault(); toggle(product) }} style={{ width: "40px", height: "40px", borderRadius: "50%", background: wishlisted ? "rgba(255,59,48,0.1)" : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"), border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                                <HeartIcon size={18} style={{ fill: wishlisted ? "#ff3b30" : "none", color: wishlisted ? "#ff3b30" : (dark ? "#fff" : "#1d1d1f") }} />
                            </button>
                            <button onClick={handleAddToCart} disabled={!product.inStock} className="btn-primary" style={{ padding: "0 20px", borderRadius: "980px" }}>
                                <ShoppingCartIcon size={16} /> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    // ─── GRID VIEW ───
    return (
        <Link ref={elementRef} className="product-card-el" href={`/product/${product.id}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", width: "100%", transition: "transform 0.22s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; setHovered(true) }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; setHovered(false) }}>
            <div style={{ backgroundColor: imgBg, borderRadius: "14px", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "16px", outline: dark ? "1px solid rgba(255,255,255,0.06)" : "none", boxShadow: hovered ? (dark ? "0 8px 40px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.14)") : "none", transition: "box-shadow 0.25s ease" }}>
                <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 600px) 50vw, 25vw" loading="lazy" onLoad={() => setImgLoaded(true)} style={{ objectFit: "contain", padding: "16px", transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.35s ease, opacity 0.3s ease", opacity: imgLoaded ? 1 : 0 }} />
                
                {discount && discount > 0 && <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#0071e3", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "980px", letterSpacing: "-0.2px" }}>-{discount}%</div>}
                {isNew && <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "#34c759", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "3px 9px", borderRadius: "980px" }}>NEW</div>}
                
                {!product.inStock && (
                    <div style={{ position: "absolute", inset: 0, borderRadius: "14px", backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, backgroundColor: "rgba(0,0,0,0.5)", padding: "5px 14px", borderRadius: "980px" }}>Out of Stock</span>
                    </div>
                )}

                <button onClick={(e) => { e.preventDefault(); toggle(product) }} style={{ position: "absolute", top: "10px", right: isNew ? "auto" : "10px", left: isNew ? "10px" : "auto", display: isNew ? "none" : "flex", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: wishlisted ? "rgba(255,59,48,0.15)" : "rgba(0,0,0,0.25)", border: `1px solid ${wishlisted ? "rgba(255,59,48,0.4)" : "rgba(255,255,255,0.15)"}`, alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)", transition: "transform 0.2s, background-color 0.2s", opacity: hovered || wishlisted ? 1 : 0 }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    <HeartIcon size={14} style={{ fill: wishlisted ? "#ff3b30" : "none", color: wishlisted ? "#ff3b30" : "#fff", transition: "fill 0.2s, color 0.2s" }} />
                </button>

                {/* Quick Add To Cart */}
                <div style={{ position: "absolute", bottom: "10px", left: "10px", right: "10px", opacity: hovered && product.inStock ? 1 : 0, transform: hovered && product.inStock ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
                    <button onClick={handleAddToCart} className="btn-primary" style={{ width: "100%", padding: "10px", fontSize: "13px", height: "40px", backdropFilter: "blur(10px)", background: "rgba(0,113,227,0.9)" }}>
                        <ShoppingCartIcon size={14} /> Add to bag
                    </button>
                </div>
            </div>

            <div style={{ paddingTop: "12px" }}>
                {avgRating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "5px" }}>
                        {Array(5).fill("").map((_, i) => <StarIcon key={i} size={11} style={{ fill: avgRating > i ? "#0071e3" : (dark ? "rgba(255,255,255,0.16)" : "#e5e7eb"), color: "transparent" }} />)}
                        <span style={{ fontSize: "11px", color: subText, marginLeft: "3px" }}>({product.rating?.length})</span>
                    </div>
                )}
                <p style={{ fontSize: "14px", fontWeight: 500, color: cardText, lineHeight: 1.35, marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: cardText }}>{currency}{product.price}</span>
                    {product.mrp > product.price && <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.36)", textDecoration: "line-through" }}>{currency}{product.mrp}</span>}
                </div>
            </div>
        </Link>
    )
}

export default ProductCard