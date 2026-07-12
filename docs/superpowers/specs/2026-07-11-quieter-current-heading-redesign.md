# Quieter Current Heading Redesign

## Objective

Redesign the Current Heading brand landing page as a quieter evolution of the existing dark identity while preserving its components, live integrations, strongest photography, and direct voice.

## Approved direction

Zak approved the audit recommendation to retain the dark photographic DNA while reducing visual intensity. The redesign is presentation-only: it must retain the established landing-page destinations and must not become a blog or editorial site.

The generated mock is directional only. Its Colorado reference, fabricated story titles, aviation imagery, and other invented content must not enter production.

## Content architecture

1. Navigation with Channel, About, Ground Loop, Patreon, and Shop.
2. Hero with creator-first supporting copy and direct landing-page actions.
3. About Zak with real portrait and concise creator framing.
4. Six latest videos from the live YouTube integration.
5. Instagram photographs from the live Behold feed.
6. Ground Loop with real artwork, destination link, and the live player.
7. Live Patreon membership count and published tiers.
8. Products returned by the live Fourthwall shop integration.
9. Compact footer with current destinations and contact information.

## Copy requirements

- Remove `operator-lens`, flight-training statements, permanent anti-sponsorship claims, and retired Wyld Wattage language.
- Do not present Rangeway, BARC, or NorCal EVs titles as the homepage identity.
- Keep EV ownership, charging and infrastructure, and aviation parallel.
- Follow the Current Heading public voice rules, including no em dashes, emoji, hashtags, or sentence-opening conjunctions.
- Never use invented videos, products, membership counts, or static membership tiers as fallback data.

## Visual requirements

- Near-black tinted neutrals, warm off-white text, and restrained oxide orange.
- Archivo at lower weights and a materially smaller display scale.
- Mono restricted to metadata.
- No marquee, scanline layer, grain overlay, giant footer wordmark, or saturated accent section.
- Clear quiet intervals and restrained grids for live destination content.

## Technical requirements

- Keep Astro and existing build-time integrations.
- Add semantic `<main>`, valid heading order, visible focus styles, mobile section navigation, and usable touch targets.
- Convert the hero into responsive AVIF and WebP sources and reduce total hero transfer substantially.
- Repair the missing Open Graph card and sitemap.
- Keep dynamic data failures safe and on-brand with direct destination links, never fabricated records.
- Preserve zero horizontal overflow at mobile widths.

## Verification

- Automated structural and copy regression checks.
- `npm run build` succeeds without errors.
- Browser review at 1440px desktop and approximately 430px mobile.
- Lighthouse mobile performance and accessibility rechecked against the audited baseline.
- Workspace source scan contains none of the retired public phrases.
