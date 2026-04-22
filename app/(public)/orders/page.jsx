'use client'
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBagIcon, ChevronDown, ChevronUp, Package, Truck, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { gsap } from "@/lib/gsap"
import { staggerCards } from "@/hooks/useScrollAnimation"

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

// Status definitions and timeline order
const STATUS_STAGES = [
    { key: "ORDER_PLACED", label: "Order Placed", icon: ShoppingBagIcon },
    { key: "PROCESSING",   label: "Processing",   icon: Package },
    { key: "SHIPPED",      label: "Shipped",      icon: Truck },
    { key: "DELIVERED",    label: "Delivered",    icon: CheckCircle2 },
]

function determineProgress(status) {
    const idx = STATUS_STAGES.findIndex(s => s.key === status)
    return idx === -1 ? 0 : idx
}

export default function OrdersPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("ALL") // ALL | ACTIVE | DELIVERED
    
    // Track expanded orders (array of order IDs)
    const [expandedOrders, setExpandedOrders] = useState([])

    const listRef = useRef(null)

    useEffect(() => {
        if (isLoaded && !user) router.push('/sign-in')
        if (!user) return
        
        fetch('/api/order')
            .then(res => res.json())
            .then(data => {
                setOrders(data.orders || [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [user, isLoaded, router])

    const filteredOrders = orders.filter(o => {
        if (activeTab === "ACTIVE") return o.status !== "DELIVERED" && o.status !== "CANCELLED"
        if (activeTab === "DELIVERED") return o.status === "DELIVERED"
        return true
    })

    // GSAP Reveal when tab changes
    useLayoutEffect(() => {
        if (!loading && listRef.current) {
            const ctx = gsap.context(() => staggerCards('.order-card', { y: 20, duration: 0.4 }), listRef)
            return () => ctx.revert()
        }
    }, [activeTab, loading, filteredOrders.length])

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => {
            const isExpanded = prev.includes(orderId)
            
            // GSAP Height Animation
            const el = document.getElementById(`order-details-${orderId}`)
            if (el) {
                if (!isExpanded) {
                    gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" })
                } else {
                    gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" })
                }
            }
            
            if (isExpanded) return prev.filter(id => id !== orderId)
            return [...prev, orderId]
        })
    }

    if (loading) {
        return (
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="skeleton" style={{ height: "40px", width: "200px" }} />
                <div className="skeleton" style={{ height: "160px", width: "100%", borderRadius: "16px" }} />
                <div className="skeleton" style={{ height: "160px", width: "100%", borderRadius: "16px" }} />
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "#f5f5f7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                    <Package size={40} color="rgba(0,0,0,0.2)" />
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>No orders yet</h1>
                <p style={{ color: "rgba(0,0,0,0.5)", marginBottom: "32px" }}>Looks like you haven't made your first purchase.</p>
                <Link href="/shop" className="btn-primary">Start Shopping</Link>
            </div>
        )
    }

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#f5f5f7", paddingBottom: "80px" }}>
            <div style={{ backgroundColor: "#000", color: "#fff", padding: "48px 20px 60px", marginBottom: "-40px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <h1 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "32px" }}>Your Orders.</h1>
                    
                    {/* TABS */}
                    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }} className="no-scrollbar">
                        {["ALL", "ACTIVE", "DELIVERED"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "8px 20px", borderRadius: "980px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s",
                                    backgroundColor: activeTab === tab ? "#fff" : "rgba(255,255,255,0.1)",
                                    color: activeTab === tab ? "#000" : "#fff"
                                }}
                            >
                                {tab === "ALL" ? "All Orders" : tab === "ACTIVE" ? "In Progress" : "Completed"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }} ref={listRef}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {filteredOrders.length === 0 && (
                        <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#fff", borderRadius: "16px", marginTop: "20px" }}>
                            <p style={{ color: "rgba(0,0,0,0.5)" }}>No orders found in this category.</p>
                        </div>
                    )}

                    {filteredOrders.map(order => {
                        const isExpanded = expandedOrders.includes(order.id)
                        const currentStageIdx = determineProgress(order.status)
                        
                        return (
                            <div key={order.id} className="order-card" style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                                
                                {/* CARD HEADER (Always visible) */}
                                <div onClick={() => toggleExpand(order.id)} style={{ padding: "24px", cursor: "pointer", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                                    
                                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                                        <div>
                                            <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Order Placed</p>
                                            <p style={{ fontSize: "15px", fontWeight: 500 }}>{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Total</p>
                                            <p style={{ fontSize: "15px", fontWeight: 500 }}>{currency}{order.total.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Order #</p>
                                            <p style={{ fontSize: "15px", fontWeight: 500 }}>{order.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div className={order.status === 'PROCESSING' ? 'badge-pulse' : ''} style={{ 
                                            padding: "6px 14px", borderRadius: "980px", fontSize: "12px", fontWeight: 800, 
                                            backgroundColor: order.status === "DELIVERED" ? "rgba(52,199,89,0.1)" : order.status === "CANCELLED" ? "rgba(255,59,48,0.1)" : "rgba(0,113,227,0.1)",
                                            color: order.status === "DELIVERED" ? "#34c759" : order.status === "CANCELLED" ? "#ff3b30" : "#0071e3" 
                                        }}>
                                            {order.status}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#f5f5f7" }}>
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </div>
                                </div>

                                {/* CARD DETAILS (Expanded) */}
                                <div id={`order-details-${order.id}`} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
                                    <div style={{ padding: "0 24px 24px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "24px" }}>
                                        
                                        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                                            {/* TIMELINE */}
                                            {order.status !== "CANCELLED" && (
                                                <div style={{ display: "flex", position: "relative", justifyContent: "space-between", margin: "0 10px" }}>
                                                    <div style={{ position: "absolute", top: "14px", left: 0, right: 0, height: "2px", backgroundColor: "rgba(0,0,0,0.06)", zIndex: 0 }} />
                                                    <div style={{ position: "absolute", top: "14px", left: 0, height: "2px", backgroundColor: "#0071e3", width: `${(currentStageIdx / (STATUS_STAGES.length - 1)) * 100}%`, transition: "width 0.6s ease-in-out", zIndex: 1 }} />
                                                    
                                                    {STATUS_STAGES.map((stage, i) => {
                                                        const active = currentStageIdx >= i
                                                        const current = currentStageIdx === i
                                                        const Icon = stage.icon
                                                        return (
                                                            <div key={stage.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 2 }}>
                                                                <div style={{ 
                                                                    width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                                                    backgroundColor: active ? "#0071e3" : "#fff",
                                                                    border: `2px solid ${active ? "#0071e3" : "rgba(0,0,0,0.1)"}`,
                                                                    color: active ? "#fff" : "rgba(0,0,0,0.3)",
                                                                    boxShadow: current ? "0 0 0 4px rgba(0,113,227,0.2)" : "none",
                                                                    transition: "all 0.3s ease"
                                                                }}>
                                                                    <Icon size={14} />
                                                                </div>
                                                                <span style={{ fontSize: "11px", fontWeight: current ? 700 : 600, color: active ? "#1d1d1f" : "rgba(0,0,0,0.4)" }}>{stage.label}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}

                                            {/* ITEMS */}
                                            <div>
                                                <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Items</h4>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                    {order.items.map(item => (
                                                        <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                                            <div style={{ width: "64px", height: "64px", backgroundColor: "#f5f5f7", borderRadius: "8px", display: "flex", alignItems: "center", justifyItems: "center", padding: "8px" }}>
                                                                <Image src={item.product.images[0]} alt={item.product.name} width={48} height={48} style={{ objectFit: "contain" }} />
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <p style={{ fontSize: "15px", fontWeight: 600 }}>{item.product.name}</p>
                                                                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)" }}>Qty: {item.quantity} × {currency}{item.price.toFixed(2)}</p>
                                                            </div>
                                                            <div style={{ fontSize: "15px", fontWeight: 700 }}>
                                                                {currency}{(item.price * item.quantity).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ACTIONS */}
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "20px" }}>
                                                {order.status === "DELIVERED" && <button className="btn-ghost" style={{ borderColor: "rgba(0,0,0,0.2)", color: "#1d1d1f", fontSize: "13px", padding: "8px 16px" }}>Rate Order</button>}
                                                <button className="btn-ghost" style={{ backgroundColor: "#000", color: "#fff", borderColor: "#000", fontSize: "13px", padding: "8px 16px" }}>Buy Again</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}