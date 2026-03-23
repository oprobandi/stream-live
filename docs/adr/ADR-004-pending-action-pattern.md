# ADR-004: pendingAction pattern for post-auth flow resumption

**Date:** 2026-03-23  
**Status:** Accepted  
**Deciders:** Stream Live core team

## Context

Reference File 2 (Lumina) contained the most architecturally interesting feature of the three implementations: a `window.pendingAction` that stores a function to be replayed after login. The prior implementations (File 1 and Lumière) dropped the user at a blank state after auth, requiring them to re-navigate to whatever they had been doing.

## Decision

Implement `SL.store.pendingAction` — a nullable function reference on the central store. Any controller that opens auth on the user's behalf first sets `pendingAction` to a closure that re-triggers the original intent. `SL.auth._completeAuth()` checks and fires the pending action after a 300ms pause (allowing the modal close animation to complete).

```js
// Example: upload opens auth if not logged in
open() {
  if (!SL.store.user) {
    SL.store.pendingAction = () => SL.upload.open();
    SL.auth.open('login', 'Sign in to upload your videos.');
    return;
  }
  // … continue with upload
}
```

## Consequences

**Positive:**
- Users never lose context after authenticating — the intended action completes automatically
- Works across all three protected actions: Upload, Premium Subscribe, Per-video Purchase
- The 300ms delay prevents the pending action from firing while the modal close animation is still running

**Negative:**
- `pendingAction` is a single slot — if two actions race (unlikely in this UI), only the last one is stored
- The closure captures references at call time — stale state is possible in edge cases
