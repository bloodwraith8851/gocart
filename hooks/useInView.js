import { useEffect, useRef, useState } from "react"

/**
 * Returns [ref, isVisible].
 * The element attached to `ref` will only be marked visible
 * once it enters the viewport (+ optional rootMargin offset).
 */
export function useInView(options = {}) {
    const ref        = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true)
                observer.disconnect() // fire once
            }
        }, { rootMargin: "200px 0px", threshold: 0, ...options })

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return [ref, visible]
}
