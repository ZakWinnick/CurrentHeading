# Brand assets

Generated abstract texture, pattern, atmosphere, and mark assets for the
Sectional Noir system. See `docs/brand/manifest.md` for what each one is and
`docs/brand/embed-guide.md` for how the layer works.

## What ships

Fourteen WebP files, 1.5 MB in total. That is what `src/styles/brand.css`
references and what the site serves.

```
textures/   sectional  contour  isobar  grid
overlays/   haze  grain  bloom
patterns/   compass  connector
marks/      channel  loop  shop
macro/      aluminium  composite
```

The 2k PNG masters these were converted from are deliberately **not** committed.
At 51.9 MB against 1.5 MB of WebP they were pure weight for files nothing
loaded. Recover any of them with the fetch script below. The layer renders at 4
to 7 percent opacity, where the difference between the two formats is not
detectable.

## Regenerating a master

```bash
bash scripts/fetch-brand-assets.sh --webp
```

That re-downloads all fourteen PNG masters from the Higgsfield CDN and writes
WebP copies beside them. Only the WebP files should be committed. Delete the
PNGs again once you are done with them.

The script is invoked through `bash` because it was committed through the
GitHub API, which cannot set a file mode, so it arrived without its executable
bit. Run `chmod +x scripts/fetch-brand-assets.sh` once if you prefer to call it
directly.

If every download fails with a 403, the machine is behind an egress policy that
blocks the Higgsfield CDN. Download the files from the Higgsfield generation
history instead and place them by hand using the table below.

## File map

Base URL: `https://d8j0ntlcm91z4.cloudfront.net/user_36Rfy1C7ZQuqYqjMQjnkt58XQV3/`

| Destination | Source filename |
|-------------|-----------------|
| `textures/sectional.png` | `hf_20260807_045303_654aea1d-ff47-49c0-a6ab-462b60131b34.png` |
| `textures/contour.png` | `hf_20260807_045303_711c8732-b743-41ea-bfd0-b1495d212026.png` |
| `textures/isobar.png` | `hf_20260807_045303_4814fb1e-1e47-4d04-b534-8b9176125455.png` |
| `textures/grid.png` | `hf_20260807_045303_de6d0ad2-6ffe-4cf9-a3b5-fbeec434ab38.png` |
| `overlays/haze.png` | `hf_20260807_045303_cc76ff67-2e5f-4cf5-8ea4-8b292d547aa7.png` |
| `overlays/grain.png` | `hf_20260807_045424_62102bae-0045-4475-b79a-463e83549798.png` |
| `overlays/bloom.png` | `hf_20260807_045303_e1b34921-04ba-422f-97cb-b7629e7f669c.png` |
| `patterns/compass.png` | `hf_20260807_045303_088c2991-33d2-4698-a0e1-879d8904e8a1.png` |
| `patterns/connector.png` | `hf_20260807_045303_97777858-9f14-4563-9298-04243222244d.png` |
| `marks/channel.png` | `hf_20260807_045303_e19d32fe-1d0f-444b-9b74-72b8daab96c3.png` |
| `marks/loop.png` | `hf_20260807_045303_9925d0f9-8063-49d6-a1d8-41435dccd399.png` |
| `marks/shop.png` | `hf_20260807_045303_7ee5a82d-4361-48a2-9887-0abc8d61d03d.png` |
| `macro/aluminium.png` | `hf_20260807_045316_ea7b0713-95d3-4fbb-90f5-563a2c5725af.png` |
| `macro/composite.png` | `hf_20260807_045316_024a4001-fd2e-4b55-913e-1d65add7f6fc.png` |

## Adding a new asset

Generate it inside the palette in `docs/brand/palette.md`, convert to WebP,
commit only the WebP, add a modifier class in `src/styles/brand.css`, and
record it in `docs/brand/manifest.md` with its model and credit cost.
