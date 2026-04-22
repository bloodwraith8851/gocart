'use client'
/**
 * GoCart — useScrollAnimation
 * A collection of GSAP + ScrollTrigger animation helpers.
 * Each function accepts a ref and optional config, attaches a ScrollTrigger,
 * and returns a cleanup function suitable for useLayoutEffect.
 *
 * Usage:
 *   const containerRef = useRef(null)
 *   useLayoutEffect(() => {
 *     const ctx = gsap.context(() => { fadeUp(containerRef) }, containerRef)
 *     return () => ctx.revert()
 *   }, [])
 */
import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

// ─── Individual animation factories ────────────────────────────────────────

/** Fade + translateY reveal on scroll */
export function fadeUp(targets, { stagger = 0, delay = 0, duration = 0.7, y = 40, start = 'top 88%' } = {}) {
    return gsap.fromTo(targets,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, ease: 'power3.out', stagger, delay,
          scrollTrigger: { trigger: typeof targets === 'string' ? targets : targets, start, toggleActions: 'play none none none' } }
    )
}

/** Pure opacity reveal */
export function fadeIn(targets, { duration = 0.6, delay = 0, start = 'top 90%' } = {}) {
    return gsap.fromTo(targets,
        { opacity: 0 },
        { opacity: 1, duration, ease: 'power2.out', delay,
          scrollTrigger: { trigger: targets, start, toggleActions: 'play none none none' } }
    )
}

/** Stagger reveal on children of a container */
export function staggerCards(container, { stagger = 0.08, y = 32, duration = 0.6, start = 'top 85%' } = {}) {
    const children = container?.children || container
    return gsap.fromTo(children,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, ease: 'power3.out', stagger,
          scrollTrigger: { trigger: container, start, toggleActions: 'play none none none' } }
    )
}

/** Count-up number animation */
export function counterRoll(element, end, { duration = 1.8, delay = 0, prefix = '', suffix = '' } = {}) {
    const obj = { val: 0 }
    return gsap.to(obj, {
        val: end, duration, delay, ease: 'power2.out', snap: { val: 1 },
        onUpdate: () => {
            if (element) element.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix
        },
        scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none none' },
    })
}

/** Horizontal line/divider draw-in */
export function morphLine(element, { duration = 0.8, delay = 0, start = 'top 85%' } = {}) {
    return gsap.fromTo(element,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration, ease: 'power3.inOut', delay,
          scrollTrigger: { trigger: element, start, toggleActions: 'play none none none' } }
    )
}

/** Clip-path text reveal (left→right) */
export function textReveal(element, { duration = 0.9, delay = 0, start = 'top 85%' } = {}) {
    return gsap.fromTo(element,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        { clipPath: 'inset(0 0% 0 0)', duration, ease: 'power3.inOut', delay,
          scrollTrigger: { trigger: element, start, toggleActions: 'play none none none' } }
    )
}

/** Scale-in reveal */
export function scaleIn(targets, { stagger = 0, delay = 0, start = 'top 88%' } = {}) {
    return gsap.fromTo(targets,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', stagger, delay,
          scrollTrigger: { trigger: typeof targets === 'string' ? targets : targets, start, toggleActions: 'play none none none' } }
    )
}

/** Slide-in from left */
export function slideInLeft(targets, { delay = 0, start = 'top 85%' } = {}) {
    return gsap.fromTo(targets,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay,
          scrollTrigger: { trigger: targets, start, toggleActions: 'play none none none' } }
    )
}

/** Slide-in from right */
export function slideInRight(targets, { delay = 0, start = 'top 85%' } = {}) {
    return gsap.fromTo(targets,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay,
          scrollTrigger: { trigger: targets, start, toggleActions: 'play none none none' } }
    )
}

/** Parallax background movement on scroll */
export function parallax(element, { speed = 0.3, start = 'top bottom', end = 'bottom top' } = {}) {
    return gsap.to(element, {
        yPercent: 30 * speed,
        ease: 'none',
        scrollTrigger: { trigger: element, start, end, scrub: true },
    })
}

/** Navbar shrink on scroll */
export function navbarShrink(navEl, { threshold = 60 } = {}) {
    return ScrollTrigger.create({
        start: `${threshold}px top`,
        onEnter: () => gsap.to(navEl, { height: 44, duration: 0.3, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(navEl, { height: 52, duration: 0.3, ease: 'power2.out' }),
    })
}

// ─── Convenience React hook ────────────────────────────────────────────────

/**
 * useScrollAnimation — attach a GSAP context to a ref.
 * The callback receives the ref element and runs inside gsap.context() so
 * all tweens are automatically reverted on unmount.
 *
 * @param {Function} animateFn - (element) => void
 * @param {Array}    deps      - dependency array (like useEffect)
 */
export function useScrollAnimation(animateFn, deps = []) {
    const ref = useRef(null)

    useLayoutEffect(() => {
        if (!ref.current) return
        const ctx = gsap.context(() => animateFn(ref.current), ref)
        return () => ctx.revert()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return ref
}

export default useScrollAnimation
