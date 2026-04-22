'use client'
import { useState, useEffect, useRef } from 'react'
import { TicketPercent, Copy, CheckCircle2, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { gsap } from '@/lib/gsap'

function Countdown({ expiresAt }) {
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = new Date(expiresAt).getTime() - now

            if (distance < 0) {
                clearInterval(interval)
                setTimeLeft('EXPIRED')
                return
            }

            const d = Math.floor(distance / (1000 * 60 * 60 * 24))
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const s = Math.floor((distance % (1000 * 60)) / 1000)

            setTimeLeft(`${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`)
        }, 1000)
        return () => clearInterval(interval)
    }, [expiresAt])

    return <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 700 }}>{timeLeft}</span>
}

export default function DealsPage() {
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(null)
    const gridRef = useRef(null)

    useEffect(() => {
        fetch('/api/deals')
            .then(res => res.json())
            .then(data => {
                setCoupons(data.coupons || [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if (!loading && coupons.length > 0 && gridRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.coupon-card', 
                    { rotationY: 90, opacity: 0, scale: 0.9, transformPerspective: 800 },
                    { rotationY: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)' }
                )
            }, gridRef)
            return () => ctx.revert()
        }
    }, [loading, coupons.length])

    const copyCode = (code) => {
        navigator.clipboard.writeText(code)
        setCopied(code)
        toast.success(`Coupon copied!`)
        setTimeout(() => setCopied(null), 3000)
    }

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#f5f5f7", padding: "48px 20px 80px" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                
                <div style={{ textAlign: "center", marginBottom: "64px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", backgroundColor: "rgba(0,113,227,0.1)", borderRadius: "20px", marginBottom: "24px" }}>
                        <TicketPercent size={32} color="#0071e3" />
                    </div>
                    <h1 style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-1px", color: "#1d1d1f", marginBottom: "16px" }}>
                        Exclusive Deals
                    </h1>
                    <p style={{ fontSize: "17px", color: "rgba(0,0,0,0.5)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.5 }}>
                        Discover our latest promotions and apply these codes at checkout for instant savings.
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                        {Array(6).fill(null).map((_, i) => <div key={i} className="skeleton" style={{ height: "200px", borderRadius: "20px" }} />)}
                    </div>
                ) : coupons.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <p style={{ fontSize: "17px", color: "rgba(0,0,0,0.5)" }}>No active deals at the moment. Check back soon!</p>
                    </div>
                ) : (
                    <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px", perspective: "1000px" }}>
                        {coupons.map(coupon => (
                            <div key={coupon.code} className="coupon-card" style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 12px 40px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                
                                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "6px", backgroundColor: "#0071e3" }} />
                                
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
                                    <div style={{ border: "2px dashed rgba(0,113,227,0.3)", backgroundColor: "rgba(0,113,227,0.05)", padding: "10px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "20px", fontWeight: 800, color: "#0071e3", letterSpacing: "1px" }}>{coupon.code}</span>
                                        <button onClick={() => copyCode(coupon.code)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: copied === coupon.code ? "#34c759" : "rgba(0,113,227,0.6)" }}>
                                            {copied === coupon.code ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#1d1d1f" }}>
                                        {coupon.discount}% <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(0,0,0,0.4)" }}>OFF</span>
                                    </div>
                                </div>

                                <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.6)", lineHeight: 1.5, marginBottom: "32px", flex: 1 }}>{coupon.description}</p>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(0,0,0,0.4)" }}>
                                    <Clock size={16} />
                                    <span style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ends in:</span>
                                    <Countdown expiresAt={coupon.expiresAt} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
