'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PackageIcon, TruckIcon, CheckCircle2Icon, ClockIcon } from "lucide-react"

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

const STATUS_CONFIG = {
    ORDER_PLACED: { label: "Order Placed",  color: "#0071e3", bg: "rgba(0,113,227,0.10)",  Icon: ClockIcon           },
    PROCESSING:   { label: "Processing",    color: "#ff9500", bg: "rgba(255,149,0,0.10)",  Icon: PackageIcon         },
    SHIPPED:      { label: "Shipped",       color: "#5ac8fa", bg: "rgba(90,200,250,0.10)", Icon: TruckIcon           },
    DELIVERED:    { label: "Delivered",     color: "#34c759", bg: "rgba(52,199,89,0.10)",  Icon: CheckCircle2Icon    },
};

const STEPS = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.ORDER_PLACED;
    return (
        <span style={{ fontSize: "12px", fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: "4px 12px", borderRadius: "980px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <cfg.Icon size={11} /> {cfg.label}
        </span>
    );
}

function ProgressBar({ status }) {
    const idx = STEPS.indexOf(status);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "16px" }}>
            {STEPS.map((s, i) => {
                const done   = i <= idx;
                const cfg    = STATUS_CONFIG[s];
                return (
                    <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: done ? "#0071e3" : "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background-color 0.3s" }}>
                            <cfg.Icon size={12} style={{ color: done ? "#fff" : "rgba(0,0,0,0.3)" }} />
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ flex: 1, height: "2px", backgroundColor: i < idx ? "#0071e3" : "rgba(0,0,0,0.08)", margin: "0 2px", transition: "background-color 0.3s" }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function Orders() {
    const [orders,  setOrders]  = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res  = await fetch("/api/user/orders")
                const data = await res.json()
                setOrders(data.orders || [])
            } catch { setOrders([]) }
            finally { setLoading(false) }
        }
        fetch_()
        const interval = setInterval(fetch_, 30_000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 20px" }}>
                <div className="skeleton" style={{ height: "36px", width: "160px", borderRadius: "8px", marginBottom: "32px" }} />
                {Array(3).fill(null).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: "160px", borderRadius: "12px", marginBottom: "16px" }} />
                ))}
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <div style={{ width: "88px", height: "88px", backgroundColor: "#f5f5f7", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                    <PackageIcon size={40} style={{ color: "rgba(0,0,0,0.2)" }} />
                </div>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 700, color: "#1d1d1f" }}>No orders yet</h1>
                <p style={{ fontSize: "17px", color: "rgba(0,0,0,0.48)", maxWidth: "260px", marginTop: "8px", lineHeight: 1.5 }}>
                    Your orders will appear here once you make a purchase.
                </p>
                <Link href="/shop" style={{ marginTop: "28px", backgroundColor: "#0071e3", color: "#fff", textDecoration: "none", borderRadius: "980px", padding: "13px 32px", fontSize: "17px", fontWeight: 500, display: "inline-block" }}>
                    Shop Now
                </Link>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "80vh" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 20px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 700, color: "#1d1d1f", marginBottom: "8px" }}>
                    My Orders
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.48)", marginBottom: "32px" }}>
                    {orders.length} {orders.length === 1 ? "order" : "orders"} · auto-refreshes every 30s
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{ backgroundColor: "#f5f5f7", borderRadius: "12px", padding: "20px 22px" }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                                <div>
                                    <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        Order #{order.id.slice(-8).toUpperCase()}
                                    </p>
                                    <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.48)", marginTop: "2px" }}>
                                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: "17px", fontWeight: 700, color: "#1d1d1f" }}>{currency}{order.total.toFixed(2)}</p>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>

                            {/* Progress bar */}
                            <ProgressBar status={order.status} />

                            {/* Items */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                                {order.orderItems.map((item, i) => (
                                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                        <div style={{ width: "44px", height: "44px", backgroundColor: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: "4px" }}>
                                            <Image src={item.product.images[0]} alt={item.product.name} width={36} height={36} style={{ maxHeight: "36px", width: "auto", objectFit: "contain" }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1d1d1f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {item.product.name}
                                            </p>
                                            <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)" }}>Qty: {item.quantity} · {currency}{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Address */}
                            {order.address && (
                                <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.36)", marginTop: "12px" }}>
                                    📍 {order.address.name}, {order.address.city}, {order.address.state} {order.address.zip}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}