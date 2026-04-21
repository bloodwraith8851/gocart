'use client'
import ProductCard from "@/components/ProductCard"
import SkeletonCard from "@/components/SkeletonCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"
import Image from "next/image"

export default function StoreShop() {
    const { username }  = useParams()
    const [products,   setProducts]   = useState([])
    const [storeInfo,  setStoreInfo]  = useState(null)
    const [loading,    setLoading]    = useState(true)
    const [error,      setError]      = useState(null)

    useEffect(() => {
        ;(async () => {
            try {
                const res  = await fetch(`/api/store/data?username=${username}`)
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || "Store not found")
                setStoreInfo(data.store)
                setProducts(data.store.Product || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        })()
    }, [username])

    if (loading) {
        return (
            <div className="max-w-[980px] mx-auto px-5 py-12">
                <div className="skeleton rounded-xl mb-6" style={{ height: "180px" }} />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-center px-5" style={{ minHeight: "70vh" }}>
                <p style={{ fontSize: "48px" }}>🏪</p>
                <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1d1d1f", marginTop: "12px" }}>Store not found</h1>
                <p className="text-caption mt-2" style={{ color: "rgba(0,0,0,0.48)" }}>{error}</p>
            </div>
        )
    }

    const inStock = products.filter((p) => p.inStock)

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fff" }}>
            {/* Store banner */}
            {storeInfo && (
                <div style={{ backgroundColor: "#f5f5f7", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="max-w-[980px] mx-auto px-5 py-10 flex flex-col md:flex-row items-center gap-6">
                        {storeInfo.logo && (
                            <Image
                                src={storeInfo.logo}
                                alt={storeInfo.name}
                                width={96}
                                height={96}
                                className="rounded-2xl object-cover shrink-0"
                                style={{ width: "96px", height: "96px", border: "1px solid rgba(0,0,0,0.08)" }}
                            />
                        )}
                        <div className="text-center md:text-left flex-1">
                            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 600, color: "#1d1d1f" }}>
                                {storeInfo.name}
                            </h1>
                            <p className="text-caption mt-2" style={{ color: "rgba(0,0,0,0.56)", maxWidth: "480px" }}>
                                {storeInfo.description}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                <span className="flex items-center gap-1 text-micro" style={{ color: "rgba(0,0,0,0.48)" }}>
                                    <MapPinIcon size={12} /> {storeInfo.address}
                                </span>
                                <span className="flex items-center gap-1 text-micro" style={{ color: "rgba(0,0,0,0.48)" }}>
                                    <MailIcon size={12} /> {storeInfo.email}
                                </span>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "24px", fontWeight: 700, color: "#1d1d1f", lineHeight: 1 }}>
                                {inStock.length}
                            </p>
                            <p className="text-micro" style={{ color: "rgba(0,0,0,0.48)", marginTop: "2px" }}>
                                Products available
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            <div className="max-w-[980px] mx-auto px-5 py-12 mb-16">
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "21px", fontWeight: 600, color: "#1d1d1f", marginBottom: "24px" }}>
                    All Products
                </h2>
                {inStock.length === 0 ? (
                    <div className="flex items-center justify-center" style={{ backgroundColor: "#f5f5f7", borderRadius: "12px", height: "200px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)" }}>No products available right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {inStock.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}