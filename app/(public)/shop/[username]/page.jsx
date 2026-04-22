'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { gsap } from '@/lib/gsap'
import { useScrollAnimation, parallax, staggerCards } from '@/hooks/useScrollAnimation'
import toast from 'react-hot-toast'
import SkeletonCard from '@/components/SkeletonCard'
import { MapPin, CalendarDays, Store as StoreIcon } from 'lucide-react'

export default function SellerStorePage() {
    const { username } = useParams()
    const { list: allProducts } = useSelector(state => state.product)
    
    const [store, setStore] = useState(null)
    const [loading, setLoading] = useState(true)
    const [following, setFollowing] = useState(false)

    const bannerRef = useRef(null)
    const gridRef = useRef(null)

    useEffect(() => {
        fetch(`/api/store/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.store) setStore(data.store)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
            
        // Check local storage for follow
        if (typeof window !== 'undefined') {
            const follows = JSON.parse(localStorage.getItem('gocart_follows') || '[]')
            setFollowing(follows.includes(username))
        }
    }, [username])

    const storeProducts = store ? allProducts.filter(p => p.storeId === store.id) : []

    // GSAP Parallax on Banner
    useScrollAnimation((ref) => {
        parallax(ref, { speed: 0.4 })
    }, [])

    useScrollAnimation((ref) => {
        if (!loading) {
            gsap.fromTo('.store-info-fade', 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            )
            if (gridRef.current) staggerCards('.product-card-el', gridRef)
        }
    }, [loading, storeProducts.length])

    const toggleFollow = () => {
        if (typeof window !== 'undefined') {
            let follows = JSON.parse(localStorage.getItem('gocart_follows') || '[]')
            if (following) {
                follows = follows.filter(u => u !== username)
                toast('Unfollowed store')
            } else {
                follows.push(username)
                toast.success('Following store!')
            }
            localStorage.setItem('gocart_follows', JSON.stringify(follows))
            setFollowing(!following)
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: "80vh" }}>
                <div className="skeleton" style={{ height: "300px", width: "100%" }} />
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
                    <div className="skeleton" style={{ width: "120px", height: "120px", borderRadius: "50%", marginTop: "-100px", marginBottom: "20px" }} />
                    <div className="skeleton" style={{ height: "32px", width: "240px", marginBottom: "40px" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
                        {Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </div>
        )
    }

    if (!store) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <StoreIcon size={48} color="rgba(0,0,0,0.2)" style={{ marginBottom: "24px" }} />
                <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px" }}>Store not found</h1>
                <p style={{ color: "rgba(0,0,0,0.5)" }}>The seller profile you're looking for doesn't exist.</p>
            </div>
        )
    }

    const joinYear = new Date(store.createdAt).getFullYear()

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fff" }}>
            {/* Parallax Banner */}
            <div style={{ height: "320px", overflow: "hidden", position: "relative", backgroundColor: "#1c1c1e" }}>
                <div ref={bannerRef} style={{ position: "absolute", top: "-20%", left: "-10%", right: "-10%", bottom: "-20%", background: "radial-gradient(circle at center, #0071e3 0%, #000 70%)", opacity: 0.4 }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "160px", background: "linear-gradient(to top, #fff, transparent)" }} />
            </div>

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 80px" }}>
                {/* Store Header */}
                <div style={{ position: "relative", marginTop: "-60px", marginBottom: "48px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
                    <div className="store-info-fade" style={{ display: "flex", alignItems: "flex-end", gap: "24px" }}>
                        <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#fff", border: "4px solid #fff", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden", position: "relative", zIndex: 10 }}>
                            <Image src={store.logo || '/default-avatar.png'} alt={store.name} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div style={{ paddingBottom: "12px" }}>
                            <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1 }}>{store.name}</h1>
                            <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.5)", marginTop: "4px" }}>@{store.username}</p>
                        </div>
                    </div>

                    <div className="store-info-fade" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "rgba(0,0,0,0.5)", fontSize: "13px", fontWeight: 500 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14}/> {store.address || "Global"}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CalendarDays size={14}/> Joined {joinYear}</span>
                        </div>
                        <button 
                            onClick={toggleFollow} 
                            className={following ? "btn-ghost" : "btn-primary"} 
                            style={following ? { borderColor: "#0071e3", color: "#0071e3", padding: "10px 24px"} : { padding: "10px 24px" }}
                        >
                            {following ? "Following" : "Follow Store"}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
                    <aside className="store-info-fade" style={{ width: "300px", flexShrink: 0 }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.4)", marginBottom: "16px" }}>About</h3>
                        <p style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(0,0,0,0.8)" }}>
                            {store.description || "Welcome to our store! We offer high quality products and excellent customer service."}
                        </p>
                    </aside>

                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <h3 className="store-info-fade" style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            Store Products
                            <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(0,0,0,0.4)" }}>{storeProducts.length} items</span>
                        </h3>
                        
                        <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
                            {storeProducts.length > 0 ? (
                                storeProducts.map(p => <ProductCard key={p.id} product={p} staggerMode />)
                            ) : (
                                <p style={{ color: "rgba(0,0,0,0.5)", gridColumn: "1/-1" }}>No products published yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}