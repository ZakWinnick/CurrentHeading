# Brand asset embed guide

The texture and atmosphere layer is already wired into the homepage. This
document explains how it works, what is currently applied, and how to change it.

The CSS lives at `src/styles/brand.css` under the heading
"Brand asset layer: Sectional Noir".

## How it works

Two decorative slots are painted by pseudo elements on a section:

- `::before` carries the **texture**: structural chart line work, a tiling
  pattern, or a material study. It sits at the bottom of the section.
- `::after` carries the **atmosphere**: haze, bloom, or grain, composited with
  `mix-blend-mode: screen` so the black in the source drops out and only the
  light survives.

Because both are pseudo elements they never affect layout, never enter the
accessibility tree, and never take pointer events. A missing asset file paints
nothing, so the section falls back to flat canvas rather than breaking.

## Applying a layer

Add `ww-tex` plus one texture modifier to any element. Add `ww-atmo` plus one
atmosphere modifier for the second slot. The two are independent and can be
used together or on their own.

```html
<section class="ww-section ww-about ww-tex ww-tex--contour">
<section class="ww-section ww-podcast-section ww-tex ww-tex--isobar ww-atmo ww-atmo--bloom">
```

### Texture modifiers

| Class | Asset | Behaviour |
|-------|-------|-----------|
| `ww-tex--sectional` | `textures/sectional.webp` | Cover |
| `ww-tex--contour` | `textures/contour.webp` | Cover |
| `ww-tex--isobar` | `textures/isobar.webp` | Cover |
| `ww-tex--grid` | `textures/grid.webp` | Cover |
| `ww-tex--aluminium` | `macro/aluminium.webp` | Cover |
| `ww-tex--composite` | `macro/composite.webp` | Cover |
| `ww-tex--compass` | `patterns/compass.webp` | Tiled at 340px |
| `ww-tex--connector` | `patterns/connector.webp` | Tiled at 340px |

### Atmosphere modifiers

| Class | Asset | Behaviour |
|-------|-------|-----------|
| `ww-atmo--haze` | `overlays/haze.webp` | Cover, screen blend |
| `ww-atmo--bloom` | `overlays/bloom.webp` | Cover, screen blend |
| `ww-atmo--grain` | `overlays/grain.webp` | Tiled at 600px, screen blend |

## Currently applied

| Section | Component | Classes |
|---------|-----------|---------|
| About | `About.astro` | `ww-tex ww-tex--contour` |
| Latest videos | `LatestVideos.astro` | `ww-tex ww-tex--grid` |
| Ground Loop | `Podcast.astro` | `ww-tex ww-tex--isobar ww-atmo ww-atmo--bloom` |
| Patreon | `Patreon.astro` | `ww-tex ww-tex--sectional` |
| Shop | `Shop.astro` | `ww-tex ww-tex--connector` |

Two surfaces are deliberately left clean:

- **Hero.** It already carries a real photograph and a scrim. Its children are
  absolutely positioned, and `ww-tex > *` would force them to `relative` and
  break the layout. Do not add `ww-tex` to `.ww-hero`.
- **Instagram.** The Behold feed is dense with imagery already. A texture
  behind it reads as noise.

## Tuning opacity

Both slots read a custom property, so a single section can be tuned without
touching the shared rule.

```css
.ww-podcast-section {
  --ww-tex-opacity: 0.04;
  --ww-atmo-opacity: 0.06;
}
```

Defaults are 0.05 for cover textures, 0.04 for tiling patterns, 0.07 for haze
and bloom, and 0.05 for grain. Raising these past roughly 0.10 starts to eat
body text contrast. Check any change against Chart Paper on Ramp Black before
committing it.

## Readability guards

The whole decorative layer is removed under `prefers-contrast: more` and in
print. This is intentional and should not be relaxed. If a texture is load
bearing enough that removing it breaks the design, the design is wrong.

## Adding a new texture later

1. Generate it inside the palette in `docs/brand/palette.md`. No text, nothing
   representational.
2. Drop the file under the matching folder in `public/images/brand/`.
3. Add one modifier class to the brand asset layer in `src/styles/brand.css`.
4. Record it in `docs/brand/manifest.md` with its model and credit cost.
