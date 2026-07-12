# Current Heading Design System

## Direction

A photographer's field notebook laid over a technical site plan. The site is a restrained dark evolution of the existing identity: image-led, calm, precise, and practical.

## Color

- Canvas: warm near-black charcoal, never pure black.
- Raised surface: a slightly lighter charcoal used sparingly.
- Primary text: warm off-white.
- Secondary text: warm gray that passes WCAG AA at small sizes.
- Accent: oxide orange, limited to actions, metadata, and small signals.
- Avoid full-section accent fills and ornamental gradients.

## Typography

- Display: Archivo, normally 600 or 700. Reserve 800 for the compact wordmark.
- Body: Manrope, 400 to 600.
- Metadata: JetBrains Mono, only for dates, durations, and compact technical labels.
- Hero headings remain substantial but must not occupy more than one third of a desktop viewport.
- Body measure stays between 45 and 70 characters.

## Layout

- Maximum content width: 1280px.
- Mobile-first spacing with clear alternation between broad image moments and quieter text sections.
- Use simple responsive grids for live media, memberships, and products.
- The homepage sequence is Hero, About, Latest Videos, Instagram, Ground Loop, Patreon, Shop, Footer.

## Components

- Navigation: compact wordmark and direct anchors to Channel, About, Ground Loop, Patreon, and Shop. Mobile uses a native disclosure.
- Hero: one real photograph, one headline, one supporting sentence, one primary action, one secondary action.
- About: short creator statement, portrait, and method-focused copy without a credential ledger.
- Latest videos: six live YouTube entries with an honest channel link if the API is unavailable.
- Instagram: the live Behold feed with an honest profile link if unavailable.
- Ground Loop: compact cover, description, live player, and destination link.
- Patreon: live member count and published tiers, with no static or invented membership data.
- Shop: all products returned by the live Fourthwall integration, with a shop link if unavailable.

## Motion

No marquee, scanlines, grain layer, bounce, or decorative looping motion. Hover and focus transitions may use short ease-out transforms. Honor `prefers-reduced-motion`.

## Imagery

Use Zak's real photography. Serve responsive AVIF and WebP variants with explicit dimensions. The hero is a semantic `<picture>` with priority loading. Below-the-fold images are lazy-loaded.
