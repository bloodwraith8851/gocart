'use client'
import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { clearCart } from '@/lib/features/cart/cartSlice';

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

const OrderSummary = ({ totalPrice, items }) => {
    const router   = useRouter();
    const dispatch = useDispatch();

    const addressList = useSelector((state) => state.address.list);
    const { cartItems } = useSelector((state) => state.cart);

    const [paymentMethod,    setPaymentMethod]    = useState('COD');
    const [selectedAddress,  setSelectedAddress]  = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponInput,      setCouponInput]      = useState('');
    const [coupon,           setCoupon]           = useState(null);
    const [couponLoading,    setCouponLoading]    = useState(false);
    const [placing,          setPlacing]          = useState(false);

    const discount    = coupon ? (coupon.discount / 100) * totalPrice : 0;
    const finalTotal  = totalPrice - discount;

    const applyCoupon = async (e) => {
        e.preventDefault();
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        try {
            const res  = await fetch('/api/user/coupon', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponInput.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid coupon');
            setCoupon(data.coupon);
            toast.success(`${data.coupon.discount}% discount applied!`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCouponLoading(false);
        }
    };

    const placeOrder = async () => {
        if (!selectedAddress) return toast.error('Please select a delivery address');
        if (!items.length)    return toast.error('Your cart is empty');
        setPlacing(true);
        try {
            const res  = await fetch('/api/order', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addressId: selectedAddress.id, paymentMethod, cartItems, couponCode: coupon?.code || null }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to place order');
            dispatch(clearCart());
            toast.success('Order placed!');
            router.push('/orders');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setPlacing(false);
        }
    };

    const cardStyle = {
        width: "100%", maxWidth: "340px",
        backgroundColor: "#f5f5f7", borderRadius: "14px",
        padding: "24px", height: "fit-content",
    };

    const sectionLabel = {
        fontSize: "11px", fontWeight: 700, color: "rgba(0,0,0,0.48)",
        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px",
        display: "block",
    };

    const inputStyle = {
        width: "100%", backgroundColor: "#fff", color: "#1d1d1f",
        border: "1px solid rgba(0,0,0,0.12)", borderRadius: "10px",
        padding: "10px 14px", fontSize: "14px", outline: "none",
        fontFamily: "inherit",
    };

    return (
        <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "21px", fontWeight: 700, color: "#1d1d1f", marginBottom: "24px" }}>
                Order Summary
            </h2>

            {/* Payment method */}
            <span style={sectionLabel}>Payment</span>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {['COD', 'STRIPE'].map((m) => (
                    <button key={m} onClick={() => setPaymentMethod(m)} style={{
                        flex: 1, padding: "10px 8px", borderRadius: "8px",
                        border: `1px solid ${paymentMethod === m ? "#0071e3" : "rgba(0,0,0,0.12)"}`,
                        backgroundColor: paymentMethod === m ? "rgba(0,113,227,0.06)" : "#fff",
                        color: paymentMethod === m ? "#0071e3" : "rgba(0,0,0,0.56)",
                        fontWeight: paymentMethod === m ? 600 : 400,
                        fontSize: "13px", cursor: "pointer", transition: "all 0.15s",
                    }}>
                        {m === 'COD' ? 'Cash on Delivery' : '💳 Stripe'}
                    </button>
                ))}
            </div>

            {/* Address */}
            <span style={sectionLabel}>Delivery Address</span>
            {selectedAddress ? (
                <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "12px 14px", border: "1px solid rgba(0,113,227,0.3)", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <p style={{ fontSize: "13px", color: "#1d1d1f", lineHeight: 1.5 }}>
                        {selectedAddress.name} · {selectedAddress.street}<br />
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                    </p>
                    <button onClick={() => setSelectedAddress(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
                        <SquarePenIcon size={14} />
                    </button>
                </div>
            ) : (
                <div style={{ marginBottom: "16px" }}>
                    {addressList.length > 0 && (
                        <select
                            onChange={(e) => { const i = e.target.value; setSelectedAddress(i !== "" ? addressList[parseInt(i)] : null); }}
                            defaultValue=""
                            style={{ ...inputStyle, marginBottom: "8px", cursor: "pointer" }}
                        >
                            <option value="">Select saved address</option>
                            {addressList.map((a, i) => (
                                <option key={i} value={i}>{a.name} — {a.city}, {a.state}</option>
                            ))}
                        </select>
                    )}
                    <button onClick={() => setShowAddressModal(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0066cc", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <PlusIcon size={13} /> Add new address
                    </button>
                </div>
            )}

            <hr style={{ borderColor: "rgba(0,0,0,0.08)", margin: "0 0 16px" }} />

            {/* Line items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {[
                    { label: "Subtotal",  value: `${currency}${totalPrice.toFixed(2)}`, dark: true },
                    { label: "Shipping",  value: "Free",  color: "#34c759" },
                    ...(coupon ? [{ label: `Coupon (${coupon.discount}%)`, value: `-${currency}${discount.toFixed(2)}`, color: "#0071e3" }] : []),
                ].map(({ label, value, dark, color }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "14px", color: "rgba(0,0,0,0.56)" }}>{label}</span>
                        <span style={{ fontSize: "14px", fontWeight: dark ? 500 : 400, color: color || "#1d1d1f" }}>{value}</span>
                    </div>
                ))}
            </div>

            {/* Coupon input */}
            {!coupon ? (
                <form onSubmit={applyCoupon} style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                    <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        style={{ ...inputStyle, fontSize: "13px", padding: "8px 12px", flex: 1 }}
                    />
                    <button type="submit" disabled={couponLoading} style={{
                        backgroundColor: "#1d1d1f", color: "#fff", border: "none",
                        borderRadius: "8px", padding: "8px 14px", fontSize: "13px",
                        cursor: couponLoading ? "not-allowed" : "pointer", flexShrink: 0,
                        opacity: couponLoading ? 0.7 : 1,
                    }}>
                        {couponLoading ? "..." : "Apply"}
                    </button>
                </form>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(0,113,227,0.06)", borderRadius: "8px", padding: "10px 12px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "13px", color: "#0071e3", fontWeight: 600 }}>{coupon.code} — {coupon.discount}% off</span>
                    <button onClick={() => { setCoupon(null); setCouponInput(''); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)" }}>
                        <XIcon size={13} />
                    </button>
                </div>
            )}

            <hr style={{ borderColor: "rgba(0,0,0,0.08)", margin: "0 0 16px" }} />

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ fontSize: "17px", fontWeight: 700, color: "#1d1d1f" }}>Total</span>
                <span style={{ fontSize: "17px", fontWeight: 700, color: "#1d1d1f" }}>{currency}{finalTotal.toFixed(2)}</span>
            </div>

            {/* CTA */}
            <button
                onClick={placeOrder}
                disabled={placing || !items.length}
                id="place-order-btn"
                style={{
                    width: "100%", backgroundColor: "#0071e3", color: "#fff",
                    border: "none", borderRadius: "980px", padding: "14px",
                    fontSize: "17px", fontWeight: 500,
                    cursor: (placing || !items.length) ? "not-allowed" : "pointer",
                    opacity: (placing || !items.length) ? 0.6 : 1,
                    transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => { if (!placing && items.length) e.currentTarget.style.backgroundColor = "#0077ed"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0071e3"; }}
            >
                {placing ? "Placing Order…" : "Place Order"}
            </button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
        </div>
    );
};

export default OrderSummary;