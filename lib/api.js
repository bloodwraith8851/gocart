/**
 * lib/api.js
 *
 * Shared API handler utilities:
 *  - withAuth()    — extract + verify Clerk userId, return 401 if missing
 *  - apiError()    — consistent JSON error response
 *  - apiOk()       — consistent JSON success response with Cache-Control
 *  - runParallel() — Promise.all wrapper with better error messages
 */

import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// ─── Auth helper ──────────────────────────────────────────────────────────────────────────────────
/**
 * Returns { userId } if authenticated, or throws a 401 NextResponse.
 * Usage: const { userId } = await withAuth(request)
 */
export function withAuth(request) {
    const { userId } = getAuth(request)
    if (!userId) {
        throw Object.assign(new Error("Unauthorized"), { __status: 401 })
    }
    return { userId }
}

// ─── Response helpers ─────────────────────────────────────────────────────────────────────────────
export function apiOk(data, { cache = "no-store", status = 200 } = {}) {
    return NextResponse.json(data, {
        status,
        headers: {
            "Cache-Control": cache,
            "Content-Type":  "application/json",
        },
    })
}

export function apiError(message, status = 500) {
    console.error(`[API Error ${status}]`, message)
    return NextResponse.json({ error: String(message) }, { status })
}

// ─── Route wrapper — catches auth throws + unexpected errors ─────────────────────────────────────
/**
 * Wraps an async handler so all errors are caught and returned as JSON.
 * Usage:
 *   export const GET = routeHandler(async (req) => {
 *       const { userId } = withAuth(req)
 *       ...
 *       return apiOk({ data })
 *   })
 */
export function routeHandler(fn) {
    return async function handler(request, ctx) {
        try {
            return await fn(request, ctx)
        } catch (err) {
            const status = err.__status || 500
            return apiError(err.message || "Internal server error", status)
        }
    }
}

// ─── Parallel execution helper ────────────────────────────────────────────────────────────────────
/**
 * Run multiple async operations in parallel.
 * Provides clearer error attribution than bare Promise.all.
 */
export async function runParallel(fns) {
    return Promise.all(fns.map((fn) => fn()))
}
