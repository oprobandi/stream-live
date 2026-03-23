# ADR-007: Deploy fixes — gh-pages on Termux + vercel.json modernisation

**Date:** 2026-03-23  
**Status:** Accepted  
**Deciders:** Stream Live core team  
**Context:** V1.1 deployed to Termux (Android) mobile environment. Two deploy failures observed.

---

## Issue 1: gh-pages `src refspec gh-pages does not match any`

### Root Cause

`gh-pages` creates an orphan branch commit when deploying. On Termux and many CI environments, git has no globally configured `user.email` or `user.name`. Without an identity, git cannot create the commit, and the branch push fails with:

```
ProcessError: error: src refspec gh-pages does not match any
error: failed to push some refs to 'https://github.com/…'
```

This is **not** a network or permissions error — the repo exists and push auth works (confirmed by `gh repo create --push` succeeding on the same machine).

### Fix Applied (V1.2)

Two changes to `package.json`:

**1. `predeploy` sets git identity before gh-pages runs:**
```json
"predeploy": "git config user.email \"deploy@streamlive.io\" && git config user.name \"Stream Live\" && echo 'Deploying…'"
```
`git config` without `--global` sets the identity at repo level, which is sufficient for the orphan branch commit.

**2. `--no-history` flag on gh-pages:**
```json
"deploy": "gh-pages -d . --dotfiles --no-history"
```
`--no-history` forces gh-pages to create a fresh orphan branch on every deploy rather than attempting to fetch and amend the existing `gh-pages` branch. This eliminates the refspec error even if the previous deploy was incomplete or the branch is in an inconsistent state.

### Consequences
- Each deploy replaces the `gh-pages` branch entirely — no incremental git history on the deploy branch (acceptable for a static site)
- `predeploy` sets a repo-level git identity that persists for the lifetime of the local clone — no effect on other repos
- If the user already has `user.email` set globally, `git config` at repo level simply shadows it (no conflict)

---

## Issue 2: vercel.json `builds` deprecation warning

### Root Cause

V1.1's `vercel.json` used the Vercel v1 configuration format:
```json
{
  "version": 2,
  "builds": [{ "src": "index.html", "use": "@vercel/static" }],
  "routes": [{ "src": "/(.*)", "dest": "/index.html" }]
}
```

Vercel accepted this but emitted a warning:
> "Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply."

The `builds` key is the legacy API. For plain static sites, Vercel auto-detects the project type and needs no `builds` declaration.

### Fix Applied (V1.2)

Replace with the minimal modern format using `rewrites` instead of `routes`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- `builds` removed — Vercel auto-detects static
- `routes` replaced with `rewrites` — the current idiomatic API
- `version` key removed — no longer required in v2 config

### Consequences
- No more warning on `vercel --prod`
- Project Settings in the Vercel dashboard now apply normally
- The SPA redirect rule still works: all paths serve `index.html`

---

## Outcome

Vercel deploy succeeded in V1.1 and will continue to work in V1.2 (warning eliminated).  
GitHub Pages deploy failed in V1.1 and is fixed in V1.2 via the two-part predeploy+no-history approach.
