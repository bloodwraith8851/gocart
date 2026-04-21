'use client'
import { createContext, useContext, useEffect, useState } from "react"

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([])

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("gocart_wishlist")
            if (stored) setWishlist(JSON.parse(stored))
        } catch { }
    }, [])

    // Persist whenever wishlist changes
    useEffect(() => {
        try {
            localStorage.setItem("gocart_wishlist", JSON.stringify(wishlist))
        } catch { }
    }, [wishlist])

    const toggle = (product) => {
        setWishlist((prev) => {
            const exists = prev.find((p) => p.id === product.id)
            return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product]
        })
    }

    const isWishlisted = (productId) => wishlist.some((p) => p.id === productId)

    return (
        <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
    const ctx = useContext(WishlistContext)
    if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider")
    return ctx
}
