'use client'
import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { Trash2Icon, TagIcon, PlusIcon } from "lucide-react"
import Loading from "@/components/Loading"

const inp = { width: "100%", backgroundColor: "#0d0d0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9px", padding: "10px 12px", fontSize: "13px", color: "#fff", fontFamily: "'Inter',sans-serif", outline: "none" }

export default function AdminCoupons() {
    const [coupons,     setCoupons]     = useState([])
    const [loading,     setLoading]     = useState(true)
    const [formLoading, setFormLoading] = useState(false)
    const [newCoupon, setNewCoupon] = useState({ code: "", description: "", discount: "", forNewUser: false, forMember: false, isPublic: true, expiresAt: "" })

    const fetchCoupons = useCallback(async () => {
        try {
            const res  = await fetch("/api/admin/coupons")
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setCoupons(data.coupons || [])
        } catch (err) { toast.error(err.message) }
        finally { setLoading(false) }
    }, [])

    const handleAdd = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        try {
            const res  = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCoupon) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed")
            setCoupons((prev) => [data.coupon, ...prev])
            setNewCoupon({ code: "", description: "", discount: "", forNewUser: false, forMember: false, isPublic: true, expiresAt: "" })
            toast.success("Coupon created!")
        } catch (err) { toast.error(err.message) }
        finally { setFormLoading(false) }
    }

    const deleteCoupon = async (code) => {
        const res  = await fetch(`/api/admin/coupons?code=${code}`, { method: "DELETE" })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed")
        setCoupons((prev) => prev.filter((c) => c.code !== code))
    }

    useEffect(() => { fetchCoupons() }, [fetchCoupons])

    if (loading) return <Loading />

    return (
        <div style={{ animation: "fadein 0.4s ease", paddingBottom: "64px" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                    Coupons
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>{coupons.length} active coupons</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 400px) 1fr", gap: "20px", alignItems: "start" }}>
                {/* CREATE FORM */}
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "24px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                        <PlusIcon size={15} style={{ color: "#0071e3" }} />
                        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>Create Coupon</h2>
                    </div>
                    <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Code</label>
                                <input value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    placeholder="SAVE20" style={inp} required
                                    onFocus={(e) => { e.target.style.borderColor = "#0071e3"; e.target.style.boxShadow = "0 0 0 2px rgba(0,113,227,0.2)"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Discount %</label>
                                <input type="number" min={1} max={100} value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                                    placeholder="20" style={inp} required
                                    onFocus={(e) => { e.target.style.borderColor = "#0071e3"; e.target.style.boxShadow = "0 0 0 2px rgba(0,113,227,0.2)"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Description</label>
                            <input value={newCoupon.description} onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                placeholder="Brief description" style={inp} required
                                onFocus={(e) => { e.target.style.borderColor = "#0071e3"; e.target.style.boxShadow = "0 0 0 2px rgba(0,113,227,0.2)"; }}
                                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Expiry Date</label>
                            <input type="date" value={newCoupon.expiresAt} onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                                style={{ ...inp, colorScheme: "dark" }} required
                                onFocus={(e) => { e.target.style.borderColor = "#0071e3"; }}
                                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                            />
                        </div>

                        {/* Toggles */}
                        {[
                            { key: "forNewUser", label: "For New Users Only" },
                            { key: "forMember",  label: "For Members Only" },
                            { key: "isPublic",   label: "Publicly Visible" },
                        ].map(({ key, label }) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setNewCoupon({ ...newCoupon, [key]: !newCoupon[key] })}>
                                <div className={`toggle-track ${newCoupon[key] ? "on" : ""}`}>
                                    <div className="toggle-thumb" />
                                </div>
                                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.56)" }}>{label}</span>
                            </div>
                        ))}

                        <button type="submit" disabled={formLoading}
                            style={{ backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "980px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: formLoading ? "not-allowed" : "pointer", opacity: formLoading ? 0.7 : 1, marginTop: "4px", transition: "transform 0.15s, box-shadow 0.15s" }}
                            onMouseEnter={(e) => { if (!formLoading) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,113,227,0.4)"; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                            {formLoading ? "Creating…" : "Create Coupon"}
                        </button>
                    </form>
                </div>

                {/* COUPON LIST */}
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <TagIcon size={15} style={{ color: "#0071e3" }} />
                        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>Active Coupons</h2>
                    </div>

                    {coupons.length === 0 ? (
                        <div style={{ height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <TagIcon size={32} style={{ color: "rgba(255,255,255,0.12)" }} />
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>No coupons yet</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ minWidth: "520px", width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        {["Code", "Discount", "Description", "Expires", ""].map((h) => (
                                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.36)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((c) => (
                                        <tr key={c.code} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                        >
                                            <td style={{ padding: "14px 20px" }}>
                                                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#0071e3", fontSize: "13px", backgroundColor: "rgba(0,113,227,0.08)", padding: "3px 10px", borderRadius: "6px" }}>{c.code}</span>
                                            </td>
                                            <td style={{ padding: "14px 20px" }}>
                                                <span style={{ fontWeight: 800, color: "#34c759", fontSize: "15px" }}>{c.discount}%</span>
                                            </td>
                                            <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.56)", fontSize: "13px" }}>{c.description}</td>
                                            <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.36)", fontSize: "13px", whiteSpace: "nowrap" }}>
                                                {format(new Date(c.expiresAt), "MMM d, yyyy")}
                                            </td>
                                            <td style={{ padding: "14px 20px" }}>
                                                <button
                                                    onClick={() => toast.promise(deleteCoupon(c.code), { loading: "Deleting…", success: "Deleted!", error: "Failed" })}
                                                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,59,48,0.5)", padding: "4px", borderRadius: "6px", transition: "color 0.15s, background-color 0.15s" }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ff3b30"; e.currentTarget.style.backgroundColor = "rgba(255,59,48,0.08)"; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,59,48,0.5)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                                                >
                                                    <Trash2Icon size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}