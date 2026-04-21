'use client'
import { useEffect, useState, useCallback } from "react"
import Loading from "@/components/Loading"
import Image from "next/image"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { PackageIcon } from "lucide-react"

const STATUS_OPTIONS = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"]
const STATUS_STYLES  = {
    ORDER_PLACED: { color: "#0071e3", bg: "rgba(0,113,227,0.1)",  border: "rgba(0,113,227,0.25)",  label: "Order Placed" },
    PROCESSING:   { color: "#ff9500", bg: "rgba(255,149,0,0.1)",  border: "rgba(255,149,0,0.25)",  label: "Processing"   },
    SHIPPED:      { color: "#5ac8fa", bg: "rgba(90,200,250,0.1)", border: "rgba(90,200,250,0.25)", label: "Shipped"      },
    DELIVERED:    { color: "#34c759", bg: "rgba(52,199,89,0.1)",  border: "rgba(52,199,89,0.25)",  label: "Delivered"    },
}

export default function StoreOrders() {
    const currency    = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const { getToken } = useAuth()
    const [orders,  setOrders]  = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = useCallback(async () => {
        try {
            const token   = await getToken()
            const { data } = await axios.get("/api/store/orders", { headers: { Authorization: `Bearer ${token}` } })
            setOrders(data.orders || [])
        } catch { toast.error("Failed to load orders") }
        finally { setLoading(false) }
    }, [getToken])

    const updateStatus = async (orderId, status) => {
        const token = await getToken()
        await axios.patch("/api/store/order-status", { orderId, status }, { headers: { Authorization: `Bearer ${token}` } })
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
    }

    useEffect(() => { fetchOrders() }, [fetchOrders])
    if (loading) return <Loading />

    return (
        <div style={{ animation: "fadein 0.4s ease", paddingBottom: "64px" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                    Orders
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>{orders.length} total orders</p>
            </div>

            {orders.length === 0 ? (
                <div style={{ backgroundColor: "#161618", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", height: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <PackageIcon size={36} style={{ color: "rgba(255,255,255,0.12)" }} />
                    <p style={{ color: "rgba(255,255,255,0.36)", fontSize: "15px" }}>No orders yet</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {orders.map((order) => {
                        const st = STATUS_STYLES[order.status] || STATUS_STYLES.ORDER_PLACED
                        return (
                            <div key={order.id} style={{ backgroundColor: "#161618", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)", padding: "20px 24px", transition: "border-color 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                            >
                                {/* Top row */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                                    <div>
                                        <p style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.36)", marginBottom: "3px" }}>#{order.id.slice(-10).toUpperCase()}</p>
                                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                                            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                            {order.user?.name && <span style={{ marginLeft: "8px" }}>· {order.user.name}</span>}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: st.color, backgroundColor: st.bg, border: `1px solid ${st.border}`, padding: "4px 12px", borderRadius: "980px" }}>
                                            {st.label}
                                        </span>
                                        <span style={{ fontWeight: 800, color: "#fff", fontSize: "18px", letterSpacing: "-0.5px" }}>
                                            {currency}{order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                                    {order.orderItems.map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "44px", height: "44px", backgroundColor: "#272729", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                                                <Image src={item.product.images[0]} alt={item.product.name} width={36} height={36} style={{ objectFit: "contain", maxHeight: "36px", width: "auto" }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: "13px", color: "#fff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product.name}</p>
                                                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)" }}>Qty: {item.quantity} · {currency}{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Ship to */}
                                {order.address && (
                                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", marginBottom: "14px" }}>
                                        📍 Ship to: {order.address.name}, {order.address.city}, {order.address.state}
                                    </p>
                                )}

                                {/* Status selector */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Update:</span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => toast.promise(updateStatus(order.id, e.target.value), { loading: "Updating…", success: "Status updated!", error: "Failed" })}
                                        style={{ backgroundColor: "#272729", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 500, cursor: "pointer", outline: "none", fontFamily: "'Inter',sans-serif" }}
                                    >
                                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_STYLES[s].label}</option>)}
                                    </select>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}
