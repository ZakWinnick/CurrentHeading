# Brand assets

Generated abstract texture, pattern, atmosphere, and mark assets for the
Sectional Noir system. See `docs/brand/manifest.md` for what each one is and
`docs/brand/embed-guide.md` for how the layer works.

## The image files are not in this commit

The session that generated these assets could not download them. The Higgsfield
CDN host `d8j0ntlcm91z4.cloudfront.net` is denied by the org egress policy, so
every fetch returned `403` on CONNECT. The CSS layer, the component wiring, and
all documentation are committed and complete. Only the fourteen binaries are
missing.

Until they are added, every decorative layer paints nothing and the sections
fall back to flat canvas. The site builds and renders correctly either way.

## Adding them

From a machine with normal network access, run:

```bash
./scripts/fetch-brand-assets.sh
```

That writes all fourteen files to the right paths under this folder. Then
commit them.

Alternatively download each file from the Higgsfield generation history and
place it by hand using the table below.

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

## Before committing the binaries

These are 2k PNGs and will be large. The rest of `public/images/` is served as
AVIF and WebP with explicit dimensions, per `DESIGN.md`. Convert these to WebP
at minimum before committing, and update the `url()` references in the brand
asset layer at `src/styles/brand.css` to match. The fetch script
will do the conversion if `cwebp` or `sharp` is available.
