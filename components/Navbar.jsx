'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { Search, ShoppingBag, X, PackageIcon } from "lucide-react";

const GLASS = {
    backgroundColor: "rgba(10,10,10,0.88)",
    backdropFilter: "saturate(200%) blur(24px)",
    WebkitBackdropFilter: "saturate(200%) blur(24px)",
};

const NAV_LINKS = [
    { label: "Home",    href: "/" },
    { label: "Shop",    href: "/shop" },
    { label: "Sell",    href: "/create-store" },
    { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
    const { user }      = useUser();
    const { openSignIn } = useClerk();
    const router         = useRouter();

    const [search,     setSearch]     = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const cartCount = useSelector((s) => s.cart.total ?? 0);

    // close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
        setSearchOpen(false);
        setSearch("");
    };

    return (
        <>
            {/* ── MAIN NAV (sticky) ── */}
            <nav
                style={{
                    ...GLASS,
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    height: "52px",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
            >
                <div style={{
                    maxWidth: "1100px", margin: "0 auto", width: "100%",
                    padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    {/* Logo */}
                    <Link href="/" style={{ fontWeight: 800, color: "#fff", fontSize: "19px", letterSpacing: "-0.5px", textDecoration: "none" }}>
                        GoCart<span style={{ color: "#0071e3" }}>.</span>
                    </Link>

                    {/* Desktop links */}
                    <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                style={{ fontSize: "13px", color: "rgba(255,255,255,0.78)", textDecoration: "none", fontWeight: 400, letterSpacing: "-0.1px" }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.78)"; }}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {/* Search */}
                        <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", padding: "4px" }} aria-label="Search">
                            <Search size={17} />
                        </button>

                        {/* Cart */}
                        <Link href="/cart" style={{ position: "relative", color: "rgba(255,255,255,0.7)", display: "inline-flex" }} aria-label="Cart">
                            <ShoppingBag size={17} />
                            {cartCount > 0 && (
                                <span style={{ position: "absolute", top: "-7px", right: "-8px", minWidth: "16px", height: "16px", backgroundColor: "#0071e3", borderRadius: "8px", fontSize: "9px", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {user ? (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action label="My Orders" labelIcon={<PackageIcon size={13} />} onClick={() => router.push("/orders")} />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button
                                onClick={openSignIn}
                                style={{ backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "980px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0077ed"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0071e3"; }}
                            >
                                Sign in
                            </button>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "none", padding: "4px", flexDirection: "column", gap: "4px" }}
                            className="mobile-menu-btn"
                            aria-label="Menu"
                        >
                            <span style={{ display: "block", width: "18px", height: "2px", backgroundColor: "currentColor", transition: "transform 0.2s", transform: mobileOpen ? "rotate(45deg) translate(3px,3px)" : "none" }} />
                            <span style={{ display: "block", width: "18px", height: "2px", backgroundColor: "currentColor", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
                            <span style={{ display: "block", width: "18px", height: "2px", backgroundColor: "currentColor", transition: "transform 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(3px,-3px)" : "none" }} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── MOBILE MENU DROPDOWN ── */}
            {mobileOpen && (
                <div style={{
                    ...GLASS,
                    position: "fixed", top: "52px", left: 0, right: 0, zIndex: 49,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    padding: "8px 0 16px",
                }}>
                    {NAV_LINKS.map((l) => (
                        <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                            style={{ display: "block", color: "#fff", fontSize: "17px", textDecoration: "none", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            {l.label}
                        </Link>
                    ))}
                    {!user && (
                        <div style={{ padding: "12px 24px 0" }}>
                            <button onClick={() => { openSignIn(); setMobileOpen(false); }}
                                style={{ width: "100%", backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "10px", padding: "13px", fontSize: "17px", cursor: "pointer" }}>
                                Sign in
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── SEARCH OVERLAY ── */}
            {searchOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 60, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "100px", padding: "100px 16px 0" }}
                    onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
                >
                    <button onClick={() => setSearchOpen(false)} style={{ position: "absolute", top: "16px", right: "24px", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                        <X size={24} />
                    </button>
                    <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "600px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "14px", padding: "16px 22px" }}>
                            <Search size={20} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, categories…"
                                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: "20px", fontFamily: "'Inter',sans-serif" }} />
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "13px", marginTop: "12px" }}>Press Enter to search</p>
                    </form>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: flex !important; }
                }
                @media (max-width: 768px) {
                    .nav-desktop-links { display: none !important; }
                }
            `}</style>
        </>
    );
}