'use client'
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import { CheckCircle2Icon, XCircleIcon, ClockIcon, StoreIcon } from "lucide-react"
import Loading from "@/components/Loading"

const STATUS_STYLES = {
    approved: { color: "#34c759", bg: "rgba(52,199,89,0.1)",   border: "rgba(52,199,89,0.25)",  label: "Approved" },
    rejected: { color: "#ff3b30", bg: "rgba(255,59,48,0.1)",   border: "rgba(255,59,48,0.25)",  label: "Rejected" },
    pending:  { color: "#ff9500", bg: "rgba(255,149,0,0.1)",   border: "rgba(255,149,0,0.25)",  label: "Pending"  },
}

function StoreCard({ store, onAction }) {
    const st = STATUS_STYLES[store.status] || STATUS_STYLES.pending
    const [busy, setBusy] = useState(false)

    const act = async (status) => {
        setBusy(true)
        try {
            await toast.promise(onAction({ storeId: store.id, status }), {
                loading: status === "approved" ? "Approving…" : "Rejecting…",
                success: `Store ${status}!`,
                error:   "Action failed",
            })
        } finally { setBusy(false) }
    }

    return (
        <div style={{
            backgroundColor: "#161618", borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px",
            transition: "border-color 0.2s",
        }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
        >
            {/* Store identity row */}
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#272729", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)" }}>
                    {store.logo
                        ? <Image src={store.logo} alt={store.name} width={52} height={52} style={{ width: "52px", height: "52px", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><StoreIcon size={24} style={{ color: "rgba(255,255,255,0.2)" }} /></div>
                    }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <p style={{ fontWeight: 700, color: "#fff", fontSize: "17px" }}>{store.name}</p>
                        <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: "2px 10px", borderRadius: "980px" }}>
                            {st.label}
                        </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>@{store.username}</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.56)", lineHeight: 1.5, maxWidth: "560px" }}>{store.description}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "6px" }}>
                        Owner: {store.user?.name}  ·  {store.email}  ·  {store.contact}
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button disabled={busy || store.status === "approved"}
                    onClick={() => act("approved")}
                    style={{ backgroundColor: store.status === "approved" ? "rgba(52,199,89,0.1)" : "#34c759", color: store.status === "approved" ? "#34c759" : "#fff", border: `1px solid ${store.status === "approved" ? "rgba(52,199,89,0.3)" : "transparent"}`, borderRadius: "980px", padding: "8px 22px", fontSize: "13px", fontWeight: 600, cursor: busy || store.status === "approved" ? "not-allowed" : "pointer", opacity: busy ? 0.7 : 1, transition: "transform 0.15s" }}
                    onMouseEnter={(e) => { if (!busy && store.status !== "approved") e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                    <CheckCircle2Icon size={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />
                    Approve
                </button>
                <button disabled={busy || store.status === "rejected"}
                    onClick={() => act("rejected")}
                    style={{ backgroundColor: "rgba(255,59,48,0.08)", color: store.status === "rejected" ? "rgba(255,59,48,0.4)" : "#ff3b30", border: "1px solid rgba(255,59,48,0.2)", borderRadius: "980px", padding: "8px 22px", fontSize: "13px", fontWeight: 600, cursor: busy || store.status === "rejected" ? "not-allowed" : "pointer", opacity: busy ? 0.7 : 1 }}
                >
                    <XCircleIcon size={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />
                    Reject
                </button>
            </div>
        </div>
    )
}

export default function AdminApprove() {
    const [stores,  setStores]  = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = useCallback(async () => {
        try {
            const res  = await fetch("/api/admin/stores")
            const data = await res.json()
            setStores(data.stores || [])
        } catch { toast.error("Failed to load stores") }
        finally { setLoading(false) }
    }, [])

    const handleAction = async ({ storeId, status }) => {
        const res  = await fetch("/api/admin/stores", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeId, status }) })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed")
        setStores((prev) => prev.map((s) => s.id === storeId ? { ...s, status, isActive: status === "approved" } : s))
    }

    useEffect(() => { fetchStores() }, [fetchStores])

    if (loading) return <Loading />

    const pending  = stores.filter((s) => s.status === "pending")
    const reviewed = stores.filter((s) => s.status !== "pending")

    return (
        <div style={{ animation: "fadein 0.4s ease", paddingBottom: "64px" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                    Store Approvals
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>
                    {pending.length} pending · {reviewed.length} reviewed
                </p>
            </div>

            {/* Pending */}
            {pending.length === 0 ? (
                <div style={{ backgroundColor: "#161618", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", height: "180px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
                    <CheckCircle2Icon size={32} style={{ color: "rgba(52,199,89,0.3)" }} />
                    <p style={{ color: "rgba(255,255,255,0.36)", fontSize: "15px" }}>All caught up — no pending applications</p>
                </div>
            ) : (
                <div style={{ marginBottom: "32px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#ff9500", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                        Pending ({pending.length})
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {pending.map((s) => <StoreCard key={s.id} store={s} onAction={handleAction} />)}
                    </div>
                </div>
            )}

            {/* Reviewed */}
            {reviewed.length > 0 && (
                <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                        Reviewed ({reviewed.length})
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {reviewed.map((s) => <StoreCard key={s.id} store={s} onAction={handleAction} />)}
                    </div>
                </div>
            )}

            <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}