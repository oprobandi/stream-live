# Stream Live — TODO / Backlog

> Priority: 🔴 Critical · 🟡 Important · 🟢 Nice to have · ⬜ Icebox

---

## V1.x (no backend required)

| Pri | Item | Notes |
|---|---|---|
| 🔴 | Fix `file://` cookie warning in README | Add bold note — use `npm start` |
| 🔴 | Replace `homepage` placeholder in `package.json` | Needs real GitHub username before deploy |
| 🟡 | Mobile search bar | Currently hidden on <640px; add expandable icon tap |
| 🟡 | Keyboard trap in modals | Focus should cycle within open modal per WCAG 2.1 |
| 🟡 | `<video>` poster attribute | Show thumbnail as poster while video loads |
| 🟡 | Remember scroll position on modal close | Currently jumps to top |
| 🟡 | Persist uploaded videos across page reload | Currently in-memory only; use IndexedDB or blob URL registry |
| 🟡 | Video card skeleton loaders | Flash of unstyled content on slow connections |
| 🟢 | Dark/light mode toggle | CSS variables already support theming |
| 🟢 | Share button on player modal | Copy URL with `?v=<id>` query string |
| 🟢 | "Owned" badge on purchased videos in grid | `hasPurchased` already computed in `views._card()` |
| 🟢 | Search history (in-session) | Dropdown of recent queries |
| 🟢 | Video preview on card hover (autoplay muted) | Tricky on mobile, needs pointer media query |
| ⬜ | PWA manifest + service worker | Offline browsing of cached free videos |

---

## V1.2 — Backend (Node/Express or Supabase)

| Pri | Item | Notes |
|---|---|---|
| 🔴 | Real user persistence (database) | Replace `SL.data.users[]` with API calls |
| 🔴 | Real video storage (S3 / R2 / Backblaze) | Replace `URL.createObjectURL` with CDN URLs |
| 🔴 | JWT or signed-cookie auth | Replace client-side cookie with httpOnly server session |
| 🟡 | Email verification on signup | |
| 🟡 | Password reset flow | |
| 🟡 | View count tracking | Currently static mock numbers |
| 🟢 | Video transcoding pipeline | FFmpeg → multiple quality levels |
| 🟢 | Thumbnail auto-generation | Extract frame at 25% of video duration |

---

## V1.3 — Payments (Stripe)

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
| Low | Uploaded video blob URL invalidates on page reload | By design in V1.0; tracked above |
| Low | `<video>` autoplay may be blocked silently by browser policy | Handled — `.catch(() => {})` in `player.js` |

---

*Last updated: 2026-03-23 · Stream Live V1.1*
