'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MailIcon, SparklesIcon } from 'lucide-react'

export default function Newsletter() {
    const [email,   setEmail]   = useState('')
    const [loading, setLoading] = useState(false)
    const [done,    setDone]    = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) return
        setLoading(true)
        await new Promise((r) => setTimeout(r, 800)) // simulate API
        setDone(true)
        setLoading(false)
        toast.success("You're in! Check your inbox for a welcome gift 🎁")
    }

    return (
        <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#1d1d1f" }}>
            {/* Background glow orbs */}
            <div style={{ position: "absolute", top: "-60px", left: "25%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,113,227,0.1) 0%, transparent 65%)", pointerEvents: "none", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: "-80px", right: "20%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)", pointerEvents: "none", borderRadius: "50%" }} />

            <div style={{ maxWidth: "640px", margin: "0 auto", padding: "96px 20px", textAlign: "center", position: "relative" }}>
                {/* Eyebrow */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", backgroundColor: "rgba(0,113,227,0.1)", border: "1px solid rgba(0,113,227,0.22)", borderRadius: "980px", padding: "6px 16px", marginBottom: "24px" }}>
                    <SparklesIcon size={12} style={{ color: "#2997ff" }} />
                    <span style={{ fontSize: "11px", color: "#2997ff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Free to Join</span>
                </div>

                {/* Headline */}
                <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.75rem)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.5px", marginBottom: "14px" }}>
                    Stay ahead of the deals.
                </h2>
                <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.48)", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 40px" }}>
                    Get exclusive offers, early access to new arrivals, and member-only discounts — straight to your inbox.
                </p>

                {/* Form */}
                {!done ? (
                    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", maxWidth: "460px", margin: "0 auto" }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <MailIcon size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                required
                                id="newsletter-email-input"
                                style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "13px 14px 13px 38px", fontSize: "14px", outline: "none", fontFamily: "'Inter',sans-serif", transition: "box-shadow 0.15s, border-color 0.15s" }}
                                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.25)"; e.currentTarget.style.borderColor = "#0071e3"; }}
                                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                            />
                        </div>
                        <button type="submit" disabled={loading}
                            style={{ backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "10px", padding: "13px 22px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", flexShrink: 0, opacity: loading ? 0.7 : 1, transition: "transform 0.15s, box-shadow 0.15s, background-color 0.15s", boxShadow: "0 0 24px rgba(0,113,227,0.3)" }}
                            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,113,227,0.55)"; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(0,113,227,0.3)"; }}
                        >
                            {loading ? "Joining…" : "Subscribe"}
                        </button>
                    </form>
                ) : (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(52,199,89,0.12)", border: "1px solid rgba(52,199,89,0.3)", borderRadius: "12px", padding: "14px 24px" }}>
                        <span style={{ fontSize: "20px" }}>🎉</span>
                        <p style={{ color: "#34c759", fontSize: "15px", fontWeight: 600 }}>You're subscribed! Check your inbox.</p>
                    </div>
                )}

                {/* Social proof */}
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.24)", marginTop: "20px" }}>
                    Join 50,000+ shoppers · No spam · Unsubscribe anytime
                </p>
            </div>
        </section>
    )
}