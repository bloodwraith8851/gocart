'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

export default function Cart() {
    const { cartItems } = useSelector((state) => state.cart);
    const products      = useSelector((state) => state.product.list);
    const dispatch      = useDispatch();

    const [cartArray,  setCartArray]  = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let total = 0;
        const arr = [];
        for (const [id, qty] of Object.entries(cartItems)) {
            const p = products.find((p) => p.id === id);
            if (p) { arr.push({ ...p, quantity: qty }); total += p.price * qty; }
        }
        setCartArray(arr);
        setTotalPrice(total);
    }, [cartItems, products]);

    // ── Empty state ──
    if (cartArray.length === 0) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px", backgroundColor: "#fff" }}>
                <div style={{ width: "88px", height: "88px", backgroundColor: "#f5f5f7", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                    <ShoppingBagIcon size={40} style={{ color: "rgba(0,0,0,0.2)" }} />
                </div>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 700, color: "#1d1d1f", marginBottom: "8px" }}>
                    Your cart is empty
                </h1>
                <p style={{ fontSize: "17px", color: "rgba(0,0,0,0.48)", maxWidth: "260px", lineHeight: 1.5 }}>
                    Browse our collection and add something you love.
                </p>
                <Link href="/shop" style={{
                    marginTop: "32px", backgroundColor: "#0071e3", color: "#fff",
                    textDecoration: "none", borderRadius: "980px",
                    padding: "13px 32px", fontSize: "17px", fontWeight: 500, display: "inline-block",
                }}>
                    Shop Now
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "80vh" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 20px" }}>
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 700, color: "#1d1d1f", lineHeight: 1.1 }}>
                        Shopping Cart
                    </h1>
                    <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.48)", marginTop: "4px" }}>
                        {cartArray.length} {cartArray.length === 1 ? "item" : "items"}
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "flex-start" }} className="lg:flex-row">
                    {/* Items */}
                    <div style={{ flex: 1, width: "100%" }}>
                        {cartArray.map((item, i) => (
                            <div key={item.id} style={{
                                display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
                                padding: "20px 0",
                                borderBottom: i < cartArray.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                            }}>
                                {/* Thumbnail */}
                                <div style={{ width: "80px", height: "80px", backgroundColor: "#f5f5f7", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: "8px" }}>
                                    <Image src={item.images[0]} alt={item.name} width={64} height={64} style={{ maxHeight: "64px", width: "auto", objectFit: "contain" }} />
                                </div>

                                {/* Name & category */}
                                <div style={{ flex: 1, minWidth: "120px" }}>
                                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d1d1f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item.name}
                                    </p>
                                    <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.48)", marginTop: "2px" }}>{item.category}</p>
                                    <p style={{ fontSize: "15px", fontWeight: 500, color: "#1d1d1f", marginTop: "6px" }}>{currency}{item.price}</p>
                                </div>

                                {/* Counter + total + delete */}
                                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                                    <Counter productId={item.id} />
                                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#1d1d1f", minWidth: "60px", textAlign: "right" }}>
                                        {currency}{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => dispatch(deleteItemFromCart({ productId: item.id }))}
                                        aria-label="Remove"
                                        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.3)", padding: "6px", borderRadius: "8px", display: "flex", transition: "color 0.15s" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = "#ff3b30"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,0,0,0.3)"; }}
                                    >
                                        <Trash2Icon size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order summary sidebar */}
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    );
}