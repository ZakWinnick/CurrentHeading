# Brand asset manifest

Generated 2026-08-07 through the Higgsfield MCP tools. Design system:
**Sectional Noir**. All assets are abstract. Nothing depicts a charger, an
aircraft, a vehicle, or a person, and no asset carries baked in text.

## Credits

| Line | Requests | Credits |
|------|----------|---------|
| Textures, overlays, patterns, macro (Nano Banana Pro, 2k) | 11 | 22 |
| Section marks (GPT Image 2, 2k, high quality) | 3 | 21 |
| Regeneration of one overlay after a filter false positive | 1 | 2 |
| **Total** | **15** | **45** |

Approved budget was 43 credits for 14 assets. The extra 2 credits are the
single regeneration described below. Balance before the run was 1176.

## Model note

The plan specified `nano_banana_pro` and `gpt_image_2` and those are the model
IDs that were submitted. The service reported the fulfilling model back as
`nano_banana_2` for the Nano Banana Pro requests, and an internal
`videotape-alpha` behind the `gpt_image_2` endpoint. This is recorded here
because it is what actually served the images, not what was asked for.

## Assets

All paths are relative to `public/images/brand/`.

Filenames below are the PNG masters as generated. **What ships is the WebP
conversion of each**, at 1.5 MB in total against 51.9 MB of PNG. The masters
are not committed. `public/images/brand/README.md` explains how to recover one,
and `src/styles/brand.css` references the `.webp` files throughout.

### textures/

Structural chart line work. Full bleed section backgrounds, 2752x1536, painted
at 5 percent opacity.

| File | Motif | Model | Credits |
|------|-------|-------|---------|
| `textures/sectional.png` | Airspace boundaries, dashed corridors, range rings | Nano Banana Pro | 2 |
| `textures/contour.png` | Topographic contours that also read as charge curves | Nano Banana Pro | 2 |
| `textures/isobar.png` | Isobar streamlines suggesting current flow | Nano Banana Pro | 2 |
| `textures/grid.png` | Engineering site plan grid with registration marks | Nano Banana Pro | 2 |

### overlays/

Atmosphere passes rendered on pure black for `screen` blend compositing.
2752x1536, painted at 5 to 7 percent opacity.

| File | Motif | Model | Credits |
|------|-------|-------|---------|
| `overlays/haze.png` | Soft warm directional light haze | Nano Banana Pro | 2 |
| `overlays/grain.png` | Fine even monochrome noise plate | Nano Banana Pro | 2 + 2 |
| `overlays/bloom.png` | Broad soft Oxide glow bloom | Nano Banana Pro | 2 |

`overlays/grain.png` was generated twice. The first attempt returned an `nsfw`
status, which was a false positive on an abstract noise plate. It was
regenerated once with reworded prompt text, per the regenerate once rule, and
the second attempt succeeded. Only the second result is used.

### patterns/

Tiling repeats, 2048x2048, tiled at 340px and painted at 4 percent opacity.

| File | Motif | Model | Credits |
|------|-------|-------|---------|
| `patterns/compass.png` | Compass roses and radial heading tick marks | Nano Banana Pro | 2 |
| `patterns/connector.png` | Abstract pin arrays, contact rings, circuit traces | Nano Banana Pro | 2 |

Both were prompted for seamless edges. Verify tiling before relying on the
repeat at small background sizes.

### macro/

Abstract material studies, 2752x1536. Photographic but non representational.

| File | Motif | Model | Credits |
|------|-------|-------|---------|
| `macro/aluminium.png` | Brushed anodized aluminium, directional grain | Nano Banana Pro | 2 |
| `macro/composite.png` | Matte woven composite, light absorbing | Nano Banana Pro | 2 |

## Generated then dropped

Three abstract section marks were generated and later removed from the repo:

| File | Motif | Model | Credits |
|------|-------|-------|---------|
| `marks/channel` | Compass heading needle merged with a play triangle | GPT Image 2 | 7 |
| `marks/loop` | Closed taxiway circuit crossed by a signal trace | GPT Image 2 | 7 |
| `marks/shop` | Geometric parcel form built from a folded chart plane | GPT Image 2 | 7 |

They were never wired into a component. Each was flat art on an opaque white
background, so using one meant knocking the white out to transparent first, and
`current-heading-mark-*.svg` and the wordmark already carry the identity. That
made them 21 credits of asset with no role.

The 21 credits stay in the totals above because they were spent. The file map
in `public/images/brand/README.md` no longer lists them; the source generations
remain in the Higgsfield history if they are ever wanted back.

## Not generated

- **Logo.** Current Heading already has a committed mark and wordmark in
  `public/images/`. Regenerating a settled identity is a downgrade.
- **Photography.** No generated hero, product, action, detail, or lifestyle
  imagery. Real photography stays Zak's work. This is a credibility line for a
  channel built on being present at the thing being filmed.
- **Motion loop.** Priced at 45 credits and deliberately declined. See
  `DESIGN.md` on decorative looping motion.

## Prompts

Full prompt text for every asset is preserved in the Higgsfield generation
history against the job IDs. Prompts locked the palette by hex, forbade text,
and forbade any recognisable product or person.
