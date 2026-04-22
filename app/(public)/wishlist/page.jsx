'use client'
import { useState, useRef, useLayoutEffect } from "react"
import { useWishlist } from "@/contexts/WishlistContext"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { HeartIcon, LayoutGrid, List as ListIcon, ShoppingBag } from "lucide-react"
import { gsap } from "@/lib/gsap"
import { staggerCards } from "@/hooks/useScrollAnimation"

export default function WishlistPage() {
    const { wishlist } = useWishlist()
    const [listView, setListView] = useState(false)
    const gridRef = useRef(null)

    useLayoutEffect(() => {
        if (wishlist.length > 0 && gridRef.current) {
            const ctx = gsap.context(() => staggerCards('.product-card-el', gridRef))
            return () => ctx.revert()
        }
    }, [wishlist.length, listView])

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fff" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 20px 80px" }}>

                {/* Header */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", pb: "16px", borderBottom: wishlist.length > 0 ? "1px solid rgba(0,0,0,0.08)" : "none", paddingBottom: "24px" }}>
                    <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,59,48,0.06)", border: "1px solid rgba(255,59,48,0.18)", borderRadius: "980px", padding: "5px 14px", marginBottom: "18px" }}>
                            <HeartIcon size={12} style={{ fill: "#ff3b30", color: "#ff3b30" }} />
                            <span style={{ fontSize: "11px", color: "#ff3b30", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Wishlist</span>
                        </div>
                        <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "8px" }}>
                            Saved Items
                        </h1>
                        <p style={{ fontSize: "16px", color: "rgba(0,0,0,0.48)" }}>
                            {wishlist.length === 0 ? "No items saved yet." : `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`}
                        </p>
                    </div>

                    {wishlist.length > 0 && (
                        <div style={{ display: "flex", backgroundColor: "#f5f5f7", borderRadius: "8px", padding: "4px" }}>
                            <button onClick={() => setListView(false)} style={{ background: !listView ? "#fff" : "transparent", boxShadow: !listView ? "0 2px 8px rgba(0,0,0,0.08)" : "none", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}><LayoutGrid size={18} color={!listView ? "#1d1d1f" : "rgba(0,0,0,0.4)"} /></button>
                            <button onClick={() => setListView(true)} style={{ background: listView ? "#fff" : "transparent", boxShadow: listView ? "0 2px 8px rgba(0,0,0,0.08)" : "none", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}><ListIcon size={18} color={listView ? "#1d1d1f" : "rgba(0,0,0,0.4)"} /></button>
                        </div>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        gap: "16px", padding: "100px 20px", textAlign: "center",
                        backgroundColor: "#f5f5f7", borderRadius: "24px",
                    }}>
                        <div style={{ width: "96px", height: "96px", backgroundColor: "rgba(255,59,48,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                            <HeartIcon size={40} style={{ color: "rgba(255,59,48,0.5)" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: "24px", fontWeight: 800, color: "#1d1d1f", marginBottom: "8px" }}>
                                Your wishlist is empty
                            </p>
                            <p style={{ fontSize: "16px", color: "rgba(0,0,0,0.5)", maxWidth: "340px", lineHeight: 1.5 }}>
                                Start exploring our collections and tap the heart icon to save items for later.
                            </p>
                        </div>
                        <Link href="/shop" style={{
                            marginTop: "16px", backgroundColor: "#000", color: "#fff",
                            textDecoration: "none", borderRadius: "980px", padding: "14px 32px",
                            fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px"
                        }}>
                            <ShoppingBag size={16} /> Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: listView ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: listView ? "20px" : "32px" }}>
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} listView={listView} staggerMode />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
