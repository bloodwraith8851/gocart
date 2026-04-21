'use client'
import { Star, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addRating } from '@/lib/features/rating/ratingSlice';

const RatingModal = ({ ratingModal, setRatingModal }) => {
    const [rating,  setRating]  = useState(0);
    const [hovered, setHovered] = useState(0);
    const [review,  setReview]  = useState('');
    const [saving,  setSaving]  = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (rating < 1) return toast.error('Please select a star rating');
        if (review.trim().length < 5) return toast.error('Please write a short review (min 5 chars)');

        setSaving(true);
        try {
            const res = await fetch('/api/user/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...ratingModal, rating, review, orderId: ratingModal.orderId || "unverified" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit rating');
            dispatch(addRating({ ...ratingModal, rating, review }));
            toast.success('Thanks for your review!');
            setRatingModal(null);
        } catch (err) {
            toast.error(err.message);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 100,
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(16px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "16px",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setRatingModal(null); }}
        >
            <div style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "32px",
                width: "100%", maxWidth: "400px",
                position: "relative",
                boxShadow: "rgba(0,0,0,0.2) 0 20px 60px",
            }}>
                {/* Close */}
                <button
                    onClick={() => setRatingModal(null)}
                    style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)" }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "21px", fontWeight: 600, color: "#1d1d1f", marginBottom: "24px" }}>
                    Rate this product
                </h2>

                {/* Stars */}
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={() => setHovered(i + 1)}
                            onMouseLeave={() => setHovered(0)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                        >
                            <Star
                                size={36}
                                style={{
                                    fill: (hovered || rating) > i ? "#0071e3" : "#e5e7eb",
                                    color: (hovered || rating) > i ? "#0071e3" : "#e5e7eb",
                                    transition: "fill 0.1s ease",
                                }}
                            />
                        </button>
                    ))}
                </div>

                {/* Review */}
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                    rows={4}
                    style={{
                        width: "100%", padding: "12px 14px",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "10px", fontSize: "14px",
                        outline: "none", resize: "none",
                        fontFamily: "'Inter',sans-serif",
                        color: "#1d1d1f",
                        marginBottom: "20px",
                    }}
                    onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #0071e3"; e.currentTarget.style.borderColor = "transparent"; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
                />

                {/* Submit */}
                <button
                    onClick={() => toast.promise(handleSubmit(), { loading: 'Submitting...' })}
                    disabled={saving}
                    style={{
                        width: "100%", backgroundColor: "#0071e3", color: "#fff",
                        border: "none", borderRadius: "980px", padding: "13px",
                        fontSize: "15px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.6 : 1,
                    }}
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default RatingModal;