# ADR-013: Favicon, Refined Logo Icon & OG / Twitter Card Meta

**Status:** Accepted  
**Date:** 2026-03-23  
**Version:** V1.3.4

---

## Context

Three related branding gaps existed in V1.3.3:

1. No favicon — browsers showed a blank/generic tab icon
2. The brand icon SVG used a slightly off-centre play triangle (`points="6,3 20,12 6,21"`) — the left anchor was too close to the edge
3. No Open Graph or Twitter Card meta tags — shared links rendered as plain text with no image preview

---

## Decisions

### 1. SVG Favicon via `data:` URI

**Approach:** Inline SVG encoded as a `data:image/svg+xml` URI in a `<link rel="icon">` tag. No external file required.

**Shape:** Gold (`#f5c542`) rounded-square background (rx=7 on a 32×32 viewBox) with a black play triangle — exactly matching the `.brand-icon` element already in the navbar.

**Why SVG over PNG/ICO:**
- Scales perfectly to any size (16px tab icon → 512px PWA icon)
- No build step, no extra files, no Termux complications
- Supported by all modern browsers (Chrome 80+, Firefox 41+, Safari 12+)

**Additional tags added:**
- `<link rel="alternate icon">` — PNG fallback for very old browsers (empty placeholder, acceptable)
- `<link rel="apple-touch-icon">` — 180×180 SVG for iOS home screen bookmarks; uses larger rx=40 for iOS corner radius convention
- `<meta name="theme-color" content="#f5c542">` — colours the browser chrome on Android Chrome

### 2. Refined Brand Icon

The play triangle polygon was adjusted from `points="6,3 20,12 6,21"` to `points="7,4 19,12 7,20"`. This:
- Moves the left anchor 1px right — reduces optical left-crowding inside the rounded square
- Reduces the vertical span by 1px top and bottom — stops the triangle touching the container edge
- Applied consistently across navbar, footer, and auth modal logo instances

CSS additions to `.brand-icon`:
- `box-shadow: 0 0 0 1px rgba(245,197,66,.25), inset 0 1px 0 rgba(255,255,255,.15)` — subtle definition ring + inner highlight
- Hover state on `.nav-brand:hover .brand-icon`: ring expands to 3px, slight scale-up — adds tactile feel to the brand button

### 3. Open Graph + Twitter Card

**OG image:** `https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&h=630&fit=crop&q=80`

The ocean / deep dive image was chosen because:
- Dark, cinematic — strong contrast with most social feed backgrounds
- Already in the codebase (carousel slide 2, seed video id:3)
- Unsplash URL supports `w`, `h`, `fit=crop` params — exact 1200×630 OG spec with no extra file

**Tags added:**
- `og:type`, `og:site_name`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:url`
- `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`

`og:url` set to the Vercel production URL. When GitHub Pages becomes the canonical domain this should be updated.

---

## Files Changed

| File | Change |
|---|---|
| `index.html` | Full `<head>` rewrite — favicon links, theme-color, OG tags, Twitter Card tags; refined polygon points on all brand icon SVGs |
| `assets/css/main.css` | `.brand-icon` — size 30→32px, box-shadow ring added, hover transition added |
| `package.json` | Version → 1.3.4 |
