import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage preserves the brand landing-page component order", async () => {
  const page = await read("src/pages/index.astro");
  const expected = ["<Hero", "<About", "<LatestVideos", "<InstagramFeed", "<Podcast", "<Patreon", "<Shop", "<Footer"];
  let previous = -1;

  for (const marker of expected) {
    const index = page.indexOf(marker);
    assert.ok(index > previous, `${marker} must appear after the previous homepage section`);
    previous = index;
  }

  assert.doesNotMatch(page, /<Lanes|<Marquee|<BigWord/);
  assert.match(page, /<main\b/);
});

test("public source contains no retired or restricted Current Heading phrases", async () => {
  const paths = [
    "src/layouts/Base.astro",
    "src/components/Hero.astro",
    "src/components/About.astro",
    "src/components/Footer.astro",
    "src/components/Patreon.astro",
    "src/lib/youtube.ts",
  ];
  const source = (await Promise.all(paths.map(read))).join("\n");

  for (const phrase of [
    /operator-lens/i,
    /taking flight lessons/i,
    /student pilot/i,
    /no sponsorship strings/i,
    /none ever will/i,
    /be excellent/i,
    /most triumphant/i,
    /charging booth/i,
  ]) {
    assert.doesNotMatch(source, phrase);
  }
});

test("landing-page sections use live integrations without static membership data", async () => {
  const youtube = await read("src/components/LatestVideos.astro");
  const instagram = await read("src/components/InstagramFeed.astro");
  const patreon = await read("src/components/Patreon.astro");
  const shop = await read("src/components/Shop.astro");

  assert.match(youtube, /fetchLatestVideos\(6\)/);
  assert.match(instagram, /BEHOLD_FEED_ID/);
  assert.match(instagram, /behold-widget/);
  assert.match(patreon, /fetchPatreonStats\(\)/);
  assert.match(patreon, /stats\?\.tiers|stats && stats\.tiers/);
  assert.doesNotMatch(patreon, /\bTIERS\b/);
  await assert.rejects(access(new URL("../src/data/tiers.ts", import.meta.url)));
  assert.match(shop, /fetchShopProducts\(\)/);
  assert.doesNotMatch(shop, /products\.slice/);
});

test("navigation retains section access on mobile", async () => {
  const nav = await read("src/components/Nav.astro");
  const hero = await read("src/components/Hero.astro");
  assert.match(nav, /<details[^>]*class="ww-nav__menu"/);
  assert.match(nav, /<summary[^>]*>\s*Menu\s*<\/summary>/s);
  for (const href of ["#videos", "#about", "#podcast", "#patreon", "#shop"]) {
    assert.match(nav, new RegExp(`href=["']${href}["']`));
  }
  assert.match(hero, /href=["']#videos["']/);
  assert.doesNotMatch(hero, /href=["']#work["']/);
});

test("hero uses responsive priority imagery instead of a CSS background", async () => {
  const hero = await read("src/components/Hero.astro");
  const css = await read("src/styles/global.css");
  assert.match(hero, /<picture\b/);
  assert.match(hero, /type="image\/avif"/);
  assert.match(hero, /type="image\/webp"/);
  assert.match(hero, /fetchpriority="high"/);
  assert.doesNotMatch(css, /\.ww-hero__bg[\s\S]*background-image:\s*url\("\/images\/hero-r1t\.jpg"\)/);
});

test("social card and sitemap are production assets", async () => {
  const base = await read("src/layouts/Base.astro");
  assert.match(base, /https:\/\/currentheading\.com\/images\/og-card\.jpg/);
  await access(new URL("../public/images/og-card.jpg", import.meta.url));
  await access(new URL("../src/pages/sitemap-index.xml.ts", import.meta.url));
});

test("responsive hero assets stay within the transfer budget", async () => {
  const assets = [
    "public/images/hero-r1t-640.avif",
    "public/images/hero-r1t-960.avif",
    "public/images/hero-r1t-1440.avif",
  ];

  for (const path of assets) {
    const info = await stat(new URL(`../${path}`, import.meta.url));
    assert.ok(info.size < 500_000, `${path} must remain below 500 KB`);
  }
});

test("YouTube failures return an honest empty state instead of fake videos", async () => {
  const youtube = await read("src/lib/youtube.ts");
  assert.doesNotMatch(youtube, /const FALLBACK|function placeholder|coming soon/i);
  const emptyReturns = youtube.match(/return \[\];/g) ?? [];
  assert.ok(emptyReturns.length >= 3, "missing credentials, empty API results, and fetch errors must return []");
});

test("homepage keeps the live Ground Loop player and avoids the oversized legacy favicon", async () => {
  const podcast = await read("src/components/Podcast.astro");
  const base = await read("src/layouts/Base.astro");
  assert.match(podcast, /player\.fireside\.fm/);
  assert.match(podcast, /player\.fireside\.fm\/v3\/cSzCML9e\/latest\?theme=dark/);
  assert.match(podcast, /<iframe/);
  assert.doesNotMatch(base, /favicon\.ico/);
});

test("large below-fold photographs use responsive modern sources", async () => {
  for (const path of ["src/components/About.astro", "src/components/Podcast.astro"]) {
    const source = await read(path);
    assert.match(source, /<picture\b/);
    assert.match(source, /type="image\/avif"/);
    assert.match(source, /type="image\/webp"/);
  }
});

test("About omits the removed charging-site quote", async () => {
  const about = await read("src/components/About.astro");
  const css = await read("src/styles/global.css");
  assert.doesNotMatch(about, /The plug is only part of the stop/i);
  assert.doesNotMatch(about, /ww-about__quote/);
  assert.doesNotMatch(css, /\.ww-about__quote/);
});

test("hero content is vertically centered below the fixed header", async () => {
  const css = await read("src/styles/global.css");
  assert.match(css, /\.ww-hero\s*\{[^}]*align-items:\s*center/s);
  assert.match(css, /\.ww-hero\s*\{[^}]*padding:\s*calc\(68px \+ 2rem\) var\(--ww-gutter\) 2rem/s);
});

test("desktop navigation link text is vertically centered", async () => {
  const css = await read("src/styles/global.css");
  assert.match(css, /\.ww-nav__links a,\s*\.ww-nav__cta\s*\{[^}]*display:\s*inline-flex/s);
});

test("Community heading and introduction use compact spacing", async () => {
  const css = await read("src/styles/global.css");
  assert.match(css, /\.ww-patreon \.ww-section-intro\s*\{[^}]*margin-bottom:\s*1\.25rem/s);
});

test("desktop Shop copy is vertically centered beside products", async () => {
  const css = await read("src/styles/global.css");
  assert.match(css, /@media \(min-width: 760px\)[\s\S]*?\.ww-shop__grid\s*\{[^}]*align-items:\s*center/s);
});
