'use client'
import { useWishlist } from "@/contexts/WishlistContext"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { HeartIcon } from "lucide-react"

export default function WishlistPage() {
    const { wishlist } = useWishlist()

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fff" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 20px 80px" }}>

                {/* Header */}
                <div style={{ marginBottom: "36px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,59,48,0.06)", border: "1px solid rgba(255,59,48,0.18)", borderRadius: "980px", padding: "5px 14px", marginBottom: "18px" }}>
                        <HeartIcon size={12} style={{ fill: "#ff3b30", color: "#ff3b30" }} />
                        <span style={{ fontSize: "11px", color: "#ff3b30", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Wishlist</span>
                    </div>
                    <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: "8px" }}>
                        Saved Items
                    </h1>
                    <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.48)" }}>
                        {wishlist.length === 0 ? "No items saved yet." : `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`}
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        gap: "16px", padding: "80px 20px", textAlign: "center",
                        backgroundColor: "#f5f5f7", borderRadius: "20px",
                    }}>
                        <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(255,59,48,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <HeartIcon size={36} style={{ color: "rgba(255,59,48,0.4)" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: "20px", fontWeight: 700, color: "#1d1d1f", marginBottom: "6px" }}>
                                Your wishlist is empty
                            </p>
                            <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.44)", maxWidth: "300px" }}>
                                Tap the heart on any product to save it here for later.
                            </p>
                        </div>
                        <Link href="/shop" style={{
                            marginTop: "8px", backgroundColor: "#0071e3", color: "#fff",
                            textDecoration: "none", borderRadius: "980px", padding: "12px 28px",
                            fontSize: "15px", fontWeight: 600,
                        }}>
                            Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
