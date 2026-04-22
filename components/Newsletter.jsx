'use client'
import { useState, useRef, useLayoutEffect } from 'react'
import toast from 'react-hot-toast'
import { MailIcon, SparklesIcon } from 'lucide-react'
import { gsap } from '@/lib/gsap'

export default function Newsletter() {
    const [email,   setEmail]   = useState('')
    const [loading, setLoading] = useState(false)
    const [done,    setDone]    = useState(false)

    const sectionRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) return
        setLoading(true)
        await new Promise((r) => setTimeout(r, 800)) // simulate API
        setDone(true)
        setLoading(false)
        toast.success("You're in! Check your inbox for a welcome gift 🎁")
    }

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })

            tl.from('.news-eyebrow', { y: 20, opacity: 0, duration: 0.5, ease: "power3.out" })
              .from('.news-headline', { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
              .from('.news-desc', { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
              .from('.news-form', { y: 20, opacity: 0, scale: 0.95, duration: 0.6, ease: "back.out(1.5)" }, "-=0.4")
              .from('.news-proof', { opacity: 0, duration: 0.8 }, "-=0.2")

            // Subtle parallax on background orbs based on scrub
            gsap.to('.news-orb-1', {
                y: -100,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            })
            gsap.to('.news-orb-2', {
                y: 100,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5
                }
            })

        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} style={{ position: "relative", overflow: "hidden", backgroundColor: "#1d1d1f" }}>
            {/* Background glow orbs */}
            <div className="news-orb-1" style={{ position: "absolute", top: "-10px", left: "20%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 65%)", pointerEvents: "none", borderRadius: "50%" }} />
            <div className="news-orb-2" style={{ position: "absolute", bottom: "-150px", right: "15%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)", pointerEvents: "none", borderRadius: "50%" }} />

            <div style={{ maxWidth: "640px", margin: "0 auto", padding: "120px 20px", textAlign: "center", position: "relative" }}>
                {/* Eyebrow */}
                <div className="news-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "7px", backgroundColor: "rgba(0,113,227,0.1)", border: "1px solid rgba(0,113,227,0.22)", borderRadius: "980px", padding: "6px 16px", marginBottom: "24px" }}>
                    <SparklesIcon size={12} style={{ color: "#2997ff" }} />
                    <span style={{ fontSize: "11px", color: "#2997ff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Free to Join</span>
                </div>

                {/* Headline */}
                <h2 className="news-headline" style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-1px", marginBottom: "16px" }}>
                    Stay ahead of the deals.
                </h2>
                <p className="news-desc" style={{ fontSize: "17px", color: "rgba(255,255,255,0.48)", lineHeight: 1.6, maxWidth: "440px", margin: "0 auto 40px" }}>
                    Get exclusive offers, early access to new arrivals, and member-only discounts — straight to your inbox.
                </p>

                {/* Form */}
                <div className="news-form">
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
                </div>

                {/* Social proof */}
                <p className="news-proof" style={{ fontSize: "12px", color: "rgba(255,255,255,0.24)", marginTop: "20px" }}>
                    Join 50,000+ shoppers · No spam · Unsubscribe anytime
                </p>
            </div>
        </section>
    )
}