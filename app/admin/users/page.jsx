'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Search, MoreVertical, Shield } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { useScrollAnimation, staggerCards } from '@/hooks/useScrollAnimation'

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const tableRef = useRef(null)

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data.users || [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

    useScrollAnimation((ref) => {
        if (!loading && filtered.length > 0) {
            staggerCards('.user-row', { y: 15, duration: 0.4 })
        }
    }, [loading, filtered.length])

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.5px" }}>Users Management</h1>
                    <p style={{ color: "rgba(0,0,0,0.5)" }}>{users.length} registered users on platform.</p>
                </div>
                <div style={{ position: "relative", width: "300px" }}>
                    <Search size={16} color="rgba(0,0,0,0.4)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..." 
                        style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#fff", outline: "none", fontSize: "14px" }}
                    />
                </div>
            </div>

            <div className="glass-card-light" style={{ overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ backgroundColor: "rgba(0,0,0,0.02)", color: "rgba(0,0,0,0.5)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                <th style={{ padding: "16px 24px", fontWeight: 600 }}>User</th>
                                <th style={{ padding: "16px 24px", fontWeight: 600 }}>Role</th>
                                <th style={{ padding: "16px 24px", fontWeight: 600 }}>Orders</th>
                                <th style={{ padding: "16px 24px", fontWeight: 600 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody ref={tableRef}>
                            {loading ? (
                                Array(5).fill(null).map((_, i) => (
                                    <tr key={i} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                                        <td style={{ padding: "16px 24px" }}><div className="skeleton" style={{ width: "100%", height: "40px" }} /></td>
                                        <td style={{ padding: "16px 24px" }}><div className="skeleton" style={{ width: "60px", height: "20px" }} /></td>
                                        <td style={{ padding: "16px 24px" }}><div className="skeleton" style={{ width: "40px", height: "20px" }} /></td>
                                        <td style={{ padding: "16px 24px" }}><div className="skeleton" style={{ width: "30px", height: "20px" }} /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "rgba(0,0,0,0.5)" }}>No users found matching "{search}"</td>
                                </tr>
                            ) : (
                                filtered.map(u => (
                                    <tr key={u.id} className="user-row" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", transition: "background-color 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                                        <td style={{ padding: "16px 24px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#f5f5f7" }}>
                                                    {u.image ? <Image src={u.image} alt={u.name} width={40} height={40} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "rgba(0,0,0,0.3)" }}>{u.name.charAt(0)}</div>}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "14px", marginBottom: "2px" }}>{u.name}</p>
                                                    <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "13px" }}>{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "980px", fontSize: "12px", fontWeight: 700, backgroundColor: u.email === 'admin@gocart.com' ? "rgba(0,113,227,0.1)" : "rgba(0,0,0,0.05)", color: u.email === 'admin@gocart.com' ? "#0071e3" : "rgba(0,0,0,0.6)" }}>
                                                {u.email === 'admin@gocart.com' && <Shield size={12} />}
                                                {u.email === 'admin@gocart.com' ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <span style={{ fontWeight: 600, color: "#1d1d1f" }}>{u._count.buyerOrders}</span>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)" }}>
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
