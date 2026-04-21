'use client'
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { HomeIcon, LayoutListIcon, SquarePenIcon, SquarePlusIcon, ArrowLeftIcon, StoreIcon } from "lucide-react"

const LINKS = [
    { name: "Dashboard",       href: "/store",                Icon: HomeIcon,       color: "#0071e3" },
    { name: "Add Product",     href: "/store/add-product",    Icon: SquarePlusIcon, color: "#34c759" },
    { name: "Manage Products", href: "/store/manage-product", Icon: SquarePenIcon,  color: "#5ac8fa" },
    { name: "Orders",          href: "/store/orders",         Icon: LayoutListIcon, color: "#ff9500" },
]

export default function StoreSidebar({ storeInfo }) {
    const pathname = usePathname()

    return (
        <aside style={{
            width: "220px", minWidth: "220px",
            backgroundColor: "#0a0a0c",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexDirection: "column",
            height: "100%",
        }}>
            {/* Store card */}
            {storeInfo ? (
                <div style={{ padding: "16px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#1c1c1e", border: "1.5px solid rgba(0,113,227,0.35)" }}>
                        {storeInfo.logo
                            ? <Image src={storeInfo.logo} alt={storeInfo.name} width={40} height={40} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><StoreIcon size={18} style={{ color: "rgba(255,255,255,0.2)" }} /></div>
                        }
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {storeInfo.name}
                        </p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.36)", marginTop: "2px" }}>@{storeInfo.username}</p>
                    </div>
                </div>
            ) : (
                <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(0,113,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <StoreIcon size={18} style={{ color: "#0071e3" }} />
                    </div>
                </div>
            )}

            {/* Section label */}
            <div style={{ padding: "16px 20px 8px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Store
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

            {/* Back link */}
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
                    <ArrowLeftIcon size={13} /> Back to Store
                </Link>
            </div>
        </aside>
    )
}