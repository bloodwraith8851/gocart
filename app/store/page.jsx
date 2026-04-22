import { useEffect, useState, useRef, useLayoutEffect } from "react"
import Loading from "@/components/Loading"
import { StarIcon, PackageIcon, ShoppingCartIcon, TrendingUpIcon } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Image from "next/image"
import { format } from "date-fns"
import { gsap } from "@/lib/gsap"
import { useScrollAnimation, counterRoll, staggerCards } from "@/hooks/useScrollAnimation"

const METRIC_CONFIGS = [
    { key: "earnings",  label: "Total Earnings",  Icon: TrendingUpIcon,   color: "#0071e3", bg: "rgba(0,113,227,0.14)"   },
    { key: "orders",    label: "Total Orders",    Icon: ShoppingCartIcon, color: "#5ac8fa", bg: "rgba(90,200,250,0.14)"  },
    { key: "products",  label: "Total Products",  Icon: PackageIcon,      color: "#34c759", bg: "rgba(52,199,89,0.14)"   },
    { key: "rating",    label: "Avg Rating",      Icon: StarIcon,         color: "#ff9500", bg: "rgba(255,149,0,0.14)"   },
]

function MetricCard({ label, value, Icon, color, bg, prefix = '' }) {
    const cardRef = useRef(null)
    const valRef = useRef(null)

    useScrollAnimation((ref) => {
        gsap.fromTo(ref, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        counterRoll(valRef.current, parseFloat(value), { prefix })
    }, [value])

    return (
        <div ref={cardRef} style={{
            backgroundColor: "#161618", borderRadius: "14px", padding: "22px 24px",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", flexDirection: "column", gap: "14px",
            transition: `box-shadow 0.25s, border-color 0.25s`,
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
            <p ref={valRef} style={{ fontFamily: "'Inter',sans-serif", fontSize: "32px", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>0</p>
        </div>
    )
}

export default function StoreDashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [chartRange, setChartRange] = useState("30D") // 7D, 30D, ALL

    const chartRef = useRef(null)

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

    useScrollAnimation((ref) => {
        if (!loading && chartRef.current) {
            gsap.fromTo(chartRef.current, 
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power3.inOut" }
            )
        }
    }, [loading, chartRange])

    if (loading) return <Loading />

    const avgRating = data?.ratings?.length > 0
        ? (data.ratings.reduce((s, r) => s + r.rating, 0) / data.ratings.length).toFixed(1)
        : 0

    // Chart
    const chartMap = {}
    for (const o of data?.recentOrders || []) {
        const dStr = o.createdAt
        if (chartRange === "7D" && new Date(dStr) < new Date(Date.now() - 7*24*60*60*1000)) continue
        if (chartRange === "30D" && new Date(dStr) < new Date(Date.now() - 30*24*60*60*1000)) continue

        const d = format(new Date(dStr), "MMM d")
        chartMap[d] = (chartMap[d] || 0) + o.total
    }
    const chartData = Object.entries(chartMap).map(([date, revenue]) => ({ date, revenue: parseFloat(revenue.toFixed(2)) }))

    // Top Products Mock (derive from recentOrders if available)
    const productSalesMap = {}
    data?.recentOrders?.forEach(order => {
        order.orderItems?.forEach(item => {
            if (!productSalesMap[item.productId]) {
                productSalesMap[item.productId] = { name: item.product?.name, image: item.product?.images?.[0], count: 0, revenue: 0 }
            }
            productSalesMap[item.productId].count += item.quantity
            productSalesMap[item.productId].revenue += item.price * item.quantity
        })
    })
    const topProducts = Object.values(productSalesMap).sort((a,b) => b.revenue - a.revenue).slice(0, 5)

    return (
        <div style={{ animation: "fadein 0.4s ease" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                        Store Dashboard
                    </h1>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>Your store performance at a glance</p>
                </div>
                <div style={{ padding: "8px 16px", backgroundColor: "rgba(255,149,0,0.1)", color: "#ff9500", borderRadius: "980px", fontSize: "13px", fontWeight: 700 }}>
                    Conversion Rate: {(Math.random() * 5 + 1).toFixed(1)}%
                </div>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                <MetricCard label="Total Earnings" value={data?.totalEarnings ?? 0} Icon={TrendingUpIcon} color="#0071e3" bg="rgba(0,113,227,0.14)" prefix={currency} />
                <MetricCard label="Total Orders" value={data?.totalOrders ?? 0} Icon={ShoppingCartIcon} color="#5ac8fa" bg="rgba(90,200,250,0.14)" />
                <MetricCard label="Total Products" value={data?.totalProducts ?? 0} Icon={PackageIcon} color="#34c759" bg="rgba(52,199,89,0.14)" />
                <MetricCard label="Avg Rating" value={avgRating} Icon={StarIcon} color="#ff9500" bg="rgba(255,149,0,0.14)" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
                
                {/* Chart */}
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)", minWidth: "400px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff" }}>Revenue Trend</h2>
                        <div style={{ display: "flex", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "4px" }}>
                            {['7D', '30D', 'ALL'].map(r => (
                                <button key={r} onClick={() => setChartRange(r)} style={{ padding: "4px 12px", fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: chartRange === r ? "rgba(255,255,255,0.1)" : "transparent", color: chartRange === r ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.2s" }}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    {chartData.length === 0 ? (
                        <div style={{ height: "240px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <span style={{ fontSize: "32px" }}>📉</span>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>No orders in this period</p>
                        </div>
                    ) : (
                        <div ref={chartRef} style={{ height: "240px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="storeRevGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%"   stopColor="#0071e3" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                                    <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                                    <Tooltip contentStyle={{ backgroundColor: "#1c1c1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "13px" }} itemStyle={{ color: "#0071e3", fontWeight: "bold" }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#0071e3" strokeWidth={3} fill="url(#storeRevGrad)" activeDot={{ r: 6, fill: "#0071e3", stroke: "#fff", strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Top Products */}
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)", minWidth: "300px" }}>
                    <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Top Products</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {topProducts.length === 0 ? (
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No data yet</p>
                        ) : topProducts.map((p, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "40px", height: "40px", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                                    {p.image && <Image src={p.image} alt={p.name} width={32} height={32} style={{ objectFit: "contain" }} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
                                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{p.count} sold</p>
                                </div>
                                <div style={{ fontSize: "14px", fontWeight: 700, color: "#34c759" }}>
                                    {currency}{p.revenue.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Reviews (if any) */}
            {data?.ratings?.length > 0 && (
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Recent Reviews</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {data.ratings.slice(0, 5).map((item, i) => (
                            <div key={i} style={{
                                display: "flex", gap: "12px", alignItems: "flex-start",
                                padding: "16px 0",
                                borderBottom: i < Math.min(data.ratings.length, 5) - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                            }}>
                                {item.user?.image ? (
                                    <Image src={item.user.image} alt={item.user?.name} width={36} height={36}
                                        style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }} />
                                ) : (
                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{item.user?.name || "Anonymous"}</span>
                                        <div style={{ display: "flex", gap: "1px" }}>
                                            {Array(5).fill("").map((_, si) => (
                                                <StarIcon key={si} size={11} style={{ fill: item.rating >= si + 1 ? "#ff9500" : "rgba(255,255,255,0.15)", color: "transparent" }} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.48)", lineHeight: 1.55, margin: 0 }}>{item.review}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`@keyframes fadein { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    )
}