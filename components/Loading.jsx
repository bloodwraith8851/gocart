'use client'

const Loading = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                border: "3px solid rgba(0,0,0,0.08)",
                borderTopColor: "#0071e3",
                animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default Loading