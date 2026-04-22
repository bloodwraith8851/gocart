'use client'
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"
import { useEffect, useRef, useLayoutEffect } from "react"
import { ShieldCheckIcon, StarIcon, ZapIcon } from "lucide-react"
import { gsap } from "@/lib/gsap"

const STATS = [
    { label: "Products",    value: "10K+" },
    { label: "Sellers",     value: "500+" },
    { label: "Happy Users", value: "50K+" },
    { label: "Countries",   value: "120+" },
]

const TRUST = [
    { Icon: ZapIcon,         text: "Fast Delivery"     },
    { Icon: ShieldCheckIcon, text: "Secure Checkout"   },
    { Icon: StarIcon,        text: "Top Rated Sellers" },
]

export default function Hero() {
    const heroRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
            
            // Text Animations
            tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
              .from('.hero-headline-word', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, rotationX: -20, transformOrigin: "0% 50% -50" }, "-=0.2")
              .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
              .from('.hero-btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
              .from('.hero-trust', { opacity: 0, x: -10, duration: 0.5, stagger: 0.1 }, "-=0.3")
              .from('.hero-stat', { opacity: 0, y: 15, duration: 0.5, stagger: 0.1 }, "-=0.3")

            // Image & floating cards
            tl.fromTo('.hero-main-img', { scale: 0.8, opacity: 0, rotation: -5 }, { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(1.2)' }, 0.2)
              .from('.hero-floating-card', { y: 60, opacity: 0, duration: 0.8, stagger: 0.15, rotationY: 45, ease: 'back.out(1.5)' }, 0.5)

        }, heroRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={heroRef} style={{ backgroundColor: "#000", minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>

            {/* ── BACKGROUND EFFECTS ── */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {/* Blue glow */}
                <div style={{ position: "absolute", width: "900px", height: "900px", left: "-250px", top: "-300px", background: "radial-gradient(circle, rgba(0,113,227,0.16) 0%, transparent 60%)", animation: "glowOrb1 9s ease-in-out infinite alternate" }} />
                {/* Purple glow */}
                <div style={{ position: "absolute", width: "700px", height: "700px", right: "-150px", bottom: "-200px", background: "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 60%)", animation: "glowOrb2 11s ease-in-out infinite alternate" }} />
                {/* Cyan accent */}
                <div style={{ position: "absolute", width: "400px", height: "400px", right: "30%", top: "5%", background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 60%)", animation: "glowOrb1 7s ease-in-out infinite alternate 2s" }} />
                {/* Grid */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 100%)", maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 100%)" }} />
            </div>

            {/* ── CONTENT ── */}
            <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", perspective: "1000px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "48px", flexWrap: "wrap", perspective: "1000px" }}>

                    {/* LEFT — Text */}
                    <div style={{ flex: "1 1 380px", maxWidth: "540px" }}>

                        {/* Pill badge */}
                        <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(0,113,227,0.1)", border: "1px solid rgba(0,113,227,0.28)", borderRadius: "980px", padding: "6px 16px", marginBottom: "28px" }}>
                            <span style={{ width: "6px", height: "6px", backgroundColor: "#0071e3", borderRadius: "50%", animation: "dotPulse 2s ease infinite" }} />
                            <span style={{ fontSize: "11px", color: "#2997ff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>New Arrivals Every Day</span>
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "clamp(2.8rem,5.5vw,5rem)",
                            fontWeight: 900,
                            lineHeight: 0.98,
                            letterSpacing: "-2.5px",
                            marginBottom: "24px",
                        }}>
                            <div style={{ overflow: "hidden" }}><span className="hero-headline-word" style={{ color: "#fff", display: "inline-block" }}>Gadgets</span></div>
                            <div style={{ overflow: "hidden" }}><span className="hero-headline-word" style={{ background: "linear-gradient(135deg, #0071e3 0%, #2997ff 45%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block" }}>you'll love.</span></div>
                            <div style={{ overflow: "hidden" }}><span className="hero-headline-word" style={{ color: "rgba(255,255,255,0.38)", display: "inline-block" }}>Prices you'll trust.</span></div>
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-subtitle" style={{ fontSize: "18px", color: "rgba(255,255,255,0.52)", lineHeight: 1.65, maxWidth: "400px", marginBottom: "40px" }}>
                            The smartest multi-vendor marketplace — curated sellers, honest prices, blazing fast shipping to your door.
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}>
                            <Link href="/shop" className="hero-btn"
                                style={{ backgroundColor: "#0071e3", color: "#fff", textDecoration: "none", borderRadius: "980px", padding: "15px 34px", fontSize: "16px", fontWeight: 700, display: "inline-block", boxShadow: "0 0 40px rgba(0,113,227,0.45)", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(0,113,227,0.65)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,113,227,0.45)"; }}
                            >
                                🛍 Shop Now
                            </Link>
                            <Link href="/pricing" className="hero-btn"
                                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#fff", textDecoration: "none", borderRadius: "980px", padding: "15px 28px", fontSize: "16px", fontWeight: 500, border: "1px solid rgba(255,255,255,0.18)", transition: "background-color 0.18s, border-color 0.18s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.36)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                            >
                                Learn more ›
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "36px" }}>
                            {TRUST.map(({ Icon, text }) => (
                                <div key={text} className="hero-trust" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Icon size={13} style={{ color: "#0071e3" }} />
                                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats row */}
                        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                            {STATS.map((s) => (
                                <div key={s.label} className="hero-stat">
                                    <p style={{ fontSize: "24px", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.5px" }}>{s.value}</p>
                                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Hero image with badges */}
                    <div style={{ flex: "0 0 auto", position: "relative", display: "flex", justifyContent: "center" }}>

                        {/* Background glow disc */}
                        <div className="hero-main-img" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "380px", height: "380px", background: "radial-gradient(circle, rgba(0,113,227,0.28) 0%, rgba(139,92,246,0.12) 50%, transparent 75%)", borderRadius: "50%", filter: "blur(32px)", animation: "heroGlow 6s ease-in-out infinite" }} />

                        {/* Main image */}
                        <div className="hero-main-img" style={{ position: "relative", width: "280px", animation: "heroFloat 6s ease-in-out infinite 1s" }}>
                            <Image src={assets.hero_model_img} alt="GoCart hero" width={300} height={420}
                                priority
                                style={{ objectFit: "contain", width: "100%", height: "auto", filter: "drop-shadow(0 24px 56px rgba(0,113,227,0.35))" }} />
                        </div>

                        {/* Floating card 1 — product */}
                        <div className="hero-floating-card" style={{
                            position: "absolute", top: "8%", left: "-60px",
                            backgroundColor: "rgba(18,18,20,0.8)", backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
                            padding: "14px 18px", minWidth: "160px",
                            animation: "card1Float 7s ease-in-out infinite",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                        }}>
                            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>🔥 Best Seller</p>
                            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "3px" }}>Sony WH-1000XM5</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "15px", color: "#2997ff", fontWeight: 800 }}>$279</span>
                                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", textDecoration: "line-through" }}>$399</span>
                            </div>
                            <div style={{ display: "flex", gap: "1px", marginTop: "5px" }}>
                                {Array(5).fill("").map((_, i) => (
                                    <StarIcon key={i} size={10} style={{ fill: "#0071e3", color: "transparent" }} />
                                ))}
                            </div>
                        </div>

                        {/* Floating badge 2 — save% */}
                        <div className="hero-floating-card" style={{
                            position: "absolute", bottom: "25%", right: "-40px",
                            background: "linear-gradient(135deg, #0071e3, #a78bfa)",
                            borderRadius: "14px", padding: "12px 18px", textAlign: "center",
                            animation: "card2Float 5s ease-in-out infinite 1.2s",
                            boxShadow: "0 8px 32px rgba(0,113,227,0.5)",
                        }}>
                            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Today's deal</p>
                            <p style={{ fontSize: "28px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>30%</p>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>OFF</p>
                        </div>

                        {/* Floating badge 3 — free shipping */}
                        <div className="hero-floating-card" style={{
                            position: "absolute", bottom: "8%", left: "-30px",
                            backgroundColor: "rgba(52,199,89,0.15)",
                            border: "1px solid rgba(52,199,89,0.35)",
                            borderRadius: "12px", padding: "10px 16px",
                            animation: "card1Float 8s ease-in-out infinite 2s",
                        }}>
                            <p style={{ fontSize: "13px", fontWeight: 700, color: "#34c759" }}>🚚 Free Shipping</p>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>On all orders today</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ANIMATIONS ── */}
            <style>{`
                @keyframes heroFloat {
                    0%,100% { transform: translateY(0px); }
                    50%     { transform: translateY(-18px); }
                }
                @keyframes heroGlow {
                    0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
                    50%     { transform: translate(-50%,-50%) scale(1.15); opacity: 0.7; }
                }
                @keyframes card1Float {
                    0%,100% { transform: translateY(0px) rotate(-1deg); }
                    50%     { transform: translateY(-10px) rotate(1deg); }
                }
                @keyframes card2Float {
                    0%,100% { transform: translateY(0px) rotate(2deg); }
                    50%     { transform: translateY(-12px) rotate(-1deg); }
                }
                @keyframes glowOrb1 {
                    0%   { transform: translate(0,0) scale(1); }
                    100% { transform: translate(100px,80px) scale(1.3); }
                }
                @keyframes glowOrb2 {
                    0%   { transform: translate(0,0) scale(1); }
                    100% { transform: translate(-80px,-60px) scale(1.2); }
                }
                @keyframes dotPulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:0.4; transform:scale(0.7); }
                }
            `}</style>
        </section>
    )
}