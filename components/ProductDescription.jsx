'use client'
import { ArrowRight, StarIcon, PenLineIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const TABS = ['Description', 'Reviews']

const ProductDescription = ({ product, setRatingModal }) => {
    const [tab, setTab] = useState('Description')

    return (
        <div style={{ marginTop: "48px", marginBottom: "64px" }}>
            {/* Tab bar */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.1)", marginBottom: "32px" }}>
                {TABS.map((t) => {
                    const active = tab === t;
                    return (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "12px 20px", background: "none", border: "none",
                            borderBottom: `2px solid ${active ? "#1d1d1f" : "transparent"}`,
                            marginBottom: "-1px",
                            fontSize: "14px", fontWeight: active ? 700 : 400,
                            color: active ? "#1d1d1f" : "rgba(0,0,0,0.48)",
                            cursor: "pointer", transition: "color 0.15s",
                            display: "flex", alignItems: "center", gap: "6px",
                        }}>
                            {t}
                            {t === "Reviews" && product.rating?.length > 0 && (
                                <span style={{ backgroundColor: "#0071e3", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "980px" }}>
                                    {product.rating.length}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Description tab */}
            {tab === "Description" && (
                <p style={{ fontSize: "17px", color: "rgba(0,0,0,0.64)", maxWidth: "620px", lineHeight: 1.75 }}>
                    {product.description}
                </p>
            )}

            {/* Reviews tab */}
            {tab === "Reviews" && (
                <div style={{ maxWidth: "620px" }}>
                    {/* Write a review */}
                    {setRatingModal && (
                        <button
                            onClick={() => setRatingModal({ productId: product.id })}
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px", backgroundColor: "#f5f5f7", border: "none", borderRadius: "980px", padding: "9px 18px", fontSize: "14px", fontWeight: 500, color: "#1d1d1f", cursor: "pointer" }}
                        >
                            <PenLineIcon size={14} style={{ color: "#0071e3" }} />
                            Write a Review
                        </button>
                    )}
                    {!product.rating?.length ? (
                        <p style={{ fontSize: "17px", color: "rgba(0,0,0,0.4)" }}>
                            No reviews yet. Be the first to review this product!
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {product.rating.map((item, i) => (
                                <div key={i} style={{
                                    display: "flex", gap: "14px",
                                    padding: "24px 0",
                                    borderBottom: i < product.rating.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                                }}>
                                    {item.user?.image && (
                                        <Image src={item.user.image} alt={item.user.name} width={40} height={40}
                                            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1d1d1f" }}>{item.user?.name}</span>
                                            <div style={{ display: "flex", gap: "2px" }}>
                                                {Array(5).fill("").map((_, si) => (
                                                    <StarIcon key={si} size={12} style={{ fill: item.rating >= si + 1 ? "#0071e3" : "#d1d5db", color: "transparent" }} />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.32)" }}>
                                                {new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.64)", lineHeight: 1.65 }}>
                                            {item.review}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Store card */}
            {product.store && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "14px", marginTop: "48px",
                    backgroundColor: "#f5f5f7", borderRadius: "12px", padding: "18px 20px",
                    maxWidth: "440px",
                }}>
                    {product.store.logo && (
                        <Image src={product.store.logo} alt={product.store.name} width={44} height={44}
                            style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(0,0,0,0.08)" }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", marginBottom: "2px" }}>Sold by</p>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "#1d1d1f", overflow: "hidden", textOverflow: "ellipsis", white: "nowrap" }}>
                            {product.store.name}
                        </p>
                    </div>
                    <Link href={`/shop/${product.store.username}`} style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        color: "#0066cc", fontSize: "13px", textDecoration: "none",
                        border: "1px solid #0066cc", borderRadius: "980px", padding: "5px 12px",
                        flexShrink: 0,
                    }}>
                        Visit <ArrowRight size={12} />
                    </Link>
                </div>
            )}
        </div>
    )
}

export default ProductDescription