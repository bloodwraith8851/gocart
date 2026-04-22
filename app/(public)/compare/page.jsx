'use client'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingCartIcon, Check, X } from 'lucide-react'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'
import { gsap } from '@/lib/gsap'

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

export default function ComparePage() {
    const dispatch = useDispatch()
    const { list: allProducts } = useSelector(state => state.product)
    const [compareItems, setCompareItems] = useState([])
    const tableRef = useRef(null)

    useEffect(() => {
        const stored = localStorage.getItem('gocart_compare')
        if (stored && allProducts.length > 0) {
            try {
                const ids = JSON.parse(stored)
                const items = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean)
                setCompareItems(items)
            } catch (e) {
                console.error(e)
            }
        }
    }, [allProducts])

    useEffect(() => {
        if (compareItems.length > 0 && tableRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.compare-col', 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                )
            }, tableRef)
            return () => ctx.revert()
        }
    }, [compareItems.length])

    const removeFromCompare = (id) => {
        const newItems = compareItems.filter(p => p.id !== id)
        setCompareItems(newItems)
        localStorage.setItem('gocart_compare', JSON.stringify(newItems.map(p => p.id)))
    }

    const clearCompare = () => {
        setCompareItems([])
        localStorage.removeItem('gocart_compare')
    }

    const handleAddToCart = (product) => {
        if (!product.inStock) return toast.error('Out of stock')
        dispatch(addToCart({ productId: product.id }))
        toast.success('Added to Cart')
    }

    if (compareItems.length === 0) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px" }}>Compare Products</h1>
                <p style={{ color: "rgba(0,0,0,0.5)", marginBottom: "32px", maxWidth: "340px" }}>Add items to your compare list to see them side-by-side.</p>
                <Link href="/shop" className="btn-primary">Browse Shop</Link>
            </div>
        )
    }

    // Collect all unique spec keys if we had them, but standard Schema: name, price, stock, rating, category, desc
    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fff", padding: "48px 20px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                    <div>
                        <h1 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-1px" }}>Compare</h1>
                        <p style={{ color: "rgba(0,0,0,0.5)" }}>{compareItems.length} products selected</p>
                    </div>
                    <button onClick={clearCompare} className="btn-ghost" style={{ padding: "8px 16px", fontSize: "14px", color: "#ff3b30", borderColor: "rgba(255,59,48,0.2)" }}>
                        Clear All
                    </button>
                </div>

                <div ref={tableRef} style={{ display: "flex", overflowX: "auto", paddingBottom: "24px" }} className="no-scrollbar">
                    {/* Fixed labels column */}
                    <div style={{ width: "160px", flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(0,0,0,0.08)", paddingTop: "260px" }}>
                        <div style={{ padding: "16px", height: "60px", display: "flex", alignItems: "center", fontWeight: 700, fontSize: "14px", backgroundColor: "#f5f5f7", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>Price</div>
                        <div style={{ padding: "16px", height: "60px", display: "flex", alignItems: "center", fontWeight: 700, fontSize: "14px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>Category</div>
                        <div style={{ padding: "16px", height: "60px", display: "flex", alignItems: "center", fontWeight: 700, fontSize: "14px", backgroundColor: "#f5f5f7", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>Availability</div>
                        <div style={{ padding: "16px", flex: 1, fontWeight: 700, fontSize: "14px", minHeight: "120px" }}>Description</div>
                    </div>

                    {/* Product columns */}
                    {compareItems.map(p => (
                        <div key={p.id} className="compare-col" style={{ width: "280px", flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(0,0,0,0.08)" }}>
                            
                            {/* Header (Image + Name + Buttons) */}
                            <div style={{ height: "260px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
                                <button onClick={() => removeFromCompare(p.id)} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", color: "rgba(0,0,0,0.3)", cursor: "pointer" }}>
                                    <X size={20} />
                                </button>
                                <div style={{ width: "120px", height: "120px", background: "#f5f5f7", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", padding: "12px" }}>
                                    <Image src={p.images[0]} alt={p.name} width={100} height={100} style={{ objectFit: "contain" }} />
                                </div>
                                <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.3 }}>{p.name}</h3>
                                <button onClick={() => handleAddToCart(p)} disabled={!p.inStock} className="btn-primary" style={{ padding: "8px 24px", fontSize: "13px", height: "auto", minHeight: "36px", marginTop: "auto" }}>
                                    <ShoppingCartIcon size={14} /> Add
                                </button>
                            </div>

                            {/* Data Rows */}
                            <div style={{ padding: "16px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, backgroundColor: "#f5f5f7", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                {currency}{p.price}
                            </div>
                            <div style={{ padding: "16px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                {p.category}
                            </div>
                            <div style={{ padding: "16px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", backgroundColor: "#f5f5f7", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                {p.inStock ? <span style={{ color: "#34c759", display: "flex", alignItems: "center", gap: "4px" }}><Check size={14}/> In Stock</span> : <span style={{ color: "#ff3b30" }}>Out of Stock</span>}
                            </div>
                            <div style={{ padding: "16px", flex: 1, fontSize: "14px", color: "rgba(0,0,0,0.6)", minHeight: "120px", lineHeight: 1.5 }}>
                                {p.description || "No description provided."}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Global helper
export function toggleCompare(productId) {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('gocart_compare')
    let parsed = stored ? JSON.parse(stored) : []
    
    if (parsed.includes(productId)) {
        parsed = parsed.filter(id => id !== productId)
        toast('Removed from Compare', { icon: '🗑️' })
    } else {
        if (parsed.length >= 4) {
            return toast.error('You can only compare up to 4 items.')
        }
        parsed.push(productId)
        toast.success('Added to Compare')
    }
    localStorage.setItem('gocart_compare', JSON.stringify(parsed))
}
