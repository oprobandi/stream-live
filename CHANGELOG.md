# Changelog

All notable changes to Stream Live are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2026-03-23

### Added
- `package.json` with `npm start` (local dev server) and `npm run deploy` (GitHub Pages) scripts
- `netlify.toml` — zero-config Netlify deploy with SPA redirect rule
- `vercel.json` — zero-config Vercel static deploy
- `.gitignore` — excludes `node_modules/`, `.DS_Store`, logs
- `docs/adr/` — Architecture Decision Records for all six major decisions:
  - ADR-001: Vanilla JS over framework
  - ADR-002: Real `document.cookie` over localStorage
  - ADR-003: Free-first, non-compulsive auth
  - ADR-004: `pendingAction` pattern for post-auth resumption
  - ADR-005: Stream Live design system
  - ADR-006: Dual monetisation (subscription + per-video purchase)
- `docs/TODO.md` — prioritised backlog for V2.0
- This `CHANGELOG.md`
- README updated with `file://` cookie caveat, npm commands, and ADR index

### Changed
- Project folder renamed from `streamlive/` → `stream-live/` to match npm package name and `gh repo create` slug convention
- README expanded with deploy instructions and architecture overview

### Fixed
- `npm run deploy` now works correctly (was missing in V1.0)
- `npm start` runs a proper local server, avoiding `file://` origin cookie issues

---

## [1.0.0] — 2026-03-22

### Added
- Initial release — complete vanilla HTML/CSS/JS video platform
- 14 seed videos across 6 categories (Nature, City, Ocean, Food, Tech, Sport)
- Free video playback with real `<video>` element and public sample sources
- Cookie-based session auth (`SL.cookies` — real `document.cookie`, not localStorage)
- Login / Signup modal with demo account (`demo@streamlive.io` / `demo1234`)
- Premium gate modal with monthly ($7.99) and annual ($59.99) subscription plans
- Per-video purchase for purchasable premium videos
- `pendingAction` pattern — resumes interrupted user intent after login
- Drag-and-drop video upload with progress simulation and premium toggle
- Live search and category filter with sort order (Newest / Most Viewed / Free First)
- "My Uploads" category tab (visible after login only)
- Toast notification system with success / error / info types
- Stream Live design system: Syne + JetBrains Mono + Lora, electric mint + warm orange palette
- Responsive layout down to 320px
- Keyboard navigation and ARIA roles on all interactive elements
- Footer with honest cookie disclosure

---

## Roadmap (see also docs/TODO.md)

| Version | Theme |
|---|---|
| V1.2 | Backend API (Node/Express or Supabase) |
| V1.3 | Real payment integration (Stripe) |
| V2.0 | Creator dashboard, analytics, comments |
