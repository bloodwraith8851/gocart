'use client'
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function AdminNavbar() {
    return (
        <header style={{
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            height: "48px", display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 24px",
            position: "sticky", top: 0, zIndex: 40,
        }}>
            <Link href="/" style={{ fontWeight: 700, color: "#fff", fontSize: "15px", letterSpacing: "-0.2px", textDecoration: "none" }}>
                GoCart<span style={{ color: "#0071e3" }}>.</span>
                <span style={{ color: "rgba(255,255,255,0.32)", fontWeight: 400, marginLeft: "8px", fontSize: "12px" }}>Admin</span>
            </Link>
            <UserButton />
        </header>
    )
}