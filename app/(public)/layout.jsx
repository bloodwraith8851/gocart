'use client'
import { useEffect, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setProduct, setProductLoading, setProductError } from "@/lib/features/product/productSlice"
import { setAddresses } from "@/lib/features/address/addressSlice"
import { addToCart } from "@/lib/features/cart/cartSlice"
import Banner from "@/components/Banner"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useUser } from "@clerk/nextjs"
import { WishlistProvider } from "@/contexts/WishlistContext"

// ─── Module-level product cache (survives route changes, cleared after 60 s) ───────────────────
let productCache    = null
let productCacheTs  = 0
const CACHE_TTL_MS  = 60_000  // 60 seconds

export default function PublicLayout({ children }) {
    const dispatch    = useDispatch()
    const { user, isLoaded } = useUser()
    const { cartItems } = useSelector((state) => state.cart)
    const cartSyncRef = useRef(null)  // debounce timer ref

    // ─── Products — serve from module cache if fresh ──────────────────────────────────────────
    const loadProducts = useCallback(async () => {
        const now = Date.now()

        // Serve from memory cache if still fresh (avoids unnecessary fetch)
        if (productCache && now - productCacheTs < CACHE_TTL_MS) {
            dispatch(setProduct(productCache))
            return
        }

        dispatch(setProductLoading(true))
        try {
            const res  = await fetch("/api/products", {
                next:    { revalidate: 60 },
                headers: { "Cache-Control": "max-age=60, stale-while-revalidate=300" },
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            if (data.products) {
                productCache   = data.products   // update module cache
                productCacheTs = Date.now()
                dispatch(setProduct(data.products))
            } else {
                dispatch(setProductError("Failed to load products"))
            }
        } catch (err) {
            dispatch(setProductError(err.message || "Network error"))
        }
    }, [dispatch])

    // ─── User sync — parallel fetch of user + addresses ──────────────────────────────────────
    const syncUser = useCallback(async () => {
        if (!isLoaded || !user) return
        try {
            // Fire both requests in parallel — saves one full round-trip
            const [userRes, addrRes] = await Promise.all([
                fetch("/api/user"),
                fetch("/api/user/address"),
            ])

            const [userData, addrData] = await Promise.all([
                userRes.json(),
                addrRes.json(),
            ])

            if (addrData.addresses) dispatch(setAddresses(addrData.addresses))

            // Restore persisted cart only if local cart is empty
            const savedCart  = userData.user?.cart
            const isCartEmpty = Object.keys(cartItems).length === 0
            if (isCartEmpty && savedCart && typeof savedCart === "object") {
                for (const [productId, qty] of Object.entries(savedCart)) {
                    for (let i = 0; i < Number(qty); i++) {
                        dispatch(addToCart({ productId }))
                    }
                }
            }
        } catch (err) {
            console.error("User sync error:", err)
        }
    }, [isLoaded, user, dispatch])  // intentionally omit cartItems to avoid loop

    // ─── Fire products + user sync IN PARALLEL on mount ──────────────────────────────────────
    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    useEffect(() => {
        if (isLoaded) syncUser()
    }, [isLoaded, syncUser])

    // ─── Debounced cart persistence — 800 ms after last change ───────────────────────────────
    useEffect(() => {
        if (!user || !isLoaded) return
        if (cartSyncRef.current) clearTimeout(cartSyncRef.current)
        cartSyncRef.current = setTimeout(async () => {
            try {
                await fetch("/api/user/cart", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ cart: cartItems }),
                })
            } catch { /* silent — cart will sync on next load */ }
        }, 800)
        return () => { if (cartSyncRef.current) clearTimeout(cartSyncRef.current) }
    }, [cartItems, user, isLoaded])

    return (
        <WishlistProvider>
            <Banner />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </WishlistProvider>
    )
}
