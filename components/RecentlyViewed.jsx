'use client'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import { gsap } from '@/lib/gsap'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function RecentlyViewed({ dark = false }) {
    const [viewedItems, setViewedItems] = useState([])
    const { list: allProducts } = useSelector(state => state.product)
    const scrollContainerRef = useRef(null)

    useEffect(() => {
        const stored = localStorage.getItem('gocart_recent_views')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // Filter out items older than 7 days
                const now = Date.now()
                const recent = parsed.filter(item => (now - item.timestamp) < 7 * 24 * 60 * 60 * 1000)
                
                // Map to actual products
                const ids = recent.map(r => r.id)
                const products = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean)
                
                setViewedItems(products)
            } catch (e) {
                console.error('Failed to parse recent views', e)
            }
        }
    }, [allProducts])

    // GSAP Reveal
    const sectionRef = useScrollAnimation((ref) => {
        gsap.fromTo(ref, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: ref, start: 'top 85%' } }
        )
    }, [])

    if (viewedItems.length === 0) return null

    return (
        <section ref={sectionRef} style={{ padding: "60px 0", borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, backgroundColor: dark ? "#000" : "#fff" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: dark ? "#fff" : "#1d1d1f", marginBottom: "32px", letterSpacing: "-0.5px" }}>Recently Viewed</h2>
                
                <div ref={scrollContainerRef} className="h-scroll-track no-scrollbar" style={{ paddingBottom: "20px" }}>
                    {viewedItems.map(p => (
                        <div key={p.id} style={{ width: "240px", flexShrink: 0 }}>
                            <ProductCard product={p} dark={dark} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Helper to push a view
export function pushRecentView(productId) {
    if (!productId) return
    if (typeof window === 'undefined') return
    try {
        const stored = localStorage.getItem('gocart_recent_views')
        let parsed = stored ? JSON.parse(stored) : []
        
        // Remove if already exists to push to front
        parsed = parsed.filter(item => item.id !== productId)
        parsed.unshift({ id: productId, timestamp: Date.now() })
        
        // Keep only last 10
        if (parsed.length > 10) parsed = parsed.slice(0, 10)
        
        localStorage.setItem('gocart_recent_views', JSON.stringify(parsed))
    } catch (e) {
        console.error('Failed to update recent views', e)
    }
}
