'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import ProductCard from "@/components/ProductCard";
import RatingModal from "@/components/RatingModal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

export default function Product() {
    const { productId } = useParams();
    const products      = useSelector((state) => state.product.list);
    const [product,      setProduct]      = useState(null);
    const [ratingModal,  setRatingModal]  = useState(null);

    useEffect(() => {
        if (products.length > 0) {
            const found = products.find((p) => p.id === productId);
            setProduct(found || null);
        }
        window.scrollTo(0, 0);
    }, [productId, products]);

    // Related products — same category, exclude current
    const related = product
        ? products
            .filter((p) => p.category === product.category && p.id !== product.id && p.inStock)
            .slice(0, 4)
        : [];

    // Skeleton while products load
    if (!product && products.length === 0) {
        return (
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "40px 20px" }}>
                <div className="skeleton" style={{ height: "16px", width: "200px", marginBottom: "40px", borderRadius: "5px" }} />
                <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                    <div className="skeleton" style={{ width: "380px", height: "380px", borderRadius: "12px" }} />
                    <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div className="skeleton" style={{ height: "20px", width: "40%", borderRadius: "5px" }} />
                        <div className="skeleton" style={{ height: "36px", width: "80%", borderRadius: "5px" }} />
                        <div className="skeleton" style={{ height: "28px", width: "30%", borderRadius: "5px" }} />
                        <div className="skeleton" style={{ height: "48px", width: "160px", borderRadius: "24px", marginTop: "16px" }} />
                    </div>
                </div>
            </div>
        );
    }

    // Not found
    if (!product && products.length > 0) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "28px", fontWeight: 700, color: "#1d1d1f" }}>Product not found</h1>
                <Link href="/shop" style={{ marginTop: "24px", color: "#0066cc", fontSize: "15px" }}>← Back to Shop</Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "80vh" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", padding: "24px 20px" }}>

                {/* Breadcrumb */}
                {product && (
                    <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(0,0,0,0.48)", marginBottom: "32px" }}>
                        <Link href="/" style={{ color: "#0066cc", textDecoration: "none" }}>Home</Link>
                        <span>/</span>
                        <Link href="/shop" style={{ color: "#0066cc", textDecoration: "none" }}>Shop</Link>
                        <span>/</span>
                        <Link href={`/shop?search=${product.category}`} style={{ color: "#0066cc", textDecoration: "none" }}>{product.category}</Link>
                        <span>/</span>
                        <span style={{ color: "#1d1d1f", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                            {product.name}
                        </span>
                    </nav>
                )}

                {/* Product details + description */}
                {product && (
                    <>
                        <ProductDetails product={product} />
                        <ProductDescription product={product} setRatingModal={setRatingModal} />
                    </>
                )}

                {/* Related Products */}
                {related.length > 0 && (
                    <div style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
                            <div>
                                <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "22px", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.3px" }}>
                                    You May Also Like
                                </h2>
                                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.44)", marginTop: "3px" }}>
                                    More in {product?.category}
                                </p>
                            </div>
                            <Link href={`/shop?search=${product?.category}`}
                                style={{ fontSize: "14px", color: "#0066cc", fontWeight: 500, textDecoration: "none" }}>
                                See all ›
                            </Link>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "20px" }}>
                            {related.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>

            {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
        </div>
    );
}