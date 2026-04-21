'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import { UploadCloudIcon, SaveIcon, StoreIcon, CheckCircle2Icon } from "lucide-react"
import axios from "axios"

const inputStyle = {
    width: "100%", backgroundColor: "#1c1c1e",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
    padding: "11px 14px", fontSize: "14px", outline: "none",
    fontFamily: "'Inter',sans-serif", color: "#fff",
    transition: "box-shadow 0.15s, border-color 0.15s",
}

const labelStyle = {
    fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.36)",
    textTransform: "uppercase", letterSpacing: "0.08em",
    display: "block", marginBottom: "7px",
}

export default function StoreSettings() {
    const { getToken } = useAuth()

    const [loading,    setLoading]    = useState(true)
    const [saving,     setSaving]     = useState(false)
    const [saved,      setSaved]      = useState(false)
    const [newLogo,    setNewLogo]    = useState(null)   // File object
    const [form, setForm] = useState({
        name: "", description: "", email: "", contact: "", address: "", logo: "",
    })

    // Load current store info
    useEffect(() => {
        ;(async () => {
            try {
                const res  = await fetch("/api/store/update")
                const data = await res.json()
                if (!res.ok) throw new Error(data.error)
                const s = data.store
                setForm({
                    name: s.name || "", description: s.description || "",
                    email: s.email || "", contact: s.contact || "",
                    address: s.address || "", logo: s.logo || "",
                })
            } catch (err) {
                toast.error(err.message || "Failed to load store info")
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setSaved(false)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token    = await getToken()
            const formData = new FormData()
            Object.entries(form).forEach(([k, v]) => { if (k !== "logo") formData.append(k, v) })
            if (newLogo) formData.append("image", newLogo)

            const { data } = await axios.patch("/api/store/update", formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            toast.success(data.message || "Saved!")
            if (data.store?.logo) setForm((f) => ({ ...f, logo: data.store.logo }))
            setNewLogo(null)
            setSaved(true)
        } catch (err) {
            toast.error(err?.response?.data?.error || err.message)
        } finally {
            setSaving(false)
        }
    }

    const previewSrc = newLogo ? URL.createObjectURL(newLogo) : form.logo

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "560px" }}>
                {Array(5).fill(null).map((_, i) => (
                    <div key={i} className="skeleton-dark" style={{ height: i === 1 ? "80px" : "44px", borderRadius: "10px" }} />
                ))}
            </div>
        )
    }

    return (
        <div style={{ animation: "fadein 0.4s ease", maxWidth: "640px", paddingBottom: "64px" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                    Store Settings
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>
                    Update your store profile — changes go live immediately.
                </p>
            </div>

            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

                {/* Logo */}
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "20px 24px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p style={{ ...labelStyle, marginBottom: "14px" }}>Store Logo</p>
                    <label htmlFor="logo-upload" style={{ display: "inline-flex", alignItems: "center", gap: "16px", cursor: "pointer" }}>
                        <div style={{
                            width: "80px", height: "80px", borderRadius: "16px", backgroundColor: "#1c1c1e",
                            overflow: "hidden", position: "relative", flexShrink: 0,
                            border: `2px ${previewSrc ? "solid rgba(0,113,227,0.5)" : "dashed rgba(255,255,255,0.12)"}`,
                            transition: "border-color 0.15s",
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0071e3"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = previewSrc ? "rgba(0,113,227,0.5)" : "rgba(255,255,255,0.12)"; }}
                        >
                            {previewSrc
                                ? <Image src={previewSrc} alt="Logo" fill style={{ objectFit: "cover" }} />
                                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <StoreIcon size={28} style={{ color: "rgba(255,255,255,0.15)" }} />
                                </div>
                            }
                        </div>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                <UploadCloudIcon size={14} style={{ color: "#0071e3" }} />
                                <p style={{ fontSize: "14px", color: "#2997ff", fontWeight: 500 }}>
                                    {newLogo ? newLogo.name : "Change logo"}
                                </p>
                            </div>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)" }}>PNG or JPG, up to 5 MB</p>
                        </div>
                        <input id="logo-upload" type="file" accept="image/*" hidden
                            onChange={(e) => { setNewLogo(e.target.files[0] || null); setSaved(false); }} />
                    </label>
                </div>

                {/* Fields */}
                <div style={{ backgroundColor: "#161618", borderRadius: "14px", padding: "20px 24px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "18px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.36)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Store Info</p>

                    {/* 2-col row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        {[
                            { name: "name",    label: "Store Name",    placeholder: "My Awesome Store"   },
                            { name: "email",   label: "Store Email",   placeholder: "store@example.com"  },
                            { name: "contact", label: "Contact Number",placeholder: "+1 234 567 8900"    },
                        ].map((f) => (
                            <div key={f.name} style={f.name === "name" ? { gridColumn: "1 / -1" } : {}}>
                                <label style={labelStyle}>{f.label}</label>
                                <input
                                    name={f.name} value={form[f.name]} onChange={onChange}
                                    placeholder={f.placeholder} required
                                    style={inputStyle}
                                    onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.2)"; e.currentTarget.style.borderColor = "#0071e3"; }}
                                    onBlur={(e) =>  { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            name="description" value={form.description} onChange={onChange}
                            placeholder="Tell customers about your store…" rows={3} required
                            style={{ ...inputStyle, resize: "none" }}
                            onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.2)"; e.currentTarget.style.borderColor = "#0071e3"; }}
                            onBlur={(e) =>  { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label style={labelStyle}>Address</label>
                        <textarea
                            name="address" value={form.address} onChange={onChange}
                            placeholder="123 Main St, City, State, ZIP" rows={2} required
                            style={{ ...inputStyle, resize: "none" }}
                            onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.2)"; e.currentTarget.style.borderColor = "#0071e3"; }}
                            onBlur={(e) =>  { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                        />
                    </div>
                </div>

                {/* Save button */}
                <button type="submit" disabled={saving}
                    style={{
                        backgroundColor: saved ? "#34c759" : "#0071e3",
                        color: "#fff", border: "none", borderRadius: "980px",
                        padding: "14px 32px", fontSize: "16px", fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.7 : 1, letterSpacing: "-0.2px",
                        display: "flex", alignItems: "center", gap: "8px", width: "fit-content",
                        transition: "background-color 0.3s, transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,113,227,0.4)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                    {saved
                        ? <><CheckCircle2Icon size={16} /> Saved!</>
                        : saving
                            ? "Saving…"
                            : <><SaveIcon size={16} /> Save Changes</>
                    }
                </button>
            </form>

            <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}
