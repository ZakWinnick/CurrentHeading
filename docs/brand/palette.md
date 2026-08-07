# Current Heading palette

Design system name: **Sectional Noir**

These are not new colours. They are the existing `src/styles/global.css` tokens
converted from OKLCH to sRGB hex so that image generation tools, Claude Design,
and any external collaborator can match the site exactly. Nothing on the live
site shifted when this file was written.

## The six named colours

| Name | Hex | Token | Role |
|------|-----|-------|------|
| Ramp Black | `#0E0A08` | `--ww-canvas` | Page canvas. Warm near black, never pure black |
| Hangar | `#171310` | `--ww-surface` | Raised surface, used sparingly for quiet contrast |
| Sectional Line | `#342F2C` | `--ww-line` | Hairlines, borders, and all structural line work in textures |
| Oxide | `#DD6836` | `--ww-accent` | Actions, metadata, and small signals. Under 10 percent of visual weight |
| Chart Paper | `#F0EAE3` | `--ww-paper` | Primary text |
| Dusk Bone | `#CFCAC2` | `--ww-bone` | Secondary text and faint chart marks |

## Supporting tokens

These carry the same palette at other lightness steps. They are not part of the
named six but every generated asset stays inside their range.

| Hex | Token | Role |
|-----|-------|------|
| `#211C19` | `--ww-surface-high` | Raised surface, one step up |
| `#A39D98` | `--ww-muted` | Secondary text that still passes WCAG AA at small sizes |
| `#F3743F` | `--ww-accent-hover` | Hover state for Oxide only |

## Rules

1. Every generated asset stays inside this palette. No exceptions.
2. Oxide stays under roughly 10 percent of the visual weight of any asset or
   any section of the page. It signals, it does not decorate.
3. Neutrals carry the page. If an asset reads as colourful, it is wrong.
4. No asset may reduce body text contrast. Decorative layers sit at 4 to 7
   percent opacity and are removed entirely under `prefers-contrast: more`.

## Conversion note

Hex values were computed from the OKLCH source tokens through OKLab to linear
sRGB to gamma encoded sRGB. OKLCH remains the source of truth in
`global.css`. If a token changes there, regenerate this table rather than
editing the hex by hand.
