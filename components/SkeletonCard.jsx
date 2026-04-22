/**
 * SkeletonCard — animated shimmer placeholder matching ProductCard dimensions.
 * Includes layout logic for both Grid and List views.
 */
const SkeletonCard = ({ dark = false, listView = false }) => {
    const shimmer = dark ? "skeleton-dark" : "skeleton";
    const bg = dark ? "#161618" : "#fff";
    const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const imgBg = dark ? "#1c1c1e" : "#f5f5f7";

    if (listView) {
        return (
            <div style={{
                display: "flex", width: "100%", backgroundColor: bg, 
                border: `1px solid ${border}`, borderRadius: "16px", overflow: "hidden",
            }}>
                <div className={shimmer} style={{ width: "200px", minWidth: "140px", backgroundColor: imgBg, position: "relative" }} />
                <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
                        {Array(5).fill(null).map((_, i) => <div key={i} className={shimmer} style={{ width: "13px", height: "13px", borderRadius: "2px" }} />)}
                    </div>
                    <div className={shimmer} style={{ height: "18px", width: "70%", borderRadius: "5px", marginBottom: "10px" }} />
                    <div className={shimmer} style={{ height: "14px", width: "95%", borderRadius: "5px", marginBottom: "6px" }} />
                    <div className={shimmer} style={{ height: "14px", width: "80%", borderRadius: "5px", marginBottom: "16px" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                        <div className={shimmer} style={{ height: "20px", width: "80px", borderRadius: "5px" }} />
                        <div style={{ display: "flex", gap: "12px" }}>
                            <div className={shimmer} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                            <div className={shimmer} style={{ width: "130px", height: "40px", borderRadius: "980px" }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {/* Image Square */}
            <div
                className={shimmer}
                style={{ 
                    backgroundColor: imgBg, 
                    borderRadius: "14px", 
                    aspectRatio: "1/1", 
                    width: "100%", 
                    marginBottom: "12px"
                }}
            />
            
            {/* Stars row */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "5px" }}>
                {Array(5).fill(null).map((_, i) => (
                    <div key={i} className={shimmer} style={{ width: "11px", height: "11px", borderRadius: "2px" }} />
                ))}
            </div>
            
            {/* Name/Text */}
            <div className={shimmer} style={{ height: "14px", width: "85%", borderRadius: "5px", marginBottom: "6px" }} />
            <div className={shimmer} style={{ height: "14px", width: "50%", borderRadius: "5px", marginBottom: "8px" }} />
            
            {/* Price row */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className={shimmer} style={{ height: "15px", width: "45%", borderRadius: "5px" }} />
            </div>
        </div>
    )
}

export default SkeletonCard
