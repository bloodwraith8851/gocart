'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { PackageIcon, StoreIcon, TrendingUpIcon, ShoppingCartIcon } from "lucide-react"

const METRIC_CONFIGS = [
    { key: "revenue",  label: "Total Revenue",  Icon: TrendingUpIcon,   color: "#0071e3", gradient: "rgba(0,113,227,0.15)" },
    { key: "orders",   label: "Total Orders",   Icon: ShoppingCartIcon, color: "#5ac8fa", gradient: "rgba(90,200,250,0.15)" },
    { key: "products", label: "Total Products", Icon: PackageIcon,      color: "#34c759", gradient: "rgba(52,199,89,0.15)"  },
    { key: "stores",   label: "Total Stores",   Icon: StoreIcon,        color: "#ff9500", gradient: "rgba(255,149,0,0.15)"  },
]

function MetricCard({ label, value, Icon, color, gradient, delay = 0 }) {
    const [visible, setVisible] = useState(false)
    useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

    return (
        <div style={{
            backgroundColor: "#161618", borderRadius: "14px",
            padding: "22px 24px", border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", flexDirection: "column", gap: "14px",
            transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                <div style={{ width: "38px", height: "38px", backgroundColor: gradient, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={color} />
                </div>
            </div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "32px", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>{value}</p>
        </div>
    )
}

export default function AdminDashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const res  = await fetch("/api/admin")
                const json = await res.json()
                setData(json.dashboardData || null)
            } catch { setData(null) }
            finally { setLoading(false) }
        })()
    }, [])

    if (loading) return <Loading />

    // Build chart data
    const chartMap = {}
    for (const o of data?.allOrders || []) {
        const d = format(new Date(o.createdAt), "MMM d")
        chartMap[d] = (chartMap[d] || 0) + o.total
    }
    const chartData = Object.entries(chartMap).map(([date, revenue]) => ({ date, revenue: parseFloat(revenue.toFixed(2)) }))

    const metricValues = {
        revenue:  `${currency}${parseFloat(data?.revenue || 0).toFixed(2)}`,
        orders:   data?.orders   ?? 0,
        products: data?.products ?? 0,
        stores:   data?.stores   ?? 0,
    }

    return (
        <div style={{ animation: "fadein 0.4s ease" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                    Admin Dashboard
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>Platform-wide overview</p>
            </div>

            {/* Metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                {METRIC_CONFIGS.map((m, i) => (
                    <MetricCard key={m.key} label={m.label} value={metricValues[m.key]} Icon={m.Icon} color={m.color} gradient={m.gradient} delay={i * 80} />
                ))}
            </div>

            {/* Revenue chart */}
            <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div>
                        <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>Revenue Over Time</h2>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.36)" }}>
                            {chartData.length > 0 ? `${chartData.length} days tracked` : "No order data yet"}
                        </p>
                    </div>
                    <div style={{ backgroundColor: "rgba(0,113,227,0.12)", border: "1px solid rgba(0,113,227,0.2)", borderRadius: "8px", padding: "6px 12px" }}>
                        <span style={{ fontSize: "12px", color: "#2997ff", fontWeight: 600 }}>Last 30 days</span>
                    </div>
                </div>

                {chartData.length === 0 ? (
                    <div style={{ height: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span style={{ fontSize: "36px" }}>📊</span>
                        <p style={{ color: "rgba(255,255,255,0.32)", fontSize: "15px" }}>No orders yet — place some orders to see revenue data</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%"   stopColor="#0071e3" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#1c1c1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "13px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} cursor={{ stroke: "rgba(0,113,227,0.4)" }} />
                            <Area type="monotone" dataKey="revenue" stroke="#0071e3" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#0071e3", stroke: "#fff", strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            <style>{`@keyframes fadein { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    )
}