# ADR-006: Dual monetisation — subscription AND per-video purchase

**Date:** 2026-03-23  
**Status:** Accepted  
**Deciders:** Stream Live core team

## Context

Reference File 1 (StreamLine) implemented a per-video purchase modal. Reference File 2 (Lumina) implemented subscription only. The prior Lumière artifact implemented subscription only. The brief asked for a merger of the best features.

## Decision

The `SL.premium.openGate()` function presents both paths in a single modal:

1. **Subscribe** (monthly $7.99 / annual $59.99) — shown always for premium videos
2. **Buy this video** (per-video price, e.g. $2.99) — shown only when `video.purchasable === true && video.price !== null`

The gate divider ("or buy just this video") is hidden via `.hidden` when the video is subscription-only — e.g. `id:10 "Quantum Minds"` is `premium: true, purchasable: false`.

Purchased video IDs are stored in `user.purchased[]` and checked by `SL.store.hasPurchased(videoId)`.

## Consequences

**Positive:**
- Mirrors real-world streaming (iTunes/Vudu model alongside Netflix-style subscription)
- Reduces friction for users who want one video without committing to a plan
- `hasPurchased` check persists within the session cookie lifetime

**Negative:**
- Purchased video ownership only persists as long as the user account exists in-memory (no backend in V1.0)
- Two-path gate modal is more complex to maintain than a single CTA
