'use client'
import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { PackagePlusIcon, PackageIcon } from "lucide-react"

export default function StoreManageProducts() {
    const currency    = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const { getToken } = useAuth()
    const [loading,  setLoading]  = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = useCallback(async () => {
        try {
            const token   = await getToken()
            const { data } = await axios.get("/api/store/product", { headers: { Authorization: `Bearer ${token}` } })
            setProducts(data.products || [])
        } catch { toast.error("Failed to load products") }
        finally { setLoading(false) }
    }, [getToken])

    const toggleStock = async (productId) => {
        const token   = await getToken()
        const { data } = await axios.post("/api/store/stock-toggle", { productId }, { headers: { Authorization: `Bearer ${token}` } })
        setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, inStock: data.inStock } : p))
    }

    useEffect(() => { fetchProducts() }, [fetchProducts])
    if (loading) return <Loading />

    return (
        <div style={{ animation: "fadein 0.4s ease", paddingBottom: "64px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                        Products
                    </h1>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>{products.length} items in your store</p>
                </div>
                <Link href="/store/add-product" style={{
                    display: "inline-flex", alignItems: "center", gap: "7px", textDecoration: "none",
                    backgroundColor: "#0071e3", color: "#fff", borderRadius: "980px",
                    padding: "10px 20px", fontSize: "14px", fontWeight: 600,
                    boxShadow: "0 4px 20px rgba(0,113,227,0.3)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,113,227,0.45)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,113,227,0.3)"; }}
                >
                    <PackagePlusIcon size={15} />
                    Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div style={{ backgroundColor: "#161618", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", height: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                    <PackageIcon size={40} style={{ color: "rgba(255,255,255,0.1)" }} />
                    <p style={{ color: "rgba(255,255,255,0.36)", fontSize: "17px" }}>No products yet</p>
                    <Link href="/store/add-product" style={{ color: "#0071e3", fontSize: "14px", textDecoration: "none" }}>Add your first product →</Link>
                </div>
            ) : (
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                    {/* Table header */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 80px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Product", "MRP", "Price", "In Stock"].map((h) => (
                            <p key={h} style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.36)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</p>
                        ))}
                    </div>

                    {/* Rows */}
                    {products.map((product, i) => (
                        <div key={product.id} style={{
                            display: "grid", gridTemplateColumns: "1fr 90px 90px 80px",
                            padding: "14px 20px", alignItems: "center",
                            borderBottom: i < products.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            transition: "background-color 0.15s",
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        >
                            {/* Name + image */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                                <div style={{ width: "44px", height: "44px", backgroundColor: "#272729", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                                    <Image src={product.images[0]} alt={product.name} width={36} height={36} style={{ objectFit: "contain", maxHeight: "36px", width: "auto" }} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{product.category}</p>
                                </div>
                            </div>

                            {/* MRP */}
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.36)", textDecoration: "line-through" }}>{currency}{product.mrp}</p>

                            {/* Price */}
                            <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{currency}{product.price}</p>

                            {/* Toggle */}
                            <div className={`toggle-track ${product.inStock ? "on" : ""}`}
                                onClick={() => toast.promise(toggleStock(product.id), { loading: "Updating…", success: product.inStock ? "Marked out of stock" : "Marked in stock!", error: "Failed" })}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="toggle-thumb" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}