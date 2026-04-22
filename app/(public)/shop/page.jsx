'use client'
import { Suspense, useState, useMemo, useRef, useLayoutEffect } from "react"
import ProductCard from "@/components/ProductCard"
import SkeletonCard from "@/components/SkeletonCard"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { Search, X, SlidersHorizontal, LayoutGrid, List as ListIcon, Tag } from "lucide-react"
import { gsap } from "@/lib/gsap"
import { useScrollAnimation, staggerCards } from "@/hooks/useScrollAnimation"

const ALL_CATEGORIES = ["Headphones", "Speakers", "Watch", "Earbuds", "Mouse", "Camera", "Theater", "Electronics", "Others"]
const SORT_OPTIONS = [
    { label: "Newest",          value: "newest" },
    { label: "Price: Low→High", value: "price_asc" },
    { label: "Price: High→Low", value: "price_desc" },
    { label: "Best Rated",      value: "rating" },
]

const inputStyle = {
    backgroundColor: "#f5f5f7", color: "#1d1d1f",
    border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px",
    padding: "9px 14px", fontSize: "14px", outline: "none",
    fontFamily: "inherit", width: "100%",
}

function ShopContent() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''
    const router = useRouter()

    const { list: products, loading } = useSelector((state) => state.product)

    // Filters State
    const [search, setSearch] = useState(initialSearch)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState(1000)
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sort, setSort] = useState("newest")
    
    // View State
    const [listView, setListView] = useState(false)
    const [showFilters, setShowFilters] = useState(true) // Sidebar toggle

    // Refs for animations
    const gridRef = useRef(null)
    const filterSidebarRef = useRef(null)

    // Compute Filtered Products
    const filtered = useMemo(() => {
        let arr = [...products]
        if (search.trim()) {
            const q = search.toLowerCase()
            arr = arr.filter((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
        }
        if (selectedCategories.length > 0) {
            arr = arr.filter((p) => selectedCategories.includes(p.category))
        }
        if (inStockOnly) {
            arr = arr.filter((p) => p.inStock)
        }
        // Price Max Filter
        if (priceRange < 1000) {
            arr = arr.filter(p => p.price <= priceRange)
        }

        if (sort === "newest")    arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        if (sort === "price_asc") arr.sort((a, b) => a.price - b.price)
        if (sort === "price_desc") arr.sort((a, b) => b.price - a.price)
        if (sort === "rating")    arr.sort((a, b) => (b.rating?.length || 0) - (a.rating?.length || 0))
        return arr
    }, [products, search, selectedCategories, sort, inStockOnly, priceRange])

    // --- GSAP Animations ---
    useLayoutEffect(() => {
        if (!gridRef.current) return
        const ctx = gsap.context(() => staggerCards('.product-card-el'), gridRef)
        return () => ctx.revert()
    }, [filtered.length, listView])

    // Handle Category Toggle
    const toggleCategory = (cat) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat))
        } else {
            setSelectedCategories([...selectedCategories, cat])
        }
    }

    const clearFilters = () => {
        setSearch("")
        setSelectedCategories([])
        setInStockOnly(false)
        setPriceRange(1000)
        router.push("/shop", { scroll: false })
    }

    const activeFilterCount = selectedCategories.length + (inStockOnly ? 1 : 0) + (priceRange < 1000 ? 1 : 0)

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fff" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 20px" }}>

                {/* ── HEADER & SEARCH ── */}
                <div className="gsap-header" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "32px" }}>
                    <div>
                        <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 800, color: "#1d1d1f", lineHeight: 1.1, letterSpacing: "-1px" }}>
                            {search ? `Search: "${search}"` : "All Products"}
                        </h1>
                        <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.48)", marginTop: "4px" }}>
                            {loading ? "Loading…" : `Showing ${filtered.length} products`}
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <form onSubmit={(e) => { e.preventDefault(); router.push(`/shop?search=${encodeURIComponent(search.trim())}`, { scroll: false }) }} style={{ position: "relative", width: "240px" }}>
                            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.4)", pointerEvents: "none" }} />
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ ...inputStyle, paddingLeft: "34px", paddingRight: search ? "34px" : "14px", borderRadius: "980px" }} />
                            {search && (
                                <button type="button" onClick={() => { setSearch(""); router.push("/shop", { scroll: false }); }} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)" }}>
                                    <X size={14} />
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* ── MAIN LAYOUT (SIDEBAR + GRID) ── */}
                <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", position: "relative" }}>
                    
                    {/* LEFT SIDEBAR (Filters) */}
                    {showFilters && (
                        <aside ref={filterSidebarRef} style={{ width: "260px", flexShrink: 0, position: "sticky", top: "80px", display: "flex", flexDirection: "column", gap: "32px", paddingRight: "16px" }} className="hide-mobile">
                            
                            <div>
                                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}><SlidersHorizontal size={16}/> Filters</h3>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearFilters} style={{ background: "none", border: "none", color: "#ff3b30", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginBottom: "16px", padding: 0 }}>
                                        Clear {activeFilterCount} filters
                                    </button>
                                )}
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h4 style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "12px" }}>Categories</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {ALL_CATEGORIES.map(cat => (
                                        <label key={cat} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                                            <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} style={{ width: "16px", height: "16px", accentColor: "#0071e3" }} />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr style={{ borderColor: "rgba(0,0,0,0.06)" }} />

                            {/* Price Slider */}
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <h4 style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Max Price</h4>
                                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{priceRange >= 1000 ? "Any" : `${currency}${priceRange}`}</span>
                                </div>
                                <div className="range-slider">
                                    <input type="range" min="10" max="1000" step="10" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>
                                    <span>$10</span><span>$1000+</span>
                                </div>
                            </div>

                            <hr style={{ borderColor: "rgba(0,0,0,0.06)" }} />

                            {/* In Stock Toggle */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "14px", fontWeight: 500 }}>In Stock Only</span>
                                <div className={`toggle-track ${inStockOnly ? 'on' : ''}`} onClick={() => setInStockOnly(!inStockOnly)}>
                                    <div className="toggle-thumb" />
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* RIGHT CONTENT (Products) */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        
                        {/* Toolbar */}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                            
                            <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost hide-mobile" style={{ padding: "8px 16px", fontSize: "13px", borderRadius: "8px", color: "#1d1d1f", borderColor: "rgba(0,0,0,0.1)" }}>
                                <SlidersHorizontal size={14} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>

                            {/* Active Filter Chips */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1, paddingLeft: "16px" }}>
                                {selectedCategories.map(cat => (
                                    <span key={cat} style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f5f5f7", padding: "4px 10px", borderRadius: "980px", fontSize: "12px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                        {cat} <X size={12} style={{ cursor: "pointer" }} onClick={() => toggleCategory(cat)} />
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "8px 12px", borderRadius: "8px", border: "none", backgroundColor: "#f5f5f7", fontWeight: 500, cursor: "pointer" }}>
                                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
                                </select>

                                {/* Layout Toggles */}
                                <div style={{ display: "flex", backgroundColor: "#f5f5f7", borderRadius: "8px", padding: "4px" }}>
                                    <button onClick={() => setListView(false)} style={{ background: !listView ? "#fff" : "transparent", boxShadow: !listView ? "0 2px 4px rgba(0,0,0,0.06)" : "none", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}><LayoutGrid size={16} color={!listView ? "#1d1d1f" : "rgba(0,0,0,0.4)"} /></button>
                                    <button onClick={() => setListView(true)} style={{ background: listView ? "#fff" : "transparent", boxShadow: listView ? "0 2px 4px rgba(0,0,0,0.06)" : "none", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}><ListIcon size={16} color={listView ? "#1d1d1f" : "rgba(0,0,0,0.4)"} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: listView ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
                            {loading
                                ? Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)
                                : filtered.length > 0
                                    ? filtered.map((p) => <ProductCard key={p.id} product={p} listView={listView} staggerMode />)
                                    : (
                                        <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "16px", textAlign: "center" }}>
                                            <div style={{ width: "80px", height: "80px", backgroundColor: "#f5f5f7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Tag size={32} color="rgba(0,0,0,0.2)" /></div>
                                            <p style={{ fontSize: "24px", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.5px" }}>No matching products</p>
                                            <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.48)" }}>Try adjusting your filters or search query.</p>
                                            <button onClick={clearFilters} className="btn-primary" style={{ marginTop: "8px" }}>Clear all filters</button>
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 20px" }}>
                <div className="skeleton" style={{ height: "48px", width: "300px", marginBottom: "40px" }} />
                <div style={{ display: "flex", gap: "40px" }}>
                    <div className="skeleton" style={{ width: "260px", height: "600px" }} />
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
                        {Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    )
}