# Stream Live — TODO / Backlog

> Priority: 🔴 Critical · 🟡 Important · 🟢 Nice to have · ⬜ Icebox

---

## V1.x (no backend required)

| Pri | Item | Notes |
|---|---|---|
| 🔴 | Fix `file://` cookie warning in README | Add bold note — use `npm start` |
| ~~🟡~~ | ~~Mobile search bar~~ | ✅ **Fixed in V1.3** — expandable icon tap below navbar |
| ~~🟡~~ | ~~Keyboard trap in modals~~ | ✅ **Fixed in V1.3** — `SL.a11y.trapFocus()` per WCAG 2.1 |
| ~~🟡~~ | ~~`<video>` poster attribute~~ | ✅ **Fixed in V1.3** — thumbnail shown while buffering |
| ~~🟡~~ | ~~Remember scroll position on modal close~~ | ✅ **Fixed in V1.3** — `_scrollY` stored in `SL.player` |
| ~~🟡~~ | ~~Persist uploaded videos across page reload~~ | ✅ **Fixed in V1.3** — IndexedDB via `SL.idb` |
| ~~🟡~~ | ~~Video card skeleton loaders~~ | ✅ **Fixed in V1.3** — shimmer during async init + per-card |
| ~~🟢~~ | ~~Dark/light mode toggle~~ | ✅ **Fixed in V1.3** — `[data-theme="light"]` + localStorage |
| ~~🟢~~ | ~~Share button on player modal~~ | ✅ **Fixed in V1.3** — Web Share API + `?v=<id>` deep link |
| 🟢 | "Owned" badge on purchased videos in grid | `hasPurchased` already computed in `views._card()` — badge renders as "✓ Owned" |
| 🟢 | Search history (in-session) | Dropdown of recent queries |
| 🟢 | Video preview on card hover (autoplay muted) | Tricky on mobile, needs pointer media query |
| ⬜ | PWA manifest + service worker | Offline browsing of cached free videos |

---

## V1.4 — Backend (Supabase)

| Pri | Item | Notes |
|---|---|---|
| 🔴 | Real user persistence (database) | Replace `SL.data.users[]` with Supabase auth |
| 🔴 | Real video storage (Supabase Storage or R2) | Replace `URL.createObjectURL` with CDN URLs |
| 🔴 | JWT / httpOnly cookie auth | Replace client-side cookie session |
| 🟡 | Email verification on signup | |
| 🟡 | Password reset flow | |
| 🟡 | View count tracking | Currently static mock numbers |
| 🟢 | Video transcoding pipeline | FFmpeg → multiple quality levels |
| 🟢 | Thumbnail auto-generation | Extract frame at 25% of video duration |

---

## V1.5 — Payments (Stripe)

| Pri | Item | Notes |
|---|---|---|
| 🔴 | Stripe Checkout for subscriptions | Replace simulated subscribe flow |
| 🔴 | Stripe one-time payment for per-video | Replace simulated purchase flow |
| 🔴 | Webhook handler for payment events | `customer.subscription.deleted`, etc. |
| 🟡 | Revenue share to creators | Payout dashboard |
| 🟡 | Coupon / promo code support | |
| 🟢 | Annual plan prorated upgrade path | |

---

## V2.0 — Creator Platform

| Pri | Item | Notes |
|---|---|---|
| 🟡 | Creator dashboard | Upload analytics, revenue, subscriber count |
| 🟡 | Comment system | Threaded, with moderation |
| 🟡 | Video chapters | JSON chapter markers in player |
| 🟡 | Playlists | User-created and creator-curated |
| 🟡 | Notifications | New upload from subscribed creator |
| 🟢 | Live streaming | WebRTC or HLS ingest |
| 🟢 | Subtitles / captions | WebVTT upload per video |
| ⬜ | Native mobile apps | React Native or PWA promotion |

---

## Known Bugs

| Severity | Bug | Status |
|---|---|---|
| Medium | `document.cookie` unavailable on `file://` origin in Chromium | Documented — use `npm start` as workaround |
| Low | Uploaded video blob URL invalidates if browser clears IndexedDB storage | By design — requires backend (V1.4) for true persistence |
| Low | `<video>` autoplay may be blocked silently by browser policy | Handled — `.catch(() => {})` in `player.js` |
| ~~High~~ | ~~`gh-pages` fails with `src refspec` error on Termux~~ | ✅ **Fixed in V1.2** |
| ~~Medium~~ | ~~`vercel.json` `builds` deprecation warning~~ | ✅ **Fixed in V1.2** |
| ~~High~~ | ~~`gh-pages` EACCES permission error on Termux~~ | ✅ **Fixed in V1.3** — moved to GitHub Actions |
| ~~Medium~~ | ~~Uploads lost on page reload~~ | ✅ **Fixed in V1.3** — IndexedDB |
| ~~Medium~~ | ~~No search on mobile~~ | ✅ **Fixed in V1.3** — mobile search toggle |

---

*Last updated: 2026-03-23 · Stream Live V1.3*
