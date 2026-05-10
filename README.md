# Wyld Wattage

Brand homepage for [Wyld Wattage](https://wyldwattage.com), a YouTube channel reviewing DC fast charging sites from an operator's POV.

## Stack

- **[Astro](https://astro.build)** — static site framework
- **[Tailwind CSS](https://tailwindcss.com)** — styling
- **[Cloudflare Pages](https://pages.cloudflare.com)** — hosting + serverless functions
- **TypeScript** where it adds value

## Getting started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs at `http://localhost:4321` by default.

## Project structure

```
/
├── public/                   # static assets
│   ├── images/               # site imagery, including ww-logo.png
│   └── favicon.ico
├── src/
│   ├── components/           # Astro components (one per section)
│   ├── data/                 # content that changes more often than design
│   │   └── tiers.ts          # Patreon tier definitions
│   ├── layouts/
│   │   └── Base.astro        # base HTML shell
│   ├── pages/
│   │   └── index.astro       # the homepage (single-page site)
│   └── styles/
│       └── global.css        # global styles + brand tokens
├── functions/                # Cloudflare Pages Functions
│   └── api/
│       ├── youtube.ts        # YouTube API proxy
│       └── shop.ts           # Fourthwall API proxy
├── astro.config.mjs
└── package.json
```

## Environment variables

Set these in the Cloudflare Pages dashboard (Settings → Environment variables):

| Variable | Purpose |
|----------|---------|
| `YOUTUBE_API_KEY` | Google Cloud API key with YouTube Data API v3 enabled |
| `YOUTUBE_CHANNEL_ID` | Channel ID for @wyldwattage (the `UC...` form) |
| `BEHOLD_FEED_ID` | Behold widget ID for the Instagram embed |
| `FOURTHWALL_PUBLIC_TOKEN` | Fourthwall public storefront token (the `ptkn_...` form) |
| `FOURTHWALL_COLLECTION_SLUG` | Collection to feature in the Shop section (defaults to `all`) |
| `FOURTHWALL_SHOP_HOST` | Storefront host for product URLs (defaults to `wyldwattage.store`) |

For local development, copy `.env.example` to `.env` and fill in values.

## Content updates

Most content changes don't require touching component code:

- **Patreon tiers and perks** → edit `src/data/tiers.ts`
- **Latest videos** → pulled live from YouTube API, no manual updates needed
- **Instagram posts** → managed via [Behold](https://behold.so) dashboard
- **Shop products** → pulled live from Fourthwall Storefront API

Anything else (hero copy, About section, etc.) lives in the relevant component file in `src/components/`.

## External integrations

### YouTube
Pulls latest videos via YouTube Data API v3 using the `playlistItems.list` endpoint against the channel's uploads playlist. Cached at build time. Site rebuilds daily to refresh.

### Instagram
Embedded via Behold (Pro plan). Widget config managed in the Behold dashboard, not in this repo.

### Fourthwall (Shop)
Storefront API proxy lives in `functions/api/shop.ts`. Falls back to a single CTA linking to [wyldwattage.store](https://wyldwattage.store) if the API is unavailable. Don't show broken product cards.

### Patreon
External link only, no API. Points to [members.wyldwattage.com](https://members.wyldwattage.com).

### Podcast
Wyld Wramblings hasn't launched yet. Platform links (Apple Podcasts, Spotify, Overcast, RSS) are intentional placeholders. Update them when the podcast goes live.

## Brand tokens

Defined as CSS custom properties (and Tailwind v4 `@theme` tokens) in `src/styles/global.css`:

| Token | Value |
|-------|-------|
| Background | `#000000` |
| Primary accent | `#e44a26` |
| Text primary | `#ffffff` |
| Text secondary | derived from design spec |

Logo files live in `public/images/`. Use `ww-logo.png` for the WW monogram.

## Style notes

- **No em dashes anywhere.** Use periods, commas, "and", or restructure the sentence.
- **No hashtag strategy** — channel doesn't use them, neither does the site.
- **Voice:** Smart not smug, bold not bro-y, blunt humor welcome especially around infrastructure critique.

## Deployment

Pushes to `main` auto-deploy to Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`
- Custom domain: `wyldwattage.com`

Preview deployments are generated for every PR.

## Performance targets

- Lighthouse 90+ on mobile and desktop
- LCP under 2.5s on 4G
- Images served as WebP with fallbacks

## Known placeholders

These are intentional. Don't "fix" them in cleanup passes:

- Podcast platform links (`#`) — podcast not yet launched
- "Press & sponsorship" footer link — not set up yet
- "Tip line — bad sites" footer link — not built yet

Update these when the underlying thing exists.

## License

© Wyld Media. All rights reserved.