# Changelog

All notable changes to Stream Live are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.3.0] — 2026-03-23

> **Polish & UX release.** Clears the entire 🟡 V1.x backlog. No backend required — all improvements are client-side. See ADR-008 and ADR-009.

### Added
- **IndexedDB upload persistence** (`assets/js/idb.js`) — uploaded videos now survive page reload; raw `File` objects stored in IndexedDB, fresh blob URLs generated on init
- **Keyboard focus trap in all modals** (`SL.a11y`) — Tab key cycles within open modal per WCAG 2.1 SC 2.1.2; focus restored to trigger element on close
- **Share button on player modal** — uses Web Share API on mobile, Clipboard API on desktop, toast fallback; copies `?v=<id>` deep-link URL
- **Deep linking** (`?v=<id>`) — opening a shared URL auto-opens the correct video; URL updated on player open/close via `history.replaceState`
- **Mobile search** — search icon tap reveals full-width search bar below navbar on screens ≤ 640px; closes on outside click
- **Dark / Light mode toggle** — sun/moon button in navbar; preference persisted to `localStorage`; full `[data-theme="light"]` CSS variable override
- **Skeleton loaders** — shimmer placeholder cards shown immediately while IndexedDB initialises; individual card thumbnails also shimmer until image loads
- **Video poster attribute** — thumbnail shown in `<video>` element while buffering, eliminating black flash
- **Scroll position memory** — closing the player modal restores exact scroll position instead of jumping to top
- **GitHub Actions deploy** (`.github/workflows/deploy.yml`) — replaces broken `npm run deploy` / Termux `gh-pages`; auto-deploys to GitHub Pages on every push to `main` (see ADR-008)
- `docs/adr/ADR-008-github-actions-deploy.md`
- `docs/adr/ADR-009-v1.3-frontend-improvements.md`

### Changed
- `package.json` — version bumped to `1.3.0`; `gh-pages` devDependency removed; `predeploy`/`deploy` scripts removed
- `assets/js/store.js` — `init()` is now `async` to await IndexedDB bootstrap
- `assets/js/app.js` — `init()` is now `async`; shows skeletons before await; registers mobile search toggle + theme toggle
- `index.html` — added `#nav-search-toggle`, `#theme-toggle`, player share button; added `idb.js` script tag; updated script load-order comment; footer version → V1.3

### Fixed
- Search bar invisible on mobile with no alternative input method
- Uploaded videos lost on page reload
- Modal keyboard navigation leaked focus to background page
- Player opened at wrong scroll position on close
- `<video>` element showed black frame while buffering
- No way to share or bookmark a specific video

### Removed
- `gh-pages` npm package (replaced by GitHub Actions — see ADR-008)
- `npm run deploy` script (deploy now automatic on `git push`)
- `npm run predeploy` script

---

## [1.2.0] — 2026-03-23

> **Deploy hotfix release.** V1.1 was tested on Termux (Android) — two deploy failures were observed and fixed. See ADR-007.

### Fixed
- **gh-pages `src refspec gh-pages does not match any`** — fixed by running `git config user.email / user.name` in `predeploy` and adding `--no-history` flag
- **`vercel.json` `builds` deprecation warning** — replaced legacy format with modern `rewrites` API

### Changed
- `package.json` version bumped to `1.2.0`
- `vercel.json` rewritten to minimal modern format

### Added
- `docs/adr/ADR-007-deploy-fixes-termux.md`

---

## [1.1.0] — 2026-03-23

### Added
- `package.json` with `npm start` and `npm run deploy` scripts
- `netlify.toml`, `vercel.json`, `.gitignore`
- `docs/adr/` — ADR-001 through ADR-006
- `docs/TODO.md`, `CHANGELOG.md`

### Changed
- Project folder renamed `streamlive/` → `stream-live/`

### Fixed
- `npm run deploy` now works
- `npm start` avoids `file://` cookie issues

---

## [1.0.0] — 2026-03-22

### Added
- Initial release — complete vanilla HTML/CSS/JS video platform
- 14 seed videos across 6 categories
- Cookie-based session auth, premium gate, per-video purchase
- `pendingAction` pattern, drag-and-drop upload, live search, toast system
- Stream Live design system: Syne + JetBrains Mono + Lora, electric mint palette

---

## Roadmap

| Version | Theme |
|---|---|
| V1.4 | Backend API (Supabase — real auth, real video metadata) |
| V1.5 | Stripe payments (Checkout for subscriptions + per-video) |
| V2.0 | Creator dashboard, analytics, comments, playlists |
