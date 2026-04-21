'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"
import { UploadCloudIcon, CheckCircle2Icon, ClockIcon, XCircleIcon, StoreIcon } from "lucide-react"

const inputStyle = {
    width: "100%", backgroundColor: "#f5f5f7",
    border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px",
    padding: "11px 14px", fontSize: "14px", outline: "none",
    fontFamily: "'Inter',sans-serif", color: "#1d1d1f",
    transition: "box-shadow 0.15s, border-color 0.15s",
}

const FIELDS_ROW = [
    { name: "username",    label: "Store Username",   placeholder: "yourstore",           type: "text"  },
    { name: "name",        label: "Store Name",        placeholder: "My Awesome Store",    type: "text"  },
    { name: "email",       label: "Store Email",       placeholder: "store@example.com",   type: "email" },
    { name: "contact",     label: "Contact Number",    placeholder: "+1 234 567 8900",     type: "tel"   },
]
const FIELDS_FULL = [
    { name: "description", label: "Description",       placeholder: "Tell customers about your store...", rows: 4 },
    { name: "address",     label: "Address",           placeholder: "123 Main St, City, State, ZIP",     rows: 2 },
]

export default function CreateStore() {
    const { user }     = useUser()
    const router       = useRouter()
    const { getToken } = useAuth()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status,  setStatus]  = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [storeInfo, setStoreInfo] = useState({ name: "", username: "", description: "", email: "", contact: "", address: "", image: "" })

    const onChange = (e) => setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })

    useEffect(() => {
        if (!user) { setLoading(false); return }
        ;(async () => {
            try {
                const res  = await fetch("/api/store/is-seller")
                const data = await res.json()
                if (data.storeInfo) {
                    setAlreadySubmitted(true)
                    setStatus(data.storeInfo.status)
                    if (data.storeInfo.status === "approved") {
                        setTimeout(() => router.push("/store"), 4000)
                    }
                }
            } catch { }
            finally { setLoading(false) }
        })()
    }, [user])

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!user) return toast.error("Sign in first")
        if (!storeInfo.image) return toast.error("Please upload a store logo")
        setSubmitting(true)
        try {
            const token    = await getToken()
            const formData = new FormData()
            Object.entries(storeInfo).forEach(([k, v]) => formData.append(k, v))
            const { data } = await axios.post("/api/store/create", formData, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message || "Applied! Waiting for approval.")
            setAlreadySubmitted(true)
            setStatus("pending")
        } catch (err) {
            toast.error(err?.response?.data?.error || err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (!user) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "#f5f5f7", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                    <StoreIcon size={36} style={{ color: "rgba(0,0,0,0.24)" }} />
                </div>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "24px", fontWeight: 700, color: "#1d1d1f", marginBottom: "8px" }}>Sign in to create a store</h1>
                <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.48)" }}>You need an account to become a seller on GoCart.</p>
            </div>
        )
    }

    if (loading) return <Loading />

    // Already applied
    if (alreadySubmitted) {
        const isApproved = status === "approved"
        const isRejected = status === "rejected"
        const Icon   = isApproved ? CheckCircle2Icon : isRejected ? XCircleIcon : ClockIcon
        const color  = isApproved ? "#34c759"        : isRejected ? "#ff3b30"   : "#ff9500"
        const title  = isApproved ? "Store is Live! 🚀"   : isRejected ? "Application Rejected" : "Application Pending..."
        const desc   = isApproved ? "You will be redirected to your dashboard shortly."
            : isRejected ? "Your application was not approved. Contact support for details."
            : "We're reviewing your store application. You'll hear from us soon."

        return (
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <div style={{ width: "96px", height: "96px", backgroundColor: color + "18", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                    <Icon size={48} style={{ color }} />
                </div>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "26px", fontWeight: 700, color: "#1d1d1f", marginBottom: "10px", maxWidth: "400px" }}>{title}</h1>
                <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.48)", maxWidth: "360px", lineHeight: 1.6 }}>{desc}</p>
                {isApproved && (
                    <div style={{ marginTop: "20px", width: "200px", height: "4px", backgroundColor: "#f5f5f7", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", backgroundColor: "#34c759", borderRadius: "2px", animation: "progressFill 4s linear forwards" }} />
                    </div>
                )}
                <style>{`@keyframes progressFill { from { width:0% } to { width:100% } }`}</style>
            </div>
        )
    }

    // Create form
    return (
        <div style={{ backgroundColor: "#fff", minHeight: "80vh" }}>
            <div style={{ maxWidth: "640px", margin: "0 auto", padding: "64px 20px" }}>
                {/* Header */}
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(0,113,227,0.08)", border: "1px solid rgba(0,113,227,0.2)", borderRadius: "980px", padding: "5px 14px", marginBottom: "20px" }}>
                        <StoreIcon size={12} style={{ color: "#0071e3" }} />
                        <span style={{ fontSize: "11px", color: "#0071e3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Become a Seller</span>
                    </div>
                    <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: "10px" }}>
                        Create Your Store
                    </h1>
                    <p style={{ fontSize: "16px", color: "rgba(0,0,0,0.48)", lineHeight: 1.6 }}>
                        Submit your store details for review. Your store will be activated after admin verification — usually within 24 hours.
                    </p>
                </div>

                <form onSubmit={(e) => toast.promise(onSubmit(e), { loading: "Submitting…", success: "Done!", error: (err) => err.message })} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Logo upload */}
                    <div>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>Store Logo</p>
                        <label htmlFor="store-logo" style={{ display: "inline-flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
                            <div style={{ width: "80px", height: "80px", backgroundColor: "#f5f5f7", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: `2px dashed ${storeInfo.image ? "#34c759" : "rgba(0,0,0,0.12)"}`, flexShrink: 0, transition: "border-color 0.15s", position: "relative" }}
                                onMouseEnter={(e) => { if (!storeInfo.image) e.currentTarget.style.borderColor = "#0071e3"; }}
                                onMouseLeave={(e) => { if (!storeInfo.image) e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
                            >
                                {storeInfo.image
                                    ? <Image src={URL.createObjectURL(storeInfo.image)} alt="Store logo" fill style={{ objectFit: "cover" }} />
                                    : <UploadCloudIcon size={28} style={{ color: "rgba(0,0,0,0.2)" }} />
                                }
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", color: "#0066cc", fontWeight: 500 }}>Upload logo</p>
                                <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)" }}>PNG, JPG up to 5MB</p>
                            </div>
                            <input id="store-logo" type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>
                    </div>

                    {/* 2-col grid fields */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        {FIELDS_ROW.map((f) => (
                            <div key={f.name}>
                                <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>{f.label}</label>
                                <input name={f.name} type={f.type} value={storeInfo[f.name]} onChange={onChange} placeholder={f.placeholder}
                                    style={inputStyle} required
                                    onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.2)"; e.currentTarget.style.borderColor = "#0071e3"; }}
                                    onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Full-width textareas */}
                    {FIELDS_FULL.map((f) => (
                        <div key={f.name}>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>{f.label}</label>
                            <textarea name={f.name} value={storeInfo[f.name]} onChange={onChange} placeholder={f.placeholder} rows={f.rows}
                                style={{ ...inputStyle, resize: "none" }} required
                                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.2)"; e.currentTarget.style.borderColor = "#0071e3"; }}
                                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
                            />
                        </div>
                    ))}

                    <button type="submit" disabled={submitting}
                        style={{ backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "980px", padding: "14px", fontSize: "17px", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, letterSpacing: "-0.2px", transition: "transform 0.15s, box-shadow 0.15s, background-color 0.15s", boxShadow: "0 0 0 rgba(0,113,227,0)" }}
                        onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,113,227,0.4)"; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        {submitting ? "Submitting…" : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    )
}