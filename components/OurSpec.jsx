'use client'
import { TruckIcon, ShieldCheckIcon, HeadsetIcon, RotateCcwIcon } from 'lucide-react'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/gsap'

const SPECS = [
    { Icon: TruckIcon,       title: "Free Worldwide Shipping",  description: "No minimum order. Fast, tracked delivery to 180+ countries — always on us.", gradient: "linear-gradient(135deg, #0071e3, #2997ff)" },
    { Icon: ShieldCheckIcon, title: "100% Secure Payments",     description: "Bank-level encryption on every transaction. Your data stays private, always.", gradient: "linear-gradient(135deg, #34c759, #30d158)" },
    { Icon: HeadsetIcon,     title: "24/7 Live Support",        description: "Real humans available around the clock to help with orders, returns, and more.", gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)" },
    { Icon: RotateCcwIcon,   title: "Easy 7-Day Returns",       description: "Changed your mind? Hassle-free returns within 7 days. No questions asked.", gradient: "linear-gradient(135deg, #f59e0b, #f97316)" },
]

const OurSpec = () => {
    const sectionRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })

            tl.fromTo('.spec-header', 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            )
            .fromTo('.spec-card',
                { y: 40, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.2)" },
                "-=0.4"
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} style={{ backgroundColor: "#1d1d1f", position: "relative", overflow: "hidden" }}>
            {/* Background accent */}
            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,113,227,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "96px 20px", position: "relative" }}>
                {/* Title */}
                <div className="spec-header" style={{ textAlign: "center", marginBottom: "64px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
                        Why Choose Us
                    </p>
                    <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.75rem)", fontWeight: 800, color: "#fff", lineHeight: 1.07, letterSpacing: "-0.5px" }}>
                        Built for your peace of mind.
                    </h2>
                    <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.48)", maxWidth: "400px", margin: "14px auto 0", lineHeight: 1.6 }}>
                        Top-tier service at every step — from browsing to delivery.
                    </p>
                </div>

                {/* Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                    {SPECS.map(({ Icon, title, description, gradient }) => (
                        <div
                            key={title}
                            className="spec-card"
                            style={{ backgroundColor: "#272729", borderRadius: "16px", padding: "28px 22px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px", border: "1px solid rgba(255,255,255,0.05)", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease", cursor: "default" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                            }}
                        >
                            <div style={{ width: "48px", height: "48px", background: gradient, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                                <Icon size={22} color="#fff" />
                            </div>
                            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                                {title}
                            </h3>
                            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OurSpec