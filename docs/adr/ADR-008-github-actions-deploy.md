# ADR-008: Move GitHub Pages Deployment to GitHub Actions

**Status:** Accepted  
**Date:** 2026-03-23  
**Version:** V1.3.0

---

## Context

V1.2 attempted to fix `gh-pages` deployment failures on Termux (Android) by setting a git identity in `predeploy` and adding `--no-history`. This resolved the `src refspec` error but introduced a new persistent failure: `EACCES: permission denied` on the `node_modules/.cache/gh-pages/` directory. This is a structural limitation of Android's filesystem enforced by Termux — the `gh-pages` npm package cannot write its git object cache to this path regardless of permissions fixes.

The underlying issue is architectural: running `gh-pages` locally means the deploy machine (the Android phone) must have full git + filesystem write access to a temp clone of the repo. Termux cannot reliably provide this.

---

## Decision

Remove `gh-pages` from `devDependencies` entirely and replace local deployment with a **GitHub Actions workflow** that runs on every push to `main`.

The workflow (`.github/workflows/deploy.yml`) uses `peaceiris/actions-gh-pages@v3` to:
1. Checkout the repo on a clean Ubuntu runner
2. Publish the root directory (`.`) to the `gh-pages` branch with `force_orphan: true`
3. Exclude `.github/`, `node_modules/`, and any `.zip` files

---

## Consequences

**Positive:**
- Termux is now only responsible for `git push` — no local build or deploy step
- The EACCES error is permanently eliminated (no local `gh-pages` cache)
- Every push to `main` automatically triggers a fresh deploy — no manual step needed
- `package.json` is simplified: `predeploy`/`deploy` scripts and `gh-pages` dependency removed
- `npm run deploy` no longer exists — this prevents accidental manual deploy attempts

**Negative:**
- GitHub Actions must be enabled on the repository (default: on for public repos)
- First deploy after merging this ADR requires one push to trigger the Action
- Vercel continues to work in parallel unchanged

---

## Migration

```bash
# One-time setup — run from project root in Termux:
mkdir -p .github/workflows && \
printf 'name: Deploy to GitHub Pages\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write\n    steps:\n      - uses: actions/checkout@v4\n      - uses: peaceiris/actions-gh-pages@v3\n        with:\n          github_token: ${{ secrets.GITHUB_TOKEN }}\n          publish_dir: .\n          publish_branch: gh-pages\n          dotfiles: true\n          force_orphan: true\n          exclude_assets: '"'"'.github,node_modules,*.zip'"'"'\n' > .github/workflows/deploy.yml && \
git add .github/workflows/deploy.yml package.json package-lock.json && \
git commit -m "chore: move gh-pages deploy to GitHub Actions (ADR-008)" && \
git push
```
