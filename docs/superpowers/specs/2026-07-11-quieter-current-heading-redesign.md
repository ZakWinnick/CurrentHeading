# Quieter Current Heading Redesign

## Objective

Rebuild the Current Heading homepage as a quieter, content-first evolution of the existing dark identity while preserving its strongest photography and direct voice.

## Approved direction

Zak approved the audit recommendation to retain the dark photographic DNA while reducing visual intensity. The north-star composition keeps the R1T hero photograph, a smaller left-aligned headline, a calm three-lane index, an asymmetric featured-work layout, a compact About block, and a restrained Ground Loop feature.

The generated mock is directional only. Its Colorado reference, fabricated story titles, aviation imagery, and other invented content must not enter production.

## Content architecture

1. Navigation with Work, About, Ground Loop, and Support.
2. Hero with the three editorial lanes, creator-first supporting copy, and a primary Latest Work action.
3. Three-lane index for EV ownership, charging and infrastructure, and aviation.
4. Latest Work with one featured video and no more than two secondary videos.
5. About Zak with real portrait and concise creator framing.
6. Ground Loop with real artwork, one homepage destination, and the existing player.
7. Paired Support and Shop links without membership pricing on the homepage.
8. Compact footer with current destinations and contact information.

## Copy requirements

- Remove `operator-lens`, flight-training statements, permanent anti-sponsorship claims, and retired Wyld Wattage language.
- Do not present Rangeway, BARC, or NorCal EVs titles as the homepage identity.
- Keep EV ownership, charging and infrastructure, and aviation parallel.
- Follow the Current Heading public voice rules, including no em dashes, emoji, hashtags, or sentence-opening conjunctions.
- Correct all Charging Hangar and membership-name spellings in fallback data.

## Visual requirements

- Near-black tinted neutrals, warm off-white text, and restrained oxide orange.
- Archivo at lower weights and a materially smaller display scale.
- Mono restricted to metadata.
- No marquee, scanline layer, grain overlay, giant footer wordmark, or saturated accent section.
- Clear quiet intervals and no repeated equal-card grid for featured work.

## Technical requirements

- Keep Astro and existing build-time integrations.
- Add semantic `<main>`, valid heading order, visible focus styles, mobile section navigation, and usable touch targets.
- Convert the hero into responsive AVIF and WebP sources and reduce total hero transfer substantially.
- Repair the missing Open Graph card and sitemap.
- Keep dynamic data failures safe and on-brand.
- Preserve zero horizontal overflow at mobile widths.

## Verification

- Automated structural and copy regression checks.
- `npm run build` succeeds without errors.
- Browser review at 1440px desktop and approximately 430px mobile.
- Lighthouse mobile performance and accessibility rechecked against the audited baseline.
- Workspace source scan contains none of the retired public phrases.
