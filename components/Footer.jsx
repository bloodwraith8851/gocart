import Link from "next/link"

const LINK_SECTIONS = [
    {
        title: "Shop",
        links: [
            { text: "Headphones",   path: "/shop?search=headphones" },
            { text: "Speakers",     path: "/shop?search=speakers" },
            { text: "Smartwatches", path: "/shop?search=watch" },
            { text: "Earbuds",      path: "/shop?search=earbuds" },
            { text: "All Products", path: "/shop" },
        ],
    },
    {
        title: "Company",
        links: [
            { text: "Home",          path: "/" },
            { text: "Pricing",       path: "/pricing" },
            { text: "Become a Seller", path: "/create-store" },
            { text: "Admin Panel",   path: "/admin" },
        ],
    },
    {
        title: "Support",
        links: [
            { text: "+1 212 456 7890",   path: "tel:+12124567890" },
            { text: "support@gocart.io", path: "mailto:support@gocart.io" },
            { text: "San Francisco, CA", path: "#" },
            { text: "Live Chat",         path: "#" },
        ],
    },
]

const SOCIALS = [
    { label: "Twitter",   href: "#", icon: "𝕏" },
    { label: "Instagram", href: "#", icon: "◉" },
    { label: "LinkedIn",  href: "#", icon: "in" },
    { label: "GitHub",    href: "#", icon: "⌥" },
]

const Footer = () => {
    return (
        <footer style={{ backgroundColor: "#111113", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "64px 20px" }}>

                {/* Top section */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "52px", paddingBottom: "52px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

                    {/* Brand column */}
                    <div style={{ maxWidth: "240px" }}>
                        <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "16px" }}>
                            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", letterSpacing: "-0.5px" }}>
                                GoCart<span style={{ color: "#0071e3" }}>.</span>
                            </span>
                        </Link>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, marginBottom: "24px" }}>
                            The modern multi-vendor marketplace for the latest gadgets — curated sellers, honest prices.
                        </p>

                        {/* Social icons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                            {SOCIALS.map((s) => (
                                <Link key={s.label} href={s.href} title={s.label}
                                    style={{
                                        width: "34px", height: "34px",
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "8px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)",
                                        textDecoration: "none",
                                        transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,113,227,0.15)"; e.currentTarget.style.borderColor = "rgba(0,113,227,0.3)"; e.currentTarget.style.color = "#2997ff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                                >
                                    {s.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "48px" }}>
                        {LINK_SECTIONS.map((section) => (
                            <div key={section.title}>
                                <h3 style={{ fontSize: "11px", color: "rgba(255,255,255,0.36)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "18px" }}>
                                    {section.title}
                                </h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "13px" }}>
                                    {section.links.map((link) => (
                                        <li key={link.text}>
                                            <Link href={link.path}
                                                style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ paddingTop: "28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
                        © 2025 GoCart Technologies, Inc. All rights reserved.
                    </p>
                    <div style={{ display: "flex", gap: "24px" }}>
                        {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((t) => (
                            <Link key={t} href="#"
                                style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.15s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
                            >
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer