# ADR-011: Full Responsive Layout System

**Status:** Accepted  
**Date:** 2026-03-23  
**Version:** V1.3.2

---

## Context

V1.3.1 and earlier had a thin two-breakpoint responsive system (`900px` and `640px`). This left several unaddressed failure points:

- No tablet landscape pass (1024px) — grid ran too wide, player had no constraint
- No tablet portrait pass (768px) — hero misaligned, player meta overflowed
- Nav actions overflowed on small phones with multiple logged-in state buttons
- Touch targets (modal close, nav buttons) were below the 44×44px Apple/Google minimum
- Upload button and Sign Out button had no icon-only fallback for narrow viewports
- 375px (iPhone SE, common budget Androids) had no dedicated pass — single-column layout was never enforced, hero buttons overflowed side-by-side

---

## Decision

Replace the two-breakpoint system with a four-tier cascade:

### Breakpoint 1 — 1024px (tablet landscape)
- Hero visual cards hidden; hero left-aligned
- Grid capped at 3 columns
- Player full-width with rounded corners
- Footer links tighter

### Breakpoint 2 — 768px (tablet portrait)
- Hero centres
- Grid drops to 2 columns with 16px gap
- Player meta stacks vertically (title → stats → desc → badge/share row)
- Modals reduce padding; plan toggle and field rows stack
- Footer fully stacked

### Breakpoint 3 — 640px (large phone)
- Nav search replaced by toggle (carried from V1.3)
- Nav actions gap reduced
- Upload button: SVG icon only (`<span class="upload-btn-label">` hidden)
- Sign Out button: SVG icon only (`<span class="signout-label">` hidden) — logout icon added
- All nav/modal touch targets enforced to min 44×44px
- Grid remains 2 columns (still readable at this size)
- Modal padding reduced; border-radius softened
- Player title and description font-sizes reduced

### Breakpoint 4 — 375px (small phone)
- Theme toggle hidden (saves ~40px of nav space; accessible via localStorage key `sl_theme`)
- Grid forced to single column
- Cards switch to **horizontal layout** — 140px thumbnail + text side by side (avoids tiny portrait thumbnails)
- Hero title rescales with tighter `clamp()`; CTA buttons stack full-width
- Modals adopt bottom-sheet pattern — `align-items: flex-end`, top corners rounded only
- Category bar pills shrink

---

## Nav collapse strategy

Option B was chosen (CSS-only, icon buttons on mobile) over Option A (avatar dropdown menu) because:
- No new JS required — consistent with the static-first philosophy
- The avatar already provides visual confirmation of signed-in state
- A proper user menu belongs in V1.4 alongside real auth

`views.js` was updated to wrap button labels in `<span>` elements with named classes (`upload-btn-label`, `signout-label`), which CSS hides at ≤640px. Icons are always visible and carry `aria-label` for screen readers.

---

## Files Changed

| File | Change |
|---|---|
| `assets/css/main.css` | Replaced 2-breakpoint block with 4-tier system (~120 lines) |
| `assets/js/views.js` | Upload and Sign Out buttons wrapped labels in spans; logout SVG icon added |
| `package.json` | Version → 1.3.2 |
| `index.html` | Footer version → V1.3.2 |

---

## Known Remaining Limitations

- Video hover preview (autoplay muted on card hover) is still deferred — unreliable on touch devices
- PWA manifest not yet added — deferred to a future icebox item
- The 375px horizontal card layout uses a fixed 140px thumbnail column — this may need adjustment if very long titles are added
