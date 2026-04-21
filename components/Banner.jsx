'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { X, Sparkles } from 'lucide-react'

// Rotating offer messages
const MESSAGES = [
    { text: "🎉 Get 20% OFF your first order!", code: "NEW20" },
    { text: "⚡ Free shipping on all orders today", code: null },
    { text: "🔥 Flash sale — up to 30% off electronics", code: "VIP30" },
]

export default function Banner() {
    const [isOpen,  setIsOpen]  = useState(true)
    const [msgIdx,  setMsgIdx]  = useState(0)
    const [fading,  setFading]  = useState(false)

    // Rotate messages every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setFading(true)
            setTimeout(() => {
                setMsgIdx((i) => (i + 1) % MESSAGES.length)
                setFading(false)
            }, 300)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const handleClaim = () => {
        const code = MESSAGES[msgIdx].code
        if (code) {
            navigator.clipboard?.writeText(code).catch(() => {})
            toast.success(`Code "${code}" copied to clipboard!`)
        }
        setIsOpen(false)
    }

    if (!isOpen) return null

    return (
        <div style={{
            background: "linear-gradient(90deg, #0a0a0a 0%, #0d1f3c 40%, #001d6c 60%, #0071e3 100%)",
            padding: "10px 20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "16px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Animated shimmer line */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
                animation: "bannerShimmer 3s linear infinite",
            }} />

            {/* Left icon */}
            <Sparkles size={14} style={{ color: "#60a5fa", flexShrink: 0 }} />

            {/* Rotating message */}
            <p style={{
                fontSize: "13px", fontWeight: 500, color: "#fff",
                textAlign: "center",
                transition: "opacity 0.3s ease",
                opacity: fading ? 0 : 1,
                margin: 0,
            }}>
                {MESSAGES[msgIdx].text}
            </p>

            {/* Claim button */}
            {MESSAGES[msgIdx].code && (
                <button onClick={handleClaim} style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "980px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "4px 14px",
                    cursor: "pointer",
                    flexShrink: 0,
                    backdropFilter: "blur(4px)",
                    transition: "background-color 0.15s",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"; }}
                >
                    Copy Code
                </button>
            )}

            {/* Dots indicator */}
            <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {MESSAGES.map((_, i) => (
                    <button key={i} onClick={() => setMsgIdx(i)} style={{
                        width: i === msgIdx ? "16px" : "5px",
                        height: "5px",
                        backgroundColor: i === msgIdx ? "#60a5fa" : "rgba(255,255,255,0.3)",
                        borderRadius: "3px",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.3s ease",
                    }} />
                ))}
            </div>

            {/* Close */}
            <button onClick={() => setIsOpen(false)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.5)", padding: "2px",
                display: "flex", alignItems: "center",
                position: "absolute", right: "16px",
                transition: "color 0.15s",
            }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                aria-label="Close"
            >
                <X size={13} />
            </button>

            <style>{`
                @keyframes bannerShimmer {
                    from { transform: translateX(-100%); }
                    to   { transform: translateX(200%); }
                }
            `}</style>
        </div>
    )
}