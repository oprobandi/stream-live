# ADR-005: Stream Live design system — electric mint on deep navy

**Date:** 2026-03-23  
**Status:** Accepted  
**Deciders:** Stream Live core team

## Context

Reference File 1 was a YouTube clone (white bg, red accents). Reference File 2 defaulted to the generic "premium dark SaaS" aesthetic: Space Grotesk + Inter, indigo-to-pink gradient, glassmorphism on navy. Both are derivative. The brief asked for a *beautiful merger*, which implied a distinct visual identity.

## Decision

A three-token typographic palette on a near-black ground:

| Role | Font | Rationale |
|---|---|---|
| Display / headings | Syne 700–800 | Geometric, editorial, unusual in video platforms |
| Mono / UI labels | JetBrains Mono 300–500 | Precise, legible at small sizes, nods to creator/tech audience |
| Body / descriptions | Lora italic | Warmth and humanity against the monochrome ground |

Colour system: `#00e5a0` (electric mint) as primary, `#ff7043` (warm orange) as premium accent, `#07090f` ground. The mint reads as "access" and "go", the orange as "value" and "premium" — without using the red/gold clichés of YouTube and Netflix.

## Consequences

**Positive:**
- Distinctive enough to be memorable at first glance
- The Syne + JetBrains pairing is unusual in video platforms — stands out from all three reference implementations
- CSS custom properties (`--primary`, `--premium`, etc.) make re-theming a one-file change

**Negative:**
- Syne and JetBrains Mono are Google Fonts dependencies — offline rendering falls back to system-ui/monospace
- The mint-on-dark palette may reduce contrast for some users in bright ambient light
