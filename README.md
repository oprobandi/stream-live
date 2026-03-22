# Stream Live V1.1

> Free-first video platform. Browse and watch without friction. Premium unlocks only when you choose it.

---

## Quick Start

Open `index.html` in any modern browser — or deploy the folder to any static host. No build step required.

---

## Features

| Feature | Details |
|---|---|
| 🎬 Free browsing | Watch free videos with zero account needed |
| 🔐 Cookie auth | Real `document.cookie` session (not localStorage) — persists across restarts |
| ✦ Premium gate | Subscribe monthly/annually OR buy individual videos |
| ↑ Upload | Signed-in users upload videos with drag-and-drop |
| 🔍 Search & filter | Live search + category tabs + sort order |
| 🎭 PendingAction | Whatever you tried to do resumes automatically after login |
| 🍪 Cookie policy | Single first-party session cookie. No trackers, no third-party data |

---

## Demo Account

```
Email:    demo@streamlive.io
Password: demo1234
Plan:     Monthly Premium (active)
```

---

## File Structure

```
Stream Live V1.0/
├── index.html              Main HTML + all modal markup
├── assets/
│   ├── css/
│   │   └── main.css        Full design system (Stream Live brand)
│   └── js/
│       ├── data.js         SL namespace init + video/user seed data
│       ├── cookies.js      Real document.cookie CRUD helpers
│       ├── store.js        Central reactive state (user, videos, filters)
│       ├── auth.js         Login, signup, logout, auth modal controller
│       ├── player.js       Video player modal (real <video> element)
│       ├── upload.js       Drag-drop upload flow with progress simulation
│       ├── premium.js      Subscribe + per-video purchase gate modal
│       ├── views.js        All DOM rendering (nav, grid, cards)
│       └── app.js          Init, event delegation, toast system
└── README.md
```

---

## Architecture

**Vanilla HTML5 / CSS3 / ES6+** — no frameworks, no build step, deployable anywhere.

```
window.SL = {
  data    → seed videos & users (mutable in-memory)
  cookies → document.cookie CRUD (real cookies, not localStorage)
  store   → reactive state (user, videos, filters, pendingAction)
  auth    → login / signup / logout / modal
  player  → <video> element modal
  upload  → drag-drop → form → progress → publish
  premium → subscribe / per-video purchase / gate modal
  views   → renderNav / renderGrid / card templates
  app     → init / handleVideoClick / goHome / toast
  toast   → queued notification system
}
```

**PendingAction pattern** (from reference File 2): when an unauthenticated user tries a protected action, the action is stored as a function and automatically replayed after successful auth.

---

## Auth Philosophy

- **No account required** to browse or play free videos — ever
- Auth modal only opens when the user actively triggers a premium action
- Premium gate modal always has a "Maybe later — keep browsing free" escape
- Subscription is never presented as the only option for premium content: per-video purchase is available where configured

---

## Deployment

### ⚠️ Before you deploy

Edit `package.json` and replace `your-github-username` with your actual GitHub username:
```json
"homepage": "https://YOUR_USERNAME.github.io/stream-live"
```

### GitHub Pages (the curated commands)

```bash
unzip ~/storage/downloads/"Stream Live V1.1.zip" -d ~/
cd ~/stream-live
npm install
git init && git add . && git commit -m "feat: Stream Live v1.1.0"
gh repo create stream-live --public --source=. --remote=origin --push
npm run deploy
```

Your site will be live at `https://YOUR_USERNAME.github.io/stream-live`

### Local dev server

```bash
npm start
# → http://localhost:3000
```

> **Note on cookies:** `document.cookie` is blocked on `file://` origins in Chromium.  
> Always use `npm start` (or any static server) for full session cookie behaviour.  
> Safari and Firefox allow cookies on `file://` for quick testing.

### Netlify

Drag-and-drop the `stream-live/` folder at [app.netlify.com](https://app.netlify.com) — `netlify.toml` handles the SPA redirect rule automatically.

### Vercel

```bash
npx vercel --prod
```

### Apache / Nginx

Copy the folder to your webroot — no `.htaccess` required.

---

## Notes

- Video sources use public Google sample MP4s (requires internet connection)
- Payments are fully simulated — no real charges occur
- New users registered in a session persist in-memory only (no backend)
- Uploaded video blobs use `URL.createObjectURL()` — they do not persist across page reloads

---

## Design System

| Token | Value |
|---|---|
| Primary | `#00e5a0` (electric mint) |
| Premium | `#ff7043` (warm orange) |
| Background | `#07090f` |
| Display font | Syne (Google Fonts) |
| Mono font | JetBrains Mono (Google Fonts) |
| Body font | Lora (Google Fonts) |

---



---

## Documentation

| Document | Location |
|---|---|
| Architecture Decision Records | `docs/adr/` |
| Backlog & TODO | `docs/TODO.md` |
| Changelog | `CHANGELOG.md` |

### ADR Index

| # | Decision |
|---|---|
| ADR-001 | Vanilla JS over a framework |
| ADR-002 | Real `document.cookie` over localStorage |
| ADR-003 | Free-first, non-compulsive authentication |
| ADR-004 | `pendingAction` pattern for post-auth flow resumption |
| ADR-005 | Stream Live design system |
| ADR-006 | Dual monetisation — subscription + per-video purchase |

---

*Stream Live V1.1 · © 2026 · Built without dark patterns*
