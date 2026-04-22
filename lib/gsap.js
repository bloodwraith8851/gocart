/**
 * GoCart — GSAP Central Registration
 * Import from this file in every component that uses GSAP.
 * Plugins are registered once here — importing multiple times is safe.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

export { gsap, ScrollTrigger }
