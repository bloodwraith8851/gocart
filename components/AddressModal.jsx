'use client'
import { XIcon } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addAddress } from "@/lib/features/address/addressSlice"

const FIELDS = [
    { name: 'name',    label: 'Full Name',    type: 'text',  placeholder: 'John Doe',         col: 2 },
    { name: 'email',   label: 'Email',        type: 'email', placeholder: 'john@example.com', col: 2 },
    { name: 'street',  label: 'Street',       type: 'text',  placeholder: '123 Main St',      col: 2 },
    { name: 'city',    label: 'City',         type: 'text',  placeholder: 'New York',         col: 1 },
    { name: 'state',   label: 'State',        type: 'text',  placeholder: 'NY',               col: 1 },
    { name: 'zip',     label: 'ZIP Code',     type: 'text',  placeholder: '10001',            col: 1 },
    { name: 'country', label: 'Country',      type: 'text',  placeholder: 'United States',    col: 1 },
    { name: 'phone',   label: 'Phone',        type: 'tel',   placeholder: '+1 234 567 8900',  col: 2 },
];

const inputStyle = {
    width: "100%", backgroundColor: "#fafafc",
    border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px",
    padding: "10px 14px", fontSize: "14px", outline: "none",
    fontFamily: "inherit", color: "#1d1d1f",
};

export default function AddressModal({ setShowAddressModal }) {
    const dispatch = useDispatch()
    const [address, setAddress] = useState({ name: '', email: '', street: '', city: '', state: '', zip: '', country: '', phone: '' })
    const [saving,  setSaving]  = useState(false)

    const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res  = await fetch('/api/user/address', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(address),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to save')
            dispatch(addAddress(data.address))
            toast.success('Address saved!')
            setShowAddressModal(false)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 100,
                backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddressModal(false) }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: "#fff", borderRadius: "16px", padding: "32px",
                    width: "100%", maxWidth: "480px", position: "relative",
                    boxShadow: "rgba(0,0,0,0.2) 0 20px 60px",
                }}
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)" }}
                >
                    <XIcon size={20} />
                </button>

                <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "21px", fontWeight: 700, color: "#1d1d1f", marginBottom: "24px" }}>
                    Add Address
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {FIELDS.map((f) => (
                        <div key={f.name} style={{ gridColumn: `span ${f.col}` }}>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "5px" }}>
                                {f.label}
                            </label>
                            <input
                                name={f.name}
                                type={f.type}
                                value={address[f.name]}
                                onChange={handleChange}
                                placeholder={f.placeholder}
                                style={inputStyle}
                                required
                                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0071e3"; e.currentTarget.style.borderColor = "transparent"; }}
                                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
                            />
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        width: "100%", backgroundColor: "#0071e3", color: "#fff",
                        border: "none", borderRadius: "980px", padding: "13px",
                        fontSize: "15px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.6 : 1, marginTop: "20px",
                    }}
                >
                    {saving ? "Saving…" : "Save Address"}
                </button>
            </form>
        </div>
    )
}