# ADR-003: Free-first, non-compulsive authentication

**Date:** 2026-03-23  
**Status:** Accepted  
**Deciders:** Stream Live core team

## Context

All three reference implementations claimed a "free-first" philosophy but implemented it with varying fidelity:

- File 1: persistent "Sign In" button in the navbar creates ambient auth pressure
- File 2: Upload and Premium nav links route unauthenticated users into the auth flow without warning
- File 3 (Lumière): most faithful — explicit "Maybe later — keep browsing free" escape at equal visual weight to the subscribe CTA

## Decision

**Free content never requires auth.** Auth is only triggered by user-initiated premium actions. Specifically:

1. The navbar for logged-out users shows "Sign In" and "Join Free" — but these are never the only path to content
2. The premium gate modal always renders a `btn-link` escape: "Maybe later — keep browsing free"
3. `SL.app.handleVideoClick()` checks `video.premium` first and calls `SL.player.open()` directly for free content — the auth/gate stack is never even invoked
4. The Upload nav button is hidden until the user is signed in — it does not appear as a broken/locked affordance

## Consequences

**Positive:**
- Eliminates the "dark pattern" of implied lock-out — users discover premium through positive curiosity, not frustration
- Increases trust signal, especially for first-time visitors
- The "Maybe later" button is a direct implementation of opt-out UX guidelines

**Negative:**
- Slightly reduced conversion pressure (intentional trade-off)
- "My Uploads" category tab is hidden until auth — this could surprise returning users who expect to see it
