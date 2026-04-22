'use client'
import { usePathname } from "next/navigation"
import Link from "next/link"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon, ArrowLeftIcon, UsersIcon } from "lucide-react"

const LINKS = [
    { name: "Dashboard",     href: "/admin",         Icon: HomeIcon,          color: "#0071e3" },
    { name: "Users",         href: "/admin/users",   Icon: UsersIcon,         color: "#5ac8fa" },
    { name: "Stores",        href: "/admin/stores",  Icon: StoreIcon,         color: "#ff9500" },
    { name: "Approve Store", href: "/admin/approve", Icon: ShieldCheckIcon,   color: "#34c759" },
    { name: "Coupons",       href: "/admin/coupons", Icon: TicketPercentIcon, color: "#ff3b30" },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside style={{
            width: "220px", minWidth: "220px",
            backgroundColor: "#0a0a0c",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexDirection: "column",
            height: "100%",
        }}>
            {/* Section label */}
            <div style={{ padding: "20px 20px 10px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Admin Panel
                </p>
            </div>

            {/* Nav */}
            <nav style={{ padding: "4px 10px", flex: 1 }}>
                {LINKS.map(({ name, href, Icon, color }) => {
                    const active = pathname === href
                    return (
                        <Link key={href} href={href} style={{
                            display: "flex", alignItems: "center", gap: "11px",
                            padding: "10px 12px", borderRadius: "10px", marginBottom: "2px",
                            color: active ? "#fff" : "rgba(255,255,255,0.45)",
                            backgroundColor: active ? "rgba(255,255,255,0.07)" : "transparent",
                            fontWeight: active ? 600 : 400,
                            fontSize: "14px", textDecoration: "none",
                            transition: "background-color 0.15s, color 0.15s",
                        }}
                            onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; } }}
                            onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
                        >
                            {/* Icon with color tint when active */}
                            <div style={{
                                width: "28px", height: "28px", borderRadius: "7px", flexShrink: 0,
                                backgroundColor: active ? `${color}18` : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "background-color 0.15s",
                            }}>
                                <Icon size={15} style={{ color: active ? color : "rgba(255,255,255,0.3)" }} />
                            </div>
                            {name}
                            {active && (
                                <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom — back to store */}
            <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <Link href="/" style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "9px 12px", borderRadius: "10px",
                    color: "rgba(255,255,255,0.3)", fontSize: "13px",
                    textDecoration: "none", transition: "color 0.15s, background-color 0.15s",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                    <ArrowLeftIcon size={13} />
                    Back to Store
                </Link>
            </div>
        </aside>
    )
}