'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId }) => {
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const qty = cartItems[productId] || 0;

    const btnStyle = {
        width: "28px", height: "28px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "none", border: "none",
        fontSize: "18px", fontWeight: 300,
        color: "#1d1d1f", cursor: "pointer",
        borderRadius: "50%", flexShrink: 0,
    };

    return (
        <div style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            border: "1px solid rgba(0,0,0,0.14)", borderRadius: "980px",
            padding: "2px 6px",
        }}>
            <button
                onClick={() => dispatch(removeFromCart({ productId }))}
                style={btnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                aria-label="Remove one"
            >
                −
            </button>
            <span style={{ minWidth: "24px", textAlign: "center", fontSize: "15px", fontWeight: 500, color: "#1d1d1f" }}>
                {qty}
            </span>
            <button
                onClick={() => dispatch(addToCart({ productId }))}
                style={btnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                aria-label="Add one"
            >
                +
            </button>
        </div>
    );
};

export default Counter;