/**
 * SkeletonCard — animated shimmer placeholder matching ProductCard dimensions.
 * Pass `dark` to use the dark variant (for dark sections).
 */
const SkeletonCard = ({ dark = false }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        {/* Image square */}
        <div
            className={dark ? "skeleton-dark" : "skeleton"}
            style={{ aspectRatio: "1 / 1", borderRadius: "14px", width: "100%" }}
        />
        {/* Stars row */}
        <div style={{ display: "flex", gap: "3px" }}>
            {Array(5).fill(null).map((_, i) => (
                <div key={i} className={dark ? "skeleton-dark" : "skeleton"} style={{ width: "11px", height: "11px", borderRadius: "2px" }} />
            ))}
        </div>
        {/* Name — two lines */}
        <div className={dark ? "skeleton-dark" : "skeleton"} style={{ height: "13px", width: "85%", borderRadius: "5px" }} />
        <div className={dark ? "skeleton-dark" : "skeleton"} style={{ height: "13px", width: "60%", borderRadius: "5px" }} />
        {/* Price row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className={dark ? "skeleton-dark" : "skeleton"} style={{ height: "15px", width: "40%", borderRadius: "5px" }} />
            <div className={dark ? "skeleton-dark" : "skeleton"} style={{ height: "12px", width: "28%", borderRadius: "5px" }} />
        </div>
        {/* "Learn more" */}
        <div className={dark ? "skeleton-dark" : "skeleton"} style={{ height: "11px", width: "35%", borderRadius: "5px" }} />
    </div>
)

export default SkeletonCard
