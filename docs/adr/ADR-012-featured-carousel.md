# ADR-012: Featured Category Carousel

**Status:** Accepted  
**Date:** 2026-03-23  
**Version:** V1.3.3

---

## Context

The platform had no visual discovery mechanism between the hero and the video grid. First-time visitors land on a generic grid with no sense of what categories exist or what the platform's breadth looks like.

---

## Decision

Add a **featured category carousel** as a dedicated section between the hero and the video grid. Five slides, one per highlighted category, auto-advancing with a crossfade transition.

---

## Design Choices

**Position: Option C** — between hero and grid.
- Hero retains its brand/CTA purpose unchanged
- Carousel acts as a visual "menu" before the user reaches the grid
- Less layout disruption than a full-width banner (Option B)
- No conflict with the floating hero visual cards (Option A)

**5 slides — categories chosen:**
Nature → Ocean → City → Food → Tech  
Selection rationale: covers the widest visual contrast (landscape, underwater, neon, warm kitchen, cold screen) for maximum variety on first impression. Sport deferred — existing Sport imagery in seed data is less cinematic.

**Timing:**
- `3500ms` auto-advance interval — readable, not anxious
- `500ms` crossfade transition — smooth without feeling slow
- Pause on `mouseenter`, resume on `mouseleave`
- Timer resets on any manual navigation (arrow, dot click)

**Interaction:**
- Clicking any slide or its CTA button filters the video grid to that category and smooth-scrolls to the grid
- Internally calls `SL.store.currentCat`, `SL.views.renderGrid()`, and updates the category bar pill — fully integrated with existing state

**Controls:**
- Prev/next arrow buttons (hidden on mobile ≤640px — swipe implied)
- Dot indicators with active state
- Full keyboard support: ArrowLeft/ArrowRight on carousel wrap focus; Enter/Space on individual slides

**Responsive behaviour:**
| Breakpoint | Behaviour |
|---|---|
| Desktop | `aspect-ratio: 21/8` — wide cinematic strip |
| 768px | `16/7` — slightly taller; subtitle hidden |
| 640px | `4/3` — square-ish; arrows hidden |
| 375px | `1/1` — full square; smaller typography |

---

## Files Changed

| File | Change |
|---|---|
| `assets/js/carousel.js` | New — full carousel controller |
| `assets/js/app.js` | `SL.carousel.init()` called after store/views init |
| `index.html` | Carousel section HTML inserted; `carousel.js` script tag added |
| `assets/css/main.css` | Carousel styles + 4-breakpoint responsive block appended |
| `package.json` | Version → 1.3.3 |

---

## Constraints & Known Limitations

- Images are Unsplash URLs — same CDN already used by seed video thumbnails
- No swipe gesture support yet (touch `touchstart`/`touchend` deferred to V1.4+)
- Sport category not featured in carousel — can be added as a 6th slide or swap in V1.4
