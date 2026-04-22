'use client'
import Counter from "@/components/Counter"
import { deleteItemFromCart, clearCart } from "@/lib/features/cart/cartSlice"
import { Trash2Icon, ShoppingBagIcon, CheckCircle2Icon, MapPinIcon, CreditCardIcon, LogInIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useScrollAnimation, staggerCards } from "@/hooks/useScrollAnimation"
import { gsap } from "@/lib/gsap"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { addAddress } from "@/lib/features/address/addressSlice"

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

export default function CartCheckout() {
    const { user, isLoaded } = useUser()
    const { openSignIn } = useClerk()
    const router = useRouter()
    const dispatch = useDispatch()

    const { cartItems } = useSelector((state) => state.cart)
    const products = useSelector((state) => state.product.list)
    const addressList = useSelector((state) => state.address.list)

    const [cartArray, setCartArray] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    // Checkout State
    const [step, setStep] = useState(1) // 1: Cart, 2: Delivery, 3: Confirm, 4: Success
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [newAddress, setNewAddress] = useState({ name: '', email: '', street: '', city: '', state: '', zip: '', country: '', phone: '' })
    
    const [couponInput, setCouponInput] = useState('')
    const [coupon, setCoupon] = useState(null)
    const [couponLoading, setCouponLoading] = useState(false)
    
    const [placing, setPlacing] = useState(false)

    // Refs for GSAP
    const containerRef = useRef(null)
    const step1Ref = useRef(null)
    const step2Ref = useRef(null)
    const step3Ref = useRef(null)
    const successRef = useRef(null)

    const discount = coupon ? (coupon.discount / 100) * totalPrice : 0
    const finalTotal = totalPrice - discount

    useEffect(() => {
        let total = 0
        const arr = []
        for (const [id, qty] of Object.entries(cartItems)) {
            const p = products.find((p) => p.id === id)
            if (p) { arr.push({ ...p, quantity: qty }); total += p.price * qty }
        }
        setCartArray(arr)
        setTotalPrice(total)
    }, [cartItems, products])

    // --- GSAP Transitions ---
    useLayoutEffect(() => {
        if (!containerRef.current) return
        const ctx = gsap.context(() => {
            gsap.fromTo('.checkout-step', 
                { opacity: 0, x: 40 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' }
            )
        }, containerRef)
        return () => ctx.revert()
    }, [step])

    useLayoutEffect(() => {
        if (step === 1 && step1Ref.current) {
            const ctx = gsap.context(() => staggerCards('.cart-item-row'), step1Ref)
            return () => ctx.revert()
        }
        if (step === 4 && successRef.current) {
            const ctx = gsap.context(() => {
                const tl = gsap.timeline()
                tl.fromTo('.success-icon', { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' })
                  .fromTo('.success-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, "-=0.2")
                  .fromTo('.success-btn', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 }, "-=0.1")
            }, successRef)
            return () => ctx.revert()
        }
    }, [step])

    // --- Handlers ---
    const applyCoupon = async (e) => {
        e.preventDefault()
        if (!couponInput.trim()) return
        setCouponLoading(true)
        try {
            const res = await fetch('/api/user/coupon', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponInput.trim() }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Invalid coupon')
            setCoupon(data.coupon)
            toast.success(`${data.coupon.discount}% discount applied!`)
            // GSAP flash effect on total
            gsap.fromTo('.final-total', { color: '#34c759', scale: 1.1 }, { color: '#fff', scale: 1, duration: 0.8 })
        } catch (err) {
            toast.error(err.message)
        } finally {
            setCouponLoading(false)
        }
    }

    const saveAddress = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/user/address', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddress),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to save')
            dispatch(addAddress(data.address))
            setSelectedAddress(data.address)
            setIsAddingAddress(false)
            toast.success('Address saved!')
        } catch (err) {
            toast.error(err.message)
        }
    }

    const placeOrder = async () => {
        if (!selectedAddress) return toast.error('Please select a delivery address')
        setPlacing(true)
        try {
            const res = await fetch('/api/order', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addressId: selectedAddress.id, paymentMethod, cartItems, couponCode: coupon?.code || null }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to place order')
            dispatch(clearCart())
            setStep(4) // Success Step
            toast.success('Order placed successfully!')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setPlacing(false)
        }
    }

    const handleNextStep = () => {
        if (step === 1) {
            if (!isLoaded) return
            if (!user) {
                toast("Please sign in to continue", { icon: "🔒" })
                openSignIn()
                return
            }
            if (!selectedAddress && addressList.length > 0) {
                setSelectedAddress(addressList[0])
            }
            setStep(2)
        } else if (step === 2) {
            if (!selectedAddress) return toast.error('Please select an address')
            setStep(3)
        }
    }

    // --- Empty State ---
    if (cartArray.length === 0 && step !== 4) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px", backgroundColor: "#000" }}>
                <div style={{ width: "88px", height: "88px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <ShoppingBagIcon size={40} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                    Your cart is empty
                </h1>
                <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.48)", maxWidth: "260px", lineHeight: 1.5 }}>
                    Browse our collection and add something you love.
                </p>
                <Link href="/shop" className="btn-primary" style={{ marginTop: "32px", borderRadius: "980px" }}>
                    Shop Now
                </Link>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: "#000", minHeight: "80vh", color: "#fff" }} ref={containerRef}>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 20px 80px" }}>
                
                {/* ── STEPPER INDICATOR ── */}
                {step < 4 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px", position: "relative" }}>
                        <div style={{ position: "absolute", top: "14px", left: "0", right: "0", display: "flex", zIndex: 0 }}>
                            <div className="step-line" style={{ background: step >= 2 ? "linear-gradient(90deg, #0071e3, #2997ff)" : "rgba(255,255,255,0.1)" }} />
                            <div className="step-line" style={{ background: step >= 3 ? "linear-gradient(90deg, #0071e3, #2997ff)" : "rgba(255,255,255,0.1)" }} />
                        </div>
                        
                        {['Review', 'Delivery', 'Confirm'].map((label, i) => {
                            const num = i + 1;
                            const active = step >= num;
                            const current = step === num;
                            return (
                                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 1 }}>
                                    <div style={{ 
                                        width: "28px", height: "28px", borderRadius: "50%", 
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700,
                                        backgroundColor: active ? "#0071e3" : "#1c1c1e",
                                        color: active ? "#fff" : "rgba(255,255,255,0.4)",
                                        border: `2px solid ${active ? "#0071e3" : "rgba(255,255,255,0.1)"}`,
                                        boxShadow: current ? "0 0 20px rgba(0,113,227,0.4)" : "none",
                                        transition: "all 0.3s ease"
                                    }}>
                                        {active && !current ? <CheckCircle2Icon size={14} /> : num}
                                    </div>
                                    <span style={{ fontSize: "12px", fontWeight: current ? 600 : 500, color: active ? "#fff" : "rgba(255,255,255,0.4)" }}>{label}</span>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="checkout-step">
                    {/* ── STEP 1: REVIEW CART ── */}
                    {step === 1 && (
                        <div ref={step1Ref}>
                            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>Review your bag.</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {cartArray.map((item) => (
                                    <div key={item.id} className="cart-item-row glass-card" style={{ display: "flex", gap: "20px", padding: "20px", alignItems: "center", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
                                        <div style={{ width: "96px", height: "96px", backgroundColor: "#fff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", flexShrink: 0 }}>
                                            <Image src={item.images[0]} alt={item.name} width={80} height={80} style={{ objectFit: "contain", maxHeight: "80px", width: "auto" }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: "200px" }}>
                                            <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{item.name}</h3>
                                            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>{item.category}</p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                                            <Counter productId={item.id} dark />
                                            <div style={{ width: "80px", textAlign: "right" }}>
                                                <div style={{ fontSize: "17px", fontWeight: 700 }}>{currency}{(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => dispatch(deleteItemFromCart({ productId: item.id }))}
                                            style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", transition: "color 0.2s" }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = "#ff3b30"}
                                            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                                        >
                                            <Trash2Icon size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: "24px", marginTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>Subtotal</p>
                                    <p style={{ fontSize: "24px", fontWeight: 800 }}>{currency}{totalPrice.toFixed(2)}</p>
                                </div>
                                <button onClick={handleNextStep} className="btn-primary" style={{ padding: "16px 36px", fontSize: "16px" }}>
                                    {!user ? <><LogInIcon size={18} /> Sign in to Checkout</> : "Continue"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: DELIVERY & PAYMENT ── */}
                    {step === 2 && (
                        <div ref={step2Ref}>
                            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>Delivery details.</h2>
                            
                            <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h3 style={{ fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}><MapPinIcon size={16} /> Shipping Address</h3>
                                    {!isAddingAddress && (
                                        <button onClick={() => setIsAddingAddress(true)} style={{ background: "none", border: "none", color: "#0071e3", fontSize: "13px", fontWeight: 600 }}>+ Add New</button>
                                    )}
                                </div>

                                {isAddingAddress ? (
                                    <form onSubmit={saveAddress} style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
                                        <input placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "8px", color: "#fff", fontSize: "14px" }} required />
                                        <input placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "8px", color: "#fff", fontSize: "14px" }} required />
                                        <div style={{ display: "flex", gap: "12px" }}>
                                            <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "8px", color: "#fff", fontSize: "14px" }} required />
                                            <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} style={{ width: "80px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "8px", color: "#fff", fontSize: "14px" }} required />
                                            <input placeholder="ZIP" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} style={{ width: "100px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "8px", color: "#fff", fontSize: "14px" }} required />
                                        </div>
                                        <div style={{ display: "flex", gap: "12px" }}>
                                            <input placeholder="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "8px", color: "#fff", fontSize: "14px" }} required />
                                            <input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "8px", color: "#fff", fontSize: "14px" }} required />
                                        </div>
                                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                            <button type="submit" className="btn-primary" style={{ padding: "10px 20px" }}>Save & Use</button>
                                            <button type="button" onClick={() => setIsAddingAddress(false)} className="btn-ghost" style={{ padding: "10px 20px" }}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {addressList.length === 0 ? (
                                            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>No addresses saved yet.</p>
                                        ) : (
                                            addressList.map(addr => (
                                                <div 
                                                    key={addr.id} 
                                                    onClick={() => setSelectedAddress(addr)}
                                                    style={{ 
                                                        padding: "16px", borderRadius: "12px", border: `1px solid ${selectedAddress?.id === addr.id ? "#0071e3" : "rgba(255,255,255,0.1)"}`,
                                                        backgroundColor: selectedAddress?.id === addr.id ? "rgba(0,113,227,0.1)" : "rgba(0,0,0,0.2)",
                                                        cursor: "pointer", transition: "all 0.2s"
                                                    }}
                                                >
                                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                        <span style={{ fontWeight: 600 }}>{addr.name}</span>
                                                        {selectedAddress?.id === addr.id && <CheckCircle2Icon size={16} color="#0071e3" />}
                                                    </div>
                                                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                                                        {addr.street}, {addr.city}, {addr.state} {addr.zip}<br/>
                                                        {addr.phone}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="glass-card" style={{ padding: "24px", marginBottom: "32px" }}>
                                <h3 style={{ fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}><CreditCardIcon size={16} /> Payment Method</h3>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    {['COD', 'STRIPE'].map(m => (
                                        <button 
                                            key={m} 
                                            onClick={() => setPaymentMethod(m)}
                                            style={{ 
                                                flex: 1, padding: "16px", borderRadius: "12px", 
                                                border: `1px solid ${paymentMethod === m ? "#0071e3" : "rgba(255,255,255,0.1)"}`,
                                                backgroundColor: paymentMethod === m ? "rgba(0,113,227,0.1)" : "rgba(0,0,0,0.2)",
                                                color: paymentMethod === m ? "#fff" : "rgba(255,255,255,0.6)",
                                                fontWeight: 600, transition: "all 0.2s", cursor: "pointer"
                                            }}
                                        >
                                            {m === 'COD' ? 'Cash on Delivery' : 'Credit Card (Stripe)'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <button onClick={() => setStep(1)} className="btn-ghost" style={{ border: "none" }}>← Back to Cart</button>
                                <button onClick={handleNextStep} className="btn-primary" style={{ padding: "14px 36px" }}>Review Order</button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: CONFIRM ── */}
                    {step === 3 && (
                        <div ref={step3Ref}>
                            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>Almost there.</h2>
                            
                            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
                                <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <div className="glass-card" style={{ padding: "24px" }}>
                                        <h3 style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Shipping To</h3>
                                        <p style={{ fontSize: "14px", lineHeight: 1.5 }}>
                                            <span style={{ fontWeight: 600, color: "#fff" }}>{selectedAddress?.name}</span><br />
                                            {selectedAddress?.street}<br />
                                            {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zip}
                                        </p>
                                    </div>
                                    <div className="glass-card" style={{ padding: "24px" }}>
                                        <h3 style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Payment</h3>
                                        <p style={{ fontSize: "14px", fontWeight: 600 }}>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Stripe / Credit Card'}</p>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ flex: "1 1 300px", padding: "24px", position: "sticky", top: "20px" }}>
                                    <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "20px" }}>Order Summary</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                                            <span>Subtotal ({cartArray.length} items)</span>
                                            <span>{currency}{totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                                            <span>Shipping</span>
                                            <span style={{ color: "#34c759", fontWeight: 500 }}>Free</span>
                                        </div>
                                        {coupon && (
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#5ac8fa" }}>
                                                <span>Discount ({coupon.code})</span>
                                                <span>-{currency}{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {!coupon && (
                                        <form onSubmit={applyCoupon} style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                                            <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="Promo code" style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "13px" }} />
                                            <button disabled={couponLoading} style={{ background: "#242426", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0 16px", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Apply</button>
                                        </form>
                                    )}

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", marginBottom: "24px" }}>
                                        <span style={{ fontSize: "17px", fontWeight: 600 }}>Total</span>
                                        <span className="final-total" style={{ fontSize: "24px", fontWeight: 800 }}>{currency}{finalTotal.toFixed(2)}</span>
                                    </div>

                                    <button 
                                        onClick={placeOrder} 
                                        disabled={placing}
                                        className="btn-primary" 
                                        style={{ width: "100%", padding: "16px", fontSize: "16px" }}
                                    >
                                        {placing ? "Processing..." : "Place Order"}
                                    </button>
                                    <button onClick={() => setStep(2)} className="btn-ghost" style={{ width: "100%", marginTop: "12px", border: "none" }}>Edit details</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: SUCCESS ── */}
                    {step === 4 && (
                        <div ref={successRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", textAlign: "center" }}>
                            <div className="success-icon" style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(52,199,89,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px", border: "2px solid rgba(52,199,89,0.3)" }}>
                                <CheckCircle2Icon size={48} color="#34c759" />
                            </div>
                            <h2 className="success-text" style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px" }}>Order Placed!</h2>
                            <p className="success-text" style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "340px", marginBottom: "40px" }}>We've received your order and will begin processing it right away.</p>
                            <div className="success-btn" style={{ display: "flex", gap: "16px" }}>
                                <Link href="/orders" className="btn-primary">View Orders</Link>
                                <Link href="/shop" className="btn-ghost">Continue Shopping</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}