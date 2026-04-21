'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { StarIcon, PackageIcon, ShoppingCartIcon, TrendingUpIcon } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Image from "next/image"
import { format } from "date-fns"

const METRIC_CONFIGS = [
    { key: "earnings",  label: "Total Earnings",  Icon: TrendingUpIcon,   color: "#0071e3", bg: "rgba(0,113,227,0.14)"   },
    { key: "orders",    label: "Total Orders",    Icon: ShoppingCartIcon, color: "#5ac8fa", bg: "rgba(90,200,250,0.14)"  },
    { key: "products",  label: "Total Products",  Icon: PackageIcon,      color: "#34c759", bg: "rgba(52,199,89,0.14)"   },
    { key: "rating",    label: "Avg Rating",      Icon: StarIcon,         color: "#ff9500", bg: "rgba(255,149,0,0.14)"   },
]

function MetricCard({ label, value, Icon, color, bg, delay = 0 }) {
    const [v, setV] = useState(false)
    useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t) }, [delay])
    return (
        <div style={{
            backgroundColor: "#161618", borderRadius: "14px", padding: "22px 24px",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", flexDirection: "column", gap: "14px",
            opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.25s, border-color 0.25s`,
        }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                <div style={{ width: "38px", height: "38px", backgroundColor: bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={color} />
                </div>
            </div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "32px", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>{value}</p>
        </div>
    )
}

export default function StoreDashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const res  = await fetch("/api/store/dashboard")
                const json = await res.json()
                setData(json.dashboardData || null)
            } catch { setData(null) }
            finally { setLoading(false) }
        })()
    }, [])

    if (loading) return <Loading />

    const avgRating = data?.ratings?.length > 0
        ? (data.ratings.reduce((s, r) => s + r.rating, 0) / data.ratings.length).toFixed(1)
        : "N/A"

    const metricValues = {
        earnings: `${currency}${data?.totalEarnings ?? 0}`,
        orders:   data?.totalOrders   ?? 0,
        products: data?.totalProducts ?? 0,
        rating:   avgRating,
    }

    // Chart
    const chartMap = {}
    for (const o of data?.recentOrders || []) {
        const d = format(new Date(o.createdAt), "MMM d")
        chartMap[d] = (chartMap[d] || 0) + o.total
    }
    const chartData = Object.entries(chartMap).map(([date, revenue]) => ({ date, revenue: parseFloat(revenue.toFixed(2)) }))

    return (
        <div style={{ animation: "fadein 0.4s ease" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                    Store Dashboard
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>Your store performance at a glance</p>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                {METRIC_CONFIGS.map((m, i) => (
                    <MetricCard key={m.key} label={m.label} value={metricValues[m.key]} Icon={m.Icon} color={m.color} bg={m.bg} delay={i * 80} />
                ))}
            </div>

            {/* Chart + Reviews row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                {/* Chart */}
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Revenue Trend</h2>
                    {chartData.length === 0 ? (
                        <div style={{ height: "180px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <span style={{ fontSize: "32px" }}>📈</span>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>No orders yet — revenue will appear here</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="storeRevGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"   stopColor="#34c759" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#34c759" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "#1c1c1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "13px" }} />
                                <Area type="monotone" dataKey="revenue" stroke="#34c759" strokeWidth={2.5} fill="url(#storeRevGrad)" dot={false} activeDot={{ r: 5, fill: "#34c759", stroke: "#fff", strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Recent Reviews */}
                {data?.ratings?.length > 0 && (
                    <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Recent Reviews</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {data.ratings.slice(0, 5).map((item, i) => (
                                <div key={i} style={{
                                    display: "flex", gap: "12px", alignItems: "flex-start",
                                    padding: "16px 0",
                                    borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none",
                                }}>
                                    {item.user?.image && (
                                        <Image src={item.user.image} alt={item.user?.name} width={36} height={36}
                                            style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }} />
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{item.user?.name}</span>
                                            <div style={{ display: "flex", gap: "1px" }}>
                                                {Array(5).fill("").map((_, si) => (
                                                    <StarIcon key={si} size={11} style={{ fill: item.rating >= si + 1 ? "#0071e3" : "rgba(255,255,255,0.15)", color: "transparent" }} />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {item.product?.name}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.48)", lineHeight: 1.55, margin: 0 }}>{item.review}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`@keyframes fadein { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    )
}