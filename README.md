# Current Heading

Brand homepage for [Current Heading](https://currentheading.com), a YouTube channel covering EV ownership, DC fast charging, and aviation.

## Stack

- **[Astro](https://astro.build)** — static site framework
- **[Tailwind CSS](https://tailwindcss.com)** v4 — styling
- **[GitHub Pages](https://pages.github.com)** — hosting
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
├── .github/workflows/
│   └── deploy.yml            # GitHub Pages build + deploy
├── public/                   # static assets
│   ├── images/               # site imagery, including current-heading-* logos
│   ├── CNAME                 # custom domain (currentheading.com)
│   └── robots.txt
├── src/
│   ├── components/           # Astro components (one per section)
│   ├── data/
│   │   └── tiers.ts          # Patreon tier definitions
│   ├── layouts/
│   │   └── Base.astro        # base HTML shell
│   ├── lib/
│   │   ├── youtube.ts        # build-time YouTube fetch
│   │   └── fourthwall.ts     # build-time Fourthwall fetch (Shop currently disabled)
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css        # global styles + brand tokens
├── astro.config.mjs
└── package.json
```

## Environment variables

All integrations run at **build time**, so the values need to live in GitHub Actions, not in the deployed HTML.

Set these in **Settings → Secrets and variables → Actions** on the GitHub repo:

| Variable | Type | Purpose |
|----------|------|---------|
| `YOUTUBE_API_KEY` | secret | Google Cloud API key with YouTube Data API v3 enabled |
| `YOUTUBE_CHANNEL_ID` | secret | Channel ID for @currentheading (the `UC...` form) |
| `BEHOLD_FEED_ID` | secret | Behold widget ID for the Instagram embed |
| `FOURTHWALL_PUBLIC_TOKEN` | secret | Fourthwall public storefront token (the `ptkn_...` form) |
| `FOURTHWALL_COLLECTION_SLUG` | variable | Collection to feature in Shop (defaults to `all`) |
| `FOURTHWALL_SHOP_HOST` | variable | Storefront host for product URLs |

For local development, copy `.env.example` to `.env` and fill in values. `.env` is gitignored.

## Content updates

Most content changes don't require touching component code:

- **Patreon tiers and perks** → edit `src/data/tiers.ts`
- **Latest videos** → pulled from YouTube API at build time. Workflow rebuilds nightly.
- **Instagram posts** → managed via [Behold](https://behold.so) dashboard, no rebuild needed
- **Shop products** → pulled from Fourthwall Storefront API at build time. Section currently disabled during rebrand.

Anything else (hero copy, About section, etc.) lives in the relevant component file in `src/components/`.

To force a refresh outside the nightly schedule, push to `main` or run the workflow manually from the Actions tab.

## External integrations

### YouTube
Pulls latest videos via YouTube Data API v3 using the `playlistItems.list` endpoint against the channel's uploads playlist (the `UC...` channel ID is converted to `UU...` to get the uploads playlist). Falls back to placeholder cards if env vars are missing.

### Instagram
Embedded via Behold (Pro plan). The Behold script renders the widget client-side using the configured `BEHOLD_FEED_ID`. Widget layout managed in the Behold dashboard.

### Fourthwall (Shop)
Currently disabled. The `<Shop />` component is commented out in `src/pages/index.astro` while merch is updated for the Current Heading brand. The component and its lib are preserved for easy restore.

### Patreon
External link only, no API. Points to [members.currentheading.com](https://members.currentheading.com).

### Podcast
Wyld Wramblings hasn't launched yet. Platform links (Apple Podcasts, Spotify, Overcast, RSS) are intentional placeholders. Update them when the podcast goes live.

## Brand tokens

Defined as CSS custom properties (and Tailwind v4 `@theme` tokens) in `src/styles/global.css`.

Current Heading palette:

| Token | Value | Use |
|-------|-------|-----|
| Ink | `#0E0F11` | Text, mark on light |
| Bone | `#F4F1EA` | Light backgrounds, mark on dark |
| Red | `#B4232A` | Accent only |
| Blue | `#537694` | Rare secondary, data viz |

Discipline: roughly 80% neutrals, 15% red, 5% blue.

Logo files live in `public/images/`. Use `current-heading-mark-{light,dark}.svg` for the mark and `current-heading-wordmark-{light,dark}.svg` for the wordmark version.

## Style notes

- **No em dashes anywhere.** Use periods, commas, "and", or restructure the sentence.
- **No hashtag strategy.** The channel doesn't use them, neither does the site.
- **Voice:** Smart not smug, bold not bro-y, blunt humor welcome especially around infrastructure critique.

## Deployment

Pushes to `main` auto-deploy via GitHub Actions to GitHub Pages.

- Build command: `npm run build`
- Output directory: `dist`
- Custom domain: `currentheading.com` (managed via `public/CNAME` and the GitHub Pages settings)
- Nightly rebuild at 11:00 UTC keeps videos and shop data fresh

**One-time setup**

1. Add the repo secrets and variables listed above.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Point the `currentheading.com` DNS at GitHub Pages (`A` records to GitHub IPs, plus a `CNAME` for `www`).
4. Push to `main`. The workflow builds and deploys.

## Performance targets

- Lighthouse 90+ on mobile and desktop
- LCP under 2.5s on 4G
- Images served as WebP with fallbacks

## Known placeholders

These are intentional. Don't "fix" them in cleanup passes:

- Podcast platform links (`#`). Podcast not yet launched.
- OG card image (`/images/og-card.jpg`). To be designed.
- Shop section commented out. Restore once merch is updated.

Update these when the underlying thing exists.

## License

© Current Heading. All rights reserved.
