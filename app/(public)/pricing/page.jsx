export default function PricingPage() {
    const plans = [
        {
            name: "Buyer",
            price: "Free",
            color: "#0071e3",
            features: ["Browse all products", "Add to cart & checkout", "Order tracking", "Review products"],
            cta: "Get started",
            href: "/shop",
        },
        {
            name: "Seller",
            price: "$0",
            sub: "No listing fees",
            color: "#34c759",
            highlight: true,
            features: ["List unlimited products", "Revenue dashboard", "Order management", "Real-time analytics", "Priority support"],
            cta: "Open your store",
            href: "/create-store",
        },
        {
            name: "Enterprise",
            price: "Custom",
            color: "#ff9500",
            features: ["Everything in Seller", "Dedicated account manager", "API access", "Custom integrations", "SLA guarantee"],
            cta: "Contact us",
            href: "mailto:hello@gocart.io",
        },
    ];

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "80vh" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "80px 20px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "64px" }}>
                    <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#1d1d1f", lineHeight: 1.07, letterSpacing: "-0.5px" }}>
                        Simple, transparent pricing.
                    </h1>
                    <p style={{ fontSize: "21px", color: "rgba(0,0,0,0.56)", maxWidth: "440px", margin: "16px auto 0", lineHeight: 1.5 }}>
                        No hidden fees. No surprises. Start free, grow at your pace.
                    </p>
                </div>

                {/* Plans */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", alignItems: "start" }}>
                    {plans.map((plan) => (
                        <div key={plan.name} style={{
                            border: plan.highlight ? `2px solid ${plan.color}` : "1px solid rgba(0,0,0,0.1)",
                            borderRadius: "16px", padding: "32px",
                            position: "relative",
                            backgroundColor: plan.highlight ? "#fff" : "#fafafa",
                            boxShadow: plan.highlight ? `0 8px 40px rgba(0,0,0,0.1)` : "none",
                        }}>
                            {plan.highlight && (
                                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: plan.color, color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 16px", borderRadius: "980px", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                                    Most Popular
                                </div>
                            )}

                            <p style={{ fontSize: "12px", fontWeight: 700, color: plan.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                                {plan.name}
                            </p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "40px", fontWeight: 700, color: "#1d1d1f", lineHeight: 1 }}>
                                    {plan.price}
                                </span>
                            </div>
                            {plan.sub && (
                                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.4)", marginBottom: "24px" }}>{plan.sub}</p>
                            )}

                            <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                {plan.features.map((f) => (
                                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "rgba(0,0,0,0.64)" }}>
                                        <span style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: plan.color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "9px", color: "#fff", fontWeight: 900 }}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <a href={plan.href} style={{
                                display: "block", textAlign: "center", textDecoration: "none",
                                backgroundColor: plan.highlight ? plan.color : "transparent",
                                color: plan.highlight ? "#fff" : plan.color,
                                border: `1px solid ${plan.color}`,
                                borderRadius: "980px", padding: "12px",
                                fontSize: "15px", fontWeight: 500,
                                transition: "all 0.15s",
                            }}>
                                {plan.cta}
                            </a>
                        </div>
                    ))}
                </div>

                {/* FAQ hint */}
                <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(0,0,0,0.4)", marginTop: "56px" }}>
                    Questions? Email us at <a href="mailto:hello@gocart.io" style={{ color: "#0066cc" }}>hello@gocart.io</a>
                </p>
            </div>
        </div>
    );
}