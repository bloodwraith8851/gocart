'use client'
import Image from "next/image"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { StoreIcon } from "lucide-react"

export default function AdminStores() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const res = await fetch("/api/admin/stores")
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to fetch stores")
            setStores(data.stores || [])
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (store) => {
        const newStatus = store.isActive ? "pending" : "approved"
        const res = await fetch("/api/admin/stores", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeId: store.id, status: newStatus }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to update store")
        setStores((prev) =>
            prev.map((s) => s.id === store.id ? { ...s, isActive: !s.isActive, status: newStatus } : s)
        )
    }

    useEffect(() => { fetchStores() }, [])

    if (loading) return <Loading />

    const activeStores = stores.filter(s => s.isActive)

    return (
        <div style={{ animation: "fadein 0.4s ease", paddingBottom: "64px" }}>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                    Live Stores
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>
                    {activeStores.length} active · {stores.length} total
                </p>
            </div>

            {stores.length === 0 ? (
                <div style={{ backgroundColor: "#161618", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", height: "180px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <StoreIcon size={32} style={{ color: "rgba(255,255,255,0.15)" }} />
                    <p style={{ color: "rgba(255,255,255,0.36)", fontSize: "15px" }}>No stores found</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {stores.map((store) => (
                        <div key={store.id} style={{
                            backgroundColor: "#161618", borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.07)",
                            padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px",
                            transition: "border-color 0.2s",
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                        >
                            {/* Logo */}
                            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#272729", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
                                {store.logo
                                    ? <Image src={store.logo} alt={store.name} fill style={{ objectFit: "cover" }} />
                                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><StoreIcon size={20} style={{ color: "rgba(255,255,255,0.2)" }} /></div>
                                }
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 700, color: "#fff", fontSize: "15px", marginBottom: "2px" }}>{store.name}</p>
                                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)" }}>@{store.username} · {store.email}</p>
                            </div>

                            {/* Status badge */}
                            <span style={{
                                fontSize: "11px", fontWeight: 700, borderRadius: "980px", padding: "3px 12px",
                                backgroundColor: store.isActive ? "rgba(52,199,89,0.1)" : "rgba(255,149,0,0.1)",
                                color: store.isActive ? "#34c759" : "#ff9500",
                                border: `1px solid ${store.isActive ? "rgba(52,199,89,0.25)" : "rgba(255,149,0,0.25)"}`,
                            }}>
                                {store.isActive ? "Active" : store.status}
                            </span>

                            {/* Toggle */}
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Active</span>
                                <div style={{ position: "relative" }}>
                                    <input type="checkbox" style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                                        checked={store.isActive}
                                        onChange={() => toast.promise(toggleIsActive(store), { loading: "Updating...", success: "Updated!", error: (e) => e.message })}
                                    />
                                    <div onClick={() => toast.promise(toggleIsActive(store), { loading: "Updating...", success: "Updated!", error: (e) => e.message })}
                                        style={{
                                            width: "36px", height: "20px", borderRadius: "10px", cursor: "pointer",
                                            backgroundColor: store.isActive ? "#34c759" : "rgba(255,255,255,0.12)",
                                            transition: "background-color 0.2s", position: "relative",
                                        }}>
                                        <div style={{
                                            position: "absolute", top: "2px", borderRadius: "50%",
                                            left: store.isActive ? "18px" : "2px",
                                            width: "16px", height: "16px", backgroundColor: "#fff",
                                            transition: "left 0.2s",
                                        }} />
                                    </div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            )}
            <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}
}