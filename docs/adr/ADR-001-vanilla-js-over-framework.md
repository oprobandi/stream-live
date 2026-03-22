# ADR-001: Vanilla HTML/CSS/JS over a framework

**Date:** 2026-03-23  
**Status:** Accepted  
**Deciders:** Stream Live core team

## Context

The project needed to be a single, self-contained deployable — no build step, no bundler, no CI/CD dependency. Three reference implementations were evaluated: a React/Tailwind SPA (File 1), a Vanilla MVC SPA (File 2), and a prior React JSX artifact (File 3).

## Decision

Vanilla HTML5 / CSS3 / ES6+ with a hand-rolled `window.SL` namespace. No transpilation, no JSX, no Tailwind CDN.

## Consequences

**Positive:**
- `index.html` opens directly in any browser — zero build step
- Deployable to any static host including GitHub Pages, Netlify, Vercel, or even a USB stick
- No dependency security surface beyond `gh-pages` and `serve` (devDependencies only)
- Module boundaries are explicit JS files, not opaque bundler chunks

**Negative:**
- No hot module replacement during development
- Templating is string interpolation rather than JSX — XSS must be handled manually via `_esc()`
- No TypeScript — no compile-time type safety

**Mitigations:**
- `_esc()` utility in `views.js` HTML-encodes all user-provided strings before injection
- `npx serve .` provides a local dev server with reasonable DX
