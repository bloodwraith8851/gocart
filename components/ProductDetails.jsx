'use client'
import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, ShieldCheckIcon, TruckIcon, RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

const ProductDetails = ({ product }) => {
    const productId = product.id;
    const cart      = useSelector((state) => state.cart.cartItems);
    const dispatch  = useDispatch();
    const router    = useRouter();

    const [mainImage, setMainImage] = useState(product.images[0]);

    const avgRating = product.rating?.length > 0
        ? product.rating.reduce((a, r) => a + r.rating, 0) / product.rating.length
        : 0;

    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : null;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", padding: "32px 0" }}>
            {/* ── IMAGE GALLERY ── */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {/* Thumbnails */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {product.images.map((img, i) => (
                        <button key={i} onClick={() => setMainImage(img)} style={{
                            width: "60px", height: "60px",
                            backgroundColor: "#f5f5f7", borderRadius: "8px",
                            border: `2px solid ${mainImage === img ? "#0071e3" : "transparent"}`,
                            padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "border-color 0.15s",
                        }}>
                            <Image src={img} alt="" width={48} height={48} style={{ maxHeight: "48px", width: "auto", objectFit: "contain" }} />
                        </button>
                    ))}
                </div>

                {/* Main image */}
                <div style={{
                    backgroundColor: "#f5f5f7", borderRadius: "12px",
                    width: "clamp(260px,38vw,420px)", height: "clamp(260px,38vw,420px)",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
                }}>
                    <Image src={mainImage} alt={product.name} width={360} height={360}
                        style={{ objectFit: "contain", width: "100%", height: "100%", transition: "opacity 0.2s" }} />
                </div>
            </div>

            {/* ── PRODUCT INFO ── */}
            <div style={{ flex: 1, minWidth: "260px" }}>
                {/* Category */}
                <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    {product.category}
                </p>

                {/* Name */}
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 700, color: "#1d1d1f", lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: "12px" }}>
                    {product.name}
                </h1>

                {/* Rating */}
                {avgRating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <div style={{ display: "flex", gap: "2px" }}>
                            {Array(5).fill("").map((_, i) => (
                                <StarIcon key={i} size={14} style={{ fill: avgRating >= i + 1 ? "#0071e3" : "#d1d5db", color: "transparent" }} />
                            ))}
                        </div>
                        <span style={{ fontSize: "13px", color: "#0066cc" }}>
                            {product.rating.length} {product.rating.length === 1 ? "review" : "reviews"}
                        </span>
                    </div>
                )}

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "28px", fontWeight: 700, color: "#1d1d1f" }}>
                        {currency}{product.price}
                    </span>
                    {product.mrp > product.price && (
                        <span style={{ fontSize: "17px", color: "rgba(0,0,0,0.4)", textDecoration: "line-through" }}>
                            {currency}{product.mrp}
                        </span>
                    )}
                    {discount && (
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#0071e3", backgroundColor: "rgba(0,113,227,0.08)", padding: "2px 10px", borderRadius: "980px" }}>
                            Save {discount}%
                        </span>
                    )}
                </div>

                {/* Stock */}
                {!product.inStock && (
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#ff3b30", backgroundColor: "rgba(255,59,48,0.08)", padding: "4px 12px", borderRadius: "980px", display: "inline-block", marginBottom: "16px" }}>
                        Out of stock
                    </span>
                )}

                {/* CTA */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
                    {cart[productId] && (
                        <div>
                            <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", marginBottom: "4px" }}>Quantity</p>
                            <Counter productId={productId} />
                        </div>
                    )}
                    <button
                        disabled={!product.inStock}
                        onClick={() => !cart[productId] ? dispatch(addToCart({ productId })) : router.push('/cart')}
                        style={{
                            backgroundColor: product.inStock ? "#0071e3" : "rgba(0,0,0,0.12)",
                            color: product.inStock ? "#fff" : "rgba(0,0,0,0.3)",
                            border: "none", borderRadius: "980px",
                            padding: "13px 32px", fontSize: "17px", fontWeight: 500,
                            cursor: product.inStock ? "pointer" : "not-allowed",
                            transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => { if (product.inStock) e.currentTarget.style.backgroundColor = "#0077ed"; }}
                        onMouseLeave={(e) => { if (product.inStock) e.currentTarget.style.backgroundColor = "#0071e3"; }}
                    >
                        {!product.inStock ? "Unavailable" : !cart[productId] ? "Add to Cart" : "View Cart →"}
                    </button>
                </div>

                <hr style={{ borderColor: "rgba(0,0,0,0.08)", margin: "28px 0" }} />

                {/* Trust badges */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                        { Icon: TruckIcon,       text: "Free shipping worldwide" },
                        { Icon: ShieldCheckIcon, text: "100% secured payment" },
                        { Icon: RotateCcwIcon,   text: "7-day easy returns" },
                    ].map(({ Icon, text }) => (
                        <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Icon size={15} style={{ color: "#0071e3", flexShrink: 0 }} />
                            <span style={{ fontSize: "14px", color: "rgba(0,0,0,0.56)" }}>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;