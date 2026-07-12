import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage follows the approved content-first section order", async () => {
  const page = await read("src/pages/index.astro");
  const expected = ["<Hero", "<Lanes", "<LatestVideos", "<About", "<Podcast", "<Patreon", "<Shop", "<Footer"];
  let previous = -1;

  for (const marker of expected) {
    const index = page.indexOf(marker);
    assert.ok(index > previous, `${marker} must appear after the previous homepage section`);
    previous = index;
  }

  assert.doesNotMatch(page, /<Marquee|<InstagramFeed|<BigWord/);
  assert.match(page, /<main\b/);
});

test("public source contains no retired or restricted Current Heading phrases", async () => {
  const paths = [
    "src/layouts/Base.astro",
    "src/components/Hero.astro",
    "src/components/About.astro",
    "src/components/Footer.astro",
    "src/data/tiers.ts",
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

test("fallback membership names match Current Heading decisions", async () => {
  const tiers = await read("src/data/tiers.ts");
  assert.match(tiers, /name: "Day-trip"/);
  assert.match(tiers, /name: "Cross-country"/);
  assert.match(tiers, /name: "Long-haul"/);
  assert.match(tiers, /Charging Hangar/);
});

test("navigation retains section access on mobile", async () => {
  const nav = await read("src/components/Nav.astro");
  assert.match(nav, /<details[^>]*class="ww-nav__menu"/);
  assert.match(nav, /<summary[^>]*>\s*Menu\s*<\/summary>/s);
  for (const href of ["#work", "#about", "#podcast", "#support"]) {
    assert.match(nav, new RegExp(`href=["']${href}["']`));
  }
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

test("YouTube fallback respects the requested homepage limit", async () => {
  const youtube = await read("src/lib/youtube.ts");
  const limitedFallbacks = youtube.match(/return FALLBACK\.slice\(0, limit\);/g) ?? [];
  assert.equal(limitedFallbacks.length, 2, "missing-credential and fetch-error paths must both honor limit");
});

test("homepage avoids eager podcast audio and the oversized legacy favicon", async () => {
  const podcast = await read("src/components/Podcast.astro");
  const base = await read("src/layouts/Base.astro");
  assert.doesNotMatch(podcast, /player\.fireside\.fm|<iframe/);
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
