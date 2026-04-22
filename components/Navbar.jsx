'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { Search, ShoppingBag, X, PackageIcon, HeartIcon } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import Image from "next/image"

const GLASS = {
    backgroundColor: "rgba(10,10,10,0.85)",
    backdropFilter: "saturate(180%) blur(20px)",
    WebkitBackdropFilter: "saturate(180%) blur(20px)",
};

const NAV_LINKS = [
    { label: "Home",    href: "/" },
    { label: "Shop",    href: "/shop" },
    { label: "Deals",   href: "/deals" },
    { label: "Sell",    href: "/create-store" },
];

export default function Navbar() {
    const { user }       = useUser();
    const { openSignIn } = useClerk();
    const pathname       = usePathname();
    const router         = useRouter();

    const [search,     setSearch]     = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled,   setScrolled]   = useState(false);

    const cartCount     = useSelector((s) => s.cart.total ?? 0);
    const { list: allProducts } = useSelector(state => state.product);
    const { wishlist }  = useWishlist();
    const wishlistCount = wishlist.length;

    const searchInputRef = useRef(null);

    // Scroll listener for shrink effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    // Live Search Results
    const liveResults = search.trim() 
        ? allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
        : [];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
        setSearchOpen(false);
        setSearch("");
    };

    const navHeight = scrolled ? "48px" : "56px"

    return (
        <>
            {/* ── MAIN NAV (sticky) ── */}
            <nav
                style={{
                    ...GLASS,
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    height: navHeight,
                    display: "flex",
                    alignItems: "center",
                    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                    transition: "all 0.3s ease"
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
                    <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: "32px", position: "relative" }}>
                        {NAV_LINKS.map((l) => {
                            const active = pathname === l.href;
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    style={{ 
                                        fontSize: "13px", 
                                        color: active ? "#fff" : "rgba(255,255,255,0.78)", 
                                        textDecoration: "none", 
                                        fontWeight: active ? 600 : 400, 
                                        letterSpacing: "-0.1px",
                                        position: "relative",
                                        transition: "color 0.2s"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = active ? "#fff" : "rgba(255,255,255,0.78)"; }}
                                >
                                    {l.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {/* Search */}
                        <button onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", padding: "4px" }} aria-label="Search">
                            <Search size={17} />
                        </button>

                        {/* Compare */}
                        <Link href="/compare" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "13px", fontWeight: 500 }} className="nav-desktop-links" onMouseEnter={(e) => e.target.style.color = "#fff"} onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.7)"}>
                            Compare
                        </Link>

                        {/* Wishlist */}
                        <Link href="/wishlist" style={{ position: "relative", color: "rgba(255,255,255,0.7)", display: "inline-flex", padding: "4px" }} aria-label="Wishlist">
                            <HeartIcon size={17} style={{ fill: wishlistCount > 0 ? "#ff3b30" : "none", color: wishlistCount > 0 ? "#ff3b30" : "rgba(255,255,255,0.7)", transition: "fill 0.2s, color 0.2s" }} />
                            {wishlistCount > 0 && (
                                <span style={{ position: "absolute", top: "-5px", right: "-5px", minWidth: "14px", height: "14px", backgroundColor: "#ff3b30", borderRadius: "7px", fontSize: "9px", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                                    {wishlistCount > 99 ? "99+" : wishlistCount}
                                </span>
                            )}
                        </Link>

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
                    position: "fixed", top: navHeight, left: 0, right: 0, zIndex: 49,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    padding: "8px 0 16px",
                }}>
                    <Link href="/compare" onClick={() => setMobileOpen(false)} style={{ display: "block", color: "#fff", fontSize: "17px", textDecoration: "none", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>Compare</Link>
                    {NAV_LINKS.map((l) => (
                        <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                            style={{ display: "block", color: "#fff", fontSize: "17px", textDecoration: "none", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            {l.label}
                        </Link>
                    ))}
                    {!user && (
                        <div style={{ padding: "12px 24px 0" }}>
                            <button onClick={() => { openSignIn(); setMobileOpen(false); }}
                                style={{ width: "100%", backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "10px", padding: "13px", fontSize: "17px", cursor: "pointer", fontWeight: 600 }}>
                                Sign in
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── SEARCH OVERLAY ── */}
            {searchOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 60, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "100px", padding: "100px 16px 0", animation: "fadein 0.2s ease" }}
                    onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
                >
                    <button onClick={() => setSearchOpen(false)} style={{ position: "absolute", top: "16px", right: "24px", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "8px" }}>
                        <X size={28} />
                    </button>
                    
                    <div style={{ width: "100%", maxWidth: "600px" }}>
                        <form onSubmit={handleSearch}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "16px", padding: "16px 22px", boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}>
                                <Search size={22} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
                                <input ref={searchInputRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
                                    style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: "22px", fontFamily: "'Inter',sans-serif", fontWeight: 500 }} />
                            </div>
                        </form>

                        {/* Live Results Dropdown */}
                        {search.trim() && (
                            <div style={{ marginTop: "16px", backgroundColor: "rgba(20,20,22,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(20px)" }}>
                                {liveResults.length > 0 ? (
                                    liveResults.map(p => (
                                        <Link key={p.id} href={`/product/${p.id}`} onClick={() => setSearchOpen(false)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background-color 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                                            <div style={{ width: "48px", height: "48px", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                                                {p.images?.[0] && <Image src={p.images[0]} alt={p.name} width={40} height={40} style={{ objectFit: "contain" }} />}
                                            </div>
                                            <div>
                                                <p style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>{p.name}</p>
                                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{p.category} • ${(p.price).toFixed(2)}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>
                                        No matches for "{search}"
                                    </div>
                                )}
                                {liveResults.length >= 5 && (
                                    <button onClick={handleSearch} style={{ width: "100%", background: "transparent", border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "16px", color: "#0071e3", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                                        See all results
                                    </button>
                                )}
                            </div>
                        )}
                        {!search.trim() && <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "13px", marginTop: "16px" }}>Type to quickly find items</p>}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: flex !important; }
                    .nav-desktop-links { display: none !important; }
                }
                @keyframes fadein { from { opacity: 0 } to { opacity: 1 } }
            `}</style>
        </>
    );
}