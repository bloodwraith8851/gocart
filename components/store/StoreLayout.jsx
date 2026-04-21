'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import StoreNavbar from "./StoreNavbar"
import StoreSidebar from "./StoreSidebar"

export default function StoreLayout({ children }) {
    const [isSeller,  setIsSeller]  = useState(false)
    const [loading,   setLoading]   = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    useEffect(() => {
        ;(async () => {
            try {
                const res  = await fetch("/api/store/is-seller")
                const data = await res.json()
                setIsSeller(!!data.isSeller)
                setStoreInfo(data.storeInfo || null)
            } catch {
                setIsSeller(false)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) return <Loading />

    if (!isSeller) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 600, color: "rgba(255,255,255,0.56)" }}>
                    No approved store found
                </h1>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.32)", marginTop: "8px" }}>
                    Apply to become a seller on GoCart.
                </p>
                <Link href="/create-store" style={{ marginTop: "28px", backgroundColor: "#0071e3", color: "#fff", textDecoration: "none", borderRadius: "980px", padding: "12px 28px", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Create a Store <ArrowRightIcon size={15} />
                </Link>
            </div>
        )
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", flexDirection: "column" }}>
            <StoreNavbar />
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <StoreSidebar storeInfo={storeInfo} />
                <main style={{ flex: 1, overflowY: "auto", padding: "40px 48px" }}>
                    {children}
                </main>
            </div>
        </div>
    )
}