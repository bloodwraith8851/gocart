'use client'
import Link from 'next/link'

const Title = ({ title, description, href, visibleButton = true }) => {
    return (
        <div className="flex items-end justify-between gap-6">
            <div>
                <h2
                    className="text-section-heading"
                    style={{ color: "#1d1d1f" }}
                >
                    {title}
                </h2>
                {description && (
                    <p
                        className="text-caption mt-2"
                        style={{ color: "rgba(0,0,0,0.64)", maxWidth: "480px" }}
                    >
                        {description}
                    </p>
                )}
            </div>
            {visibleButton && href && (
                <Link
                    href={href}
                    className="btn-pill shrink-0"
                    style={{ whiteSpace: "nowrap" }}
                >
                    See all ›
                </Link>
            )}
        </div>
    )
}

export default Title