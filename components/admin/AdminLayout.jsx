'use client'
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { useUser } from "@clerk/nextjs"

// ──────────────────────────────────────────────────────────────────────────
// DEMO MODE: Any signed-in user can access admin.
// For production, set NEXT_PUBLIC_ADMIN_USER_ID in .env.local
// ──────────────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }) {
    const { user, isLoaded } = useUser()

    if (!isLoaded) return <Loading />

    // If NEXT_PUBLIC_ADMIN_USER_ID is set, enforce it.
    // Otherwise any signed-in user gets admin access (demo mode).
    const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
    const isSignedIn = !!user
    const isAdmin = adminId
        ? (user?.id === adminId)
        : isSignedIn   // ← demo mode: any signed-in user

    if (!isSignedIn) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "18px", backgroundColor: "rgba(0,113,227,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                    <span style={{ fontSize: "32px" }}>🔐</span>
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: 600, color: "rgba(255,255,255,0.86)", marginBottom: "8px" }}>
                    Sign in to continue
                </h1>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.36)" }}>
                    You need to be signed in to access the admin panel.
                </p>
                <Link href="/" style={{ marginTop: "28px", backgroundColor: "#0071e3", color: "#fff", textDecoration: "none", borderRadius: "980px", padding: "12px 28px", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Go Home <ArrowRightIcon size={15} />
                </Link>
            </div>
        )
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", flexDirection: "column" }}>
            <AdminNavbar />
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <AdminSidebar />
                <main style={{ flex: 1, overflowY: "auto", padding: "40px 48px" }}>
                    {children}
                </main>
            </div>
        </div>
    )
}