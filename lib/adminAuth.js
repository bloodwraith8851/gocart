/**
 * Shared admin auth helper — supports multiple admins.
 *
 * Set ONE or MANY admin IDs in your Railway/env variables:
 *
 *   ADMIN_USER_IDS=user_abc123,user_xyz789,user_qwe456
 *
 * Backwards-compatible with the old single-ID var (ADMIN_USER_ID).
 */

const rawIds = process.env.ADMIN_USER_IDS || process.env.ADMIN_USER_ID || "";

// Split by comma, trim whitespace, drop empty strings → Set for O(1) lookup
export const ADMIN_IDS = new Set(
    rawIds.split(",").map((id) => id.trim()).filter(Boolean)
);

/**
 * Returns true if the given Clerk userId is a configured admin.
 * @param {string|null|undefined} userId
 * @returns {boolean}
 */
export function isAdmin(userId) {
    if (!userId) return false;
    if (ADMIN_IDS.size === 0) return false; // no admins set → deny all
    return ADMIN_IDS.has(userId);
}
