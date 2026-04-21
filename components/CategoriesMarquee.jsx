import Link from "next/link"

const CATEGORIES = [
    { label: "Headphones", emoji: "🎧" },
    { label: "Speakers",   emoji: "🔊" },
    { label: "Watches",    emoji: "⌚" },
    { label: "Earbuds",    emoji: "🎵" },
    { label: "Mouse",      emoji: "🖱️" },
    { label: "Camera",     emoji: "📷" },
    { label: "Keyboard",   emoji: "⌨️" },
    { label: "Monitor",    emoji: "🖥️" },
    { label: "Webcam",     emoji: "📹" },
    { label: "Gaming",     emoji: "🎮" },
    { label: "Laptop",     emoji: "💻" },
    { label: "Tablet",     emoji: "📱" },
]

const CategoriesMarquee = () => {
    const doubled = [...CATEGORIES, ...CATEGORIES]

    return (
        <section style={{ backgroundColor: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "28px 0", overflow: "hidden", position: "relative" }}>
            {/* Edge fades */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(90deg, #000 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(270deg, #000 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

            <div style={{ display: "flex", overflow: "hidden" }}>
                <div className="animate-marquee" style={{ display: "flex", gap: "0", whiteSpace: "nowrap", willChange: "transform" }}>
                    {doubled.map((cat, i) => (
                        <Link
                            key={i}
                            href={`/shop?category=${cat.label}`}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "7px",
                                textDecoration: "none",
                                margin: "0 8px",
                                padding: "7px 18px",
                                backgroundColor: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "980px",
                                fontSize: "12px", fontWeight: 600,
                                color: "rgba(255,255,255,0.6)",
                                letterSpacing: "0.04em",
                                transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(0,113,227,0.12)"
                                e.currentTarget.style.borderColor = "rgba(0,113,227,0.3)"
                                e.currentTarget.style.color = "#2997ff"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                                e.currentTarget.style.color = "rgba(255,255,255,0.6)"
                            }}
                        >
                            <span style={{ fontSize: "14px" }}>{cat.emoji}</span>
                            {cat.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CategoriesMarquee