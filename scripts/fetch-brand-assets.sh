#!/usr/bin/env bash
#
# Fetch the Sectional Noir brand asset masters into public/images/brand/.
#
# The session that generated these assets could not download them, because the
# Higgsfield CDN is blocked by the org egress policy. Run this from a machine
# with normal network access, then commit the results.
#
# Usage:
#   ./scripts/fetch-brand-assets.sh          fetch PNGs
#   ./scripts/fetch-brand-assets.sh --webp   fetch and also emit WebP
#
set -euo pipefail

BASE="https://d8j0ntlcm91z4.cloudfront.net/user_36Rfy1C7ZQuqYqjMQjnkt58XQV3"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/public/images/brand"

WEBP=0
[[ "${1:-}" == "--webp" ]] && WEBP=1

# destination path : source filename
ASSETS=(
  "textures/sectional.png:hf_20260807_045303_654aea1d-ff47-49c0-a6ab-462b60131b34.png"
  "textures/contour.png:hf_20260807_045303_711c8732-b743-41ea-bfd0-b1495d212026.png"
  "textures/isobar.png:hf_20260807_045303_4814fb1e-1e47-4d04-b534-8b9176125455.png"
  "textures/grid.png:hf_20260807_045303_de6d0ad2-6ffe-4cf9-a3b5-fbeec434ab38.png"
  "overlays/haze.png:hf_20260807_045303_cc76ff67-2e5f-4cf5-8ea4-8b292d547aa7.png"
  "overlays/grain.png:hf_20260807_045424_62102bae-0045-4475-b79a-463e83549798.png"
  "overlays/bloom.png:hf_20260807_045303_e1b34921-04ba-422f-97cb-b7629e7f669c.png"
  "patterns/compass.png:hf_20260807_045303_088c2991-33d2-4698-a0e1-879d8904e8a1.png"
  "patterns/connector.png:hf_20260807_045303_97777858-9f14-4563-9298-04243222244d.png"
  "macro/aluminium.png:hf_20260807_045316_ea7b0713-95d3-4fbb-90f5-563a2c5725af.png"
  "macro/composite.png:hf_20260807_045316_024a4001-fd2e-4b55-913e-1d65add7f6fc.png"
)

fail=0

for entry in "${ASSETS[@]}"; do
  dest="${entry%%:*}"
  src="${entry#*:}"
  out="$DEST/$dest"
  mkdir -p "$(dirname "$out")"

  if curl -fsSL --retry 3 --retry-delay 2 -o "$out" "$BASE/$src"; then
    printf 'ok    %-28s %s\n' "$dest" "$(du -h "$out" | cut -f1)"
  else
    printf 'FAIL  %-28s could not fetch %s\n' "$dest" "$src"
    rm -f "$out"
    fail=1
    continue
  fi

  if [[ $WEBP -eq 1 ]]; then
    if command -v cwebp >/dev/null 2>&1; then
      cwebp -quiet -q 82 "$out" -o "${out%.png}.webp"
      printf '      %-28s webp %s\n' "" "$(du -h "${out%.png}.webp" | cut -f1)"
    else
      echo "      cwebp not found, skipping WebP for $dest" >&2
    fi
  fi
done

if [[ $fail -ne 0 ]]; then
  echo
  echo "Some assets failed. If every one failed with a 403, this machine is also"
  echo "behind the egress policy that blocks the Higgsfield CDN. Download them"
  echo "from the Higgsfield generation history instead and place them using the"
  echo "table in public/images/brand/README.md."
  exit 1
fi

echo
echo "All assets fetched to $DEST"
if [[ $WEBP -eq 1 ]]; then
  echo "Update the url() references in the brand asset layer in"
  echo "src/styles/brand.css from .png to .webp before committing."
fi
