# ADR-010: Brand Palette — Gold Primary, Deeper Red-Orange Premium

**Status:** Accepted  
**Date:** 2026-03-23  
**Version:** V1.3.1

---

## Context

The original design system (ADR-005) used electric mint (`#00e5a0`) as `--primary` — the accent colour applied to all interactive elements, active states, focus rings, hover glows, and free-content badges. This was the default choice during initial build.

A palette change was requested: replace mint with a **warm gold** tone, as the cool green was not aligned with the intended brand aesthetic.

---

## Decision

Replace the two-colour palette:

| Token | V1.3 (old) | V1.3.1 (new) |
|---|---|---|
| `--primary` | `#00e5a0` electric mint | `#f5c542` gold |
| `--primary-dim` | `rgba(0,229,160,.1)` | `rgba(245,197,66,.1)` |
| `--primary-glow` | `rgba(0,229,160,.18)` | `rgba(245,197,66,.18)` |
| `--premium` | `#ff7043` light orange | `#e8503a` deep red-orange |
| `--premium-dim` | `rgba(255,112,67,.1)` | `rgba(232,80,58,.1)` |
| `--premium-glow` | `rgba(255,112,67,.2)` | `rgba(232,80,58,.2)` |
| Light mode `--primary-dim` | `rgba(0,175,120,.1)` | `rgba(210,165,40,.1)` |
| Light mode `--primary-glow` | `rgba(0,175,120,.18)` | `rgba(210,165,40,.18)` |

**Why shift `--premium` too?**  
The original `--premium` orange (`#ff7043`) was too close in warmth to gold. With `--primary` now gold, keeping the same orange would make free and premium content visually indistinguishable. Shifting `--premium` to a deeper red-orange (`#e8503a`) maintains clear tier separation.

---

## Consequences

- All interactive elements (buttons, active category pills, nav brand icon, focus rings, upload toggle, progress bar, search focus) now render in gold
- Premium badges, gate modal, lock icons, and premium card glows render in deep red-orange
- Light mode adjusts accordingly via the existing `[data-theme="light"]` override block
- No JS changes — palette is entirely CSS custom properties
- One file changed: `assets/css/main.css`

---

## Cookie Security (`cookies.js`)

Also included in this patch: the `Secure` flag is now conditionally added to all `document.cookie` writes.

**Before:**
```js
document.cookie = `${name}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
```

**After:**
```js
const secure = location.protocol === 'https:' ? '; Secure' : '';
document.cookie = `${name}=${encoded}; expires=${expires}; path=/; SameSite=Lax${secure}`;
```

`Secure` instructs the browser to only transmit the cookie over HTTPS, preventing it from being sent in plaintext. The protocol check ensures `npm start` (plain HTTP on localhost) continues to work — the flag is only applied on deployed HTTPS origins (GitHub Pages, Vercel).

The existing `SameSite=Lax` was already correct — it prevents CSRF by blocking cross-site POST requests from carrying the cookie.

---

## Scope

CSS variables patch + one-line cookie security hardening. No layout or behaviour changes.
