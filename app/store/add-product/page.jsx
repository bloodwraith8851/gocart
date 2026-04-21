'use client'
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { UploadCloudIcon, PackagePlusIcon, XIcon } from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
    'Electronics', 'Headphones', 'Speakers', 'Watch', 'Earbuds',
    'Mouse', 'Camera', 'Keyboard', 'Monitor', 'Clothing',
    'Home & Kitchen', 'Beauty & Health', 'Toys & Games',
    'Sports & Outdoors', 'Books & Media', 'Others',
]

const inp = {
    width: "100%", backgroundColor: "#0d0d0f",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "9px", padding: "11px 14px",
    fontSize: "14px", color: "#fff",
    fontFamily: "'Inter',sans-serif", outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
}

const focusIn  = (e) => { e.target.style.borderColor = "#0071e3"; e.target.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.2)"; }
const focusOut = (e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }

function Field({ label, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {label}
            </label>
            {children}
        </div>
    )
}

export default function StoreAddProduct() {
    const { getToken } = useAuth()

    const [images,      setImages]      = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({ name: "", description: "", mrp: "", price: "", category: "" })
    const [loading,     setLoading]     = useState(false)

    const onChange = (e) => setProductInfo({ ...productInfo, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token    = await getToken()
            const formData = new FormData()
            Object.entries(productInfo).forEach(([k, v]) => formData.append(k, v))
            Object.values(images).forEach((img) => { if (img) formData.append("images", img) })

            const { data } = await axios.post("/api/store/product", formData, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message || "Product added!")
            setProductInfo({ name: "", description: "", mrp: "", price: "", category: "" })
            setImages({ 1: null, 2: null, 3: null, 4: null })
        } catch (err) {
            toast.error(err?.response?.data?.error || err.message)
            throw err
        } finally { setLoading(false) }
    }

    return (
        <div style={{ animation: "fadein 0.4s ease", paddingBottom: "64px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "36px" }}>
                <div>
                    <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                        Add New Product
                    </h1>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.36)" }}>Fill in the details to list a new product in your store</p>
                </div>
                <Link href="/store/manage-product" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", transition: "color 0.15s, border-color 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                    ← View all products
                </Link>
            </div>

            <form onSubmit={(e) => toast.promise(onSubmit(e), { loading: "Adding product…", error: (err) => err.message })} style={{ maxWidth: "640px", display: "flex", flexDirection: "column", gap: "22px" }}>

                {/* Image upload grid */}
                <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "12px" }}>
                        Product Images (up to 4)
                    </label>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {Object.keys(images).map((key) => (
                            <label key={key} htmlFor={`img-${key}`} style={{
                                width: "100px", height: "100px",
                                backgroundColor: "#0d0d0f",
                                borderRadius: "12px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                                border: images[key] ? "2px solid rgba(0,113,227,0.5)" : "2px dashed rgba(255,255,255,0.1)",
                                overflow: "hidden",
                                position: "relative",
                                transition: "border-color 0.2s",
                            }}
                                onMouseEnter={(e) => { if (!images[key]) e.currentTarget.style.borderColor = "rgba(0,113,227,0.5)"; }}
                                onMouseLeave={(e) => { if (!images[key]) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                            >
                                {images[key] ? (
                                    <>
                                        <Image src={URL.createObjectURL(images[key])} alt="" fill style={{ objectFit: "cover" }} />
                                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImages({ ...images, [key]: null }); }}
                                            style={{ position: "absolute", top: "4px", right: "4px", backgroundColor: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                            <XIcon size={10} style={{ color: "#fff" }} />
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ textAlign: "center" }}>
                                        <UploadCloudIcon size={22} style={{ color: "rgba(255,255,255,0.2)", display: "block", margin: "0 auto 4px" }} />
                                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Photo {key}</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" id={`img-${key}`}
                                    onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Name */}
                <Field label="Product Name">
                    <input name="name" value={productInfo.name} onChange={onChange}
                        placeholder="e.g. Sony WH-1000XM5 Headphones"
                        style={inp} required onFocus={focusIn} onBlur={focusOut} />
                </Field>

                {/* Description */}
                <Field label="Description">
                    <textarea name="description" value={productInfo.description} onChange={onChange}
                        placeholder="Describe your product — key features, specs, what makes it great…"
                        rows={4} style={{ ...inp, resize: "vertical" }} required onFocus={focusIn} onBlur={focusOut} />
                </Field>

                {/* Price row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="MRP">
                        <input type="number" name="mrp" value={productInfo.mrp} onChange={onChange}
                            min={0} step="0.01" placeholder="99.99"
                            style={inp} required onFocus={focusIn} onBlur={focusOut} />
                    </Field>
                    <Field label="Offer Price">
                        <input type="number" name="price" value={productInfo.price} onChange={onChange}
                            min={0} step="0.01" placeholder="79.99"
                            style={inp} required onFocus={focusIn} onBlur={focusOut} />
                    </Field>
                </div>

                {/* Discount preview */}
                {productInfo.mrp && productInfo.price && Number(productInfo.mrp) > Number(productInfo.price) && (
                    <div style={{ backgroundColor: "rgba(52,199,89,0.08)", border: "1px solid rgba(52,199,89,0.2)", borderRadius: "10px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#34c759" }}>
                            ✓ Customers save {Math.round(((productInfo.mrp - productInfo.price) / productInfo.mrp) * 100)}% with this pricing
                        </span>
                    </div>
                )}

                {/* Category */}
                <Field label="Category">
                    <select value={productInfo.category} onChange={(e) => setProductInfo({ ...productInfo, category: e.target.value })}
                        style={{ ...inp, cursor: "pointer", colorScheme: "dark" }} required onFocus={focusIn} onBlur={focusOut}>
                        <option value="">Select a category…</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </Field>

                {/* Submit */}
                <button type="submit" disabled={loading}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#0071e3", color: "#fff", border: "none", borderRadius: "980px", padding: "14px 36px", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "transform 0.15s, box-shadow 0.15s", boxShadow: "0 0 0 rgba(0,113,227,0)", alignSelf: "flex-start" }}
                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,113,227,0.45)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                    <PackagePlusIcon size={17} />
                    {loading ? "Adding Product…" : "Add Product"}
                </button>
            </form>

            <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}