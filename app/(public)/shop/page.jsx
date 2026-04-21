'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import SkeletonCard from "@/components/SkeletonCard"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { Search, X } from "lucide-react"

const ALL_CATEGORIES = ["All", "Headphones", "Speakers", "Watch", "Earbuds", "Mouse", "Camera", "Theater", "Electronics", "Others"];
const SORT_OPTIONS   = [
    { label: "Newest",           value: "newest"     },
    { label: "Price: Low→High",  value: "price_asc"  },
    { label: "Price: High→Low",  value: "price_desc" },
    { label: "Best Rated",       value: "rating"     },
];

const inputStyle = {
    backgroundColor: "#f5f5f7", color: "#1d1d1f",
    border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px",
    padding: "9px 14px", fontSize: "14px", outline: "none",
    fontFamily: "inherit", width: "100%",
};

function ShopContent() {
    const searchParams  = useSearchParams()
    const initialSearch = searchParams.get('search') || ''
    const router        = useRouter()

    const { list: products, loading } = useSelector((state) => state.product)

    const [search,   setSearch]   = useState(initialSearch)
    const [category, setCategory] = useState("All")
    const [sort,     setSort]     = useState("newest")

    const filtered = useMemo(() => {
        let arr = [...products]
        if (search.trim()) {
            const q = search.toLowerCase()
            arr = arr.filter((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
        }
        if (category !== "All") arr = arr.filter((p) => p.category === category)
        if (sort === "newest")    arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        if (sort === "price_asc") arr.sort((a, b) => a.price - b.price)
        if (sort === "price_desc") arr.sort((a, b) => b.price - a.price)
        if (sort === "rating")    arr.sort((a, b) => (b.rating?.length || 0) - (a.rating?.length || 0))
        return arr
    }, [products, search, category, sort])

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) router.push(`/shop?search=${encodeURIComponent(search.trim())}`, { scroll: false })
    }

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fff" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 20px" }}>

                {/* Header */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "32px" }}>
                    <div>
                        <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 700, color: "#1d1d1f", lineHeight: 1.1 }}>
                            {search ? `Results for "${search}"` : "All Products"}
                        </h1>
                        <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.48)", marginTop: "4px" }}>
                            {loading ? "Loading…" : `${filtered.length} products`}
                        </p>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} style={{ position: "relative", maxWidth: "280px", width: "100%" }}>
                        <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.4)", pointerEvents: "none" }} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products…"
                            style={{ ...inputStyle, paddingLeft: "34px", paddingRight: search ? "34px" : "14px" }}
                        />
                        {search && (
                            <button type="button" onClick={() => { setSearch(""); router.push("/shop", { scroll: false }); }}
                                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)", display: "flex" }}>
                                <X size={14} />
                            </button>
                        )}
                    </form>
                </div>

                {/* Filter bar */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: 1 }}>
                        {ALL_CATEGORIES.map((cat) => {
                            const active = category === cat;
                            return (
                                <button key={cat} onClick={() => setCategory(cat)} style={{
                                    padding: "6px 16px", borderRadius: "980px", fontSize: "13px", fontWeight: 500,
                                    border: "1px solid", cursor: "pointer", transition: "all 0.15s",
                                    backgroundColor: active ? "#0071e3" : "transparent",
                                    borderColor: active ? "#0071e3" : "rgba(0,0,0,0.14)",
                                    color: active ? "#fff" : "rgba(0,0,0,0.56)",
                                }}>
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{ ...inputStyle, maxWidth: "180px", width: "auto", cursor: "pointer", padding: "8px 12px" }}
                    >
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                {/* Product grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
                    {loading
                        ? Array(12).fill(null).map((_, i) => <SkeletonCard key={i} />)
                        : filtered.length > 0
                            ? filtered.map((p) => <ProductCard key={p.id} product={p} />)
                            : (
                                <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px", textAlign: "center" }}>
                                    <span style={{ fontSize: "48px" }}>🔍</span>
                                    <p style={{ fontSize: "21px", fontWeight: 700, color: "#1d1d1f" }}>No products found</p>
                                    <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.48)" }}>Try a different search or category.</p>
                                    <button
                                        onClick={() => { setSearch(""); setCategory("All"); }}
                                        style={{ marginTop: "8px", backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "980px", padding: "10px 24px", fontSize: "15px", cursor: "pointer" }}
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 20px" }}>
                <div className="skeleton" style={{ height: "40px", width: "200px", marginBottom: "32px" }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
                    {Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    )
}