# ADR-002: Real document.cookie over localStorage

**Date:** 2026-03-23  
**Status:** Accepted  
**Deciders:** Stream Live core team

## Context

Reference File 1 (StreamLine) used `localStorage` despite being briefed to use cookies. Reference File 2 (Lumina) correctly used `document.cookie`. The prior Lumière artifact used an in-memory simulation due to sandbox constraints.

## Decision

Use real `document.cookie` via the `SL.cookies` helper (`assets/js/cookies.js`). Session is stored as a JSON-encoded, HTTP-path-scoped, `SameSite=Lax` cookie with a 7-day TTL.

## Consequences

**Positive:**
- Survives browser restarts and tab closes (unlike sessionStorage)
- Matches the original specification
- Cookie is scoped to path `/` and `SameSite=Lax` — safe from cross-site request forgery in standard usage
- Footer and README honestly document the single cookie in use

**Negative:**
- Cookies are sent with every HTTP request to the origin — minor overhead vs localStorage
- Cannot be accessed from a `file://` origin in some browsers (Chromium blocks `document.cookie` on `file://`). Use `npx serve .` or any static host for full session persistence.

**Mitigations:**
- The app degrades gracefully: if the cookie read fails, the user is simply treated as logged out
- README documents the `file://` caveat and provides the `npm start` workaround
