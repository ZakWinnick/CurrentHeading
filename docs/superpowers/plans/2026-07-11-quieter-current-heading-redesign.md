# Quieter Current Heading Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a quieter Current Heading landing page with its original live destinations, corrected public copy, faster imagery, and stronger mobile accessibility.

**Architecture:** Keep the existing Astro component model, landing-page destinations, and build-time integrations while updating the section presentation with a tokenized stylesheet. Add a Node regression test that validates public copy, structure, assets, live integration calls, and honest unavailable states.

**Tech Stack:** Astro 6, TypeScript, CSS, Node test runner, Sharp through a one-time asset-generation command.

## Global Constraints

- Preserve Current Heading as the active brand and keep Wyld Wattage historical only.
- Maintain three parallel lanes: EV ownership, EV charging and infrastructure, and aviation.
- Do not publish flight-training framing, credential-led copy, `operator-lens`, or permanent anti-sponsorship claims.
- Target WCAG 2.2 AA and preserve reduced-motion support.
- Do not deploy or push.

---

### Task 1: Regression contract

**Files:**
- Create: `tests/site-contract.test.mjs`
- Modify: `package.json`

- [ ] Add Node tests for the approved section order, required copy, forbidden copy, landmark and heading structure, mobile navigation control, Open Graph image, sitemap, and on-brand membership fallbacks.
- [ ] Run `npm test` and confirm the tests fail against the current site for the expected missing structure and retired copy.

### Task 2: Landing-page component structure

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/Nav.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/InstagramFeed.astro`
- Modify: `src/components/LatestVideos.astro`
- Modify: `src/components/About.astro`
- Modify: `src/components/Podcast.astro`
- Modify: `src/components/Patreon.astro`
- Modify: `src/components/Shop.astro`
- Modify: `src/components/Footer.astro`
- Delete: `src/data/tiers.ts`

- [x] Implement the approved semantic landing-page sequence with live content and honest unavailable states.
- [x] Preserve YouTube, Instagram, Ground Loop, Patreon, and Fourthwall integrations without static or invented records.
- [ ] Run `npm test` until content and structure checks pass.

### Task 3: Quiet visual system and responsive navigation

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/layouts/Base.astro`

- [ ] Replace pure-black and high-intensity tokens with tinted near-black neutrals and restrained orange.
- [x] Implement the hero, responsive live-content grids, About, Ground Loop, Patreon, shop, mobile disclosure, focus styles, touch targets, and reduced-motion behavior.
- [ ] Run `npm test` and `npm run build`.

### Task 4: Image and metadata performance

**Files:**
- Create: `public/images/hero-r1t-640.avif`
- Create: `public/images/hero-r1t-960.avif`
- Create: `public/images/hero-r1t-1440.avif`
- Create: `public/images/hero-r1t-640.webp`
- Create: `public/images/hero-r1t-960.webp`
- Create: `public/images/hero-r1t-1440.webp`
- Create: `public/images/og-card.jpg`
- Create: `src/pages/sitemap-index.xml.ts`

- [ ] Generate responsive hero sources from the existing photograph and a real Open Graph card.
- [ ] Reference the hero through `<picture>` with sizes, dimensions, and high fetch priority.
- [ ] Add an absolute Open Graph image URL and a working sitemap route.
- [ ] Run asset-size assertions, `npm test`, and `npm run build`.

### Task 5: Browser verification and refinement

**Files:**
- Modify: files implicated by verified defects only.

- [ ] Inspect the built site at desktop and mobile widths.
- [ ] Run Lighthouse mobile accessibility and performance checks.
- [ ] Fix material layout, contrast, performance, or copy defects found in the first inspection.
- [ ] Re-run `npm test`, `npm run build`, source scans, and Lighthouse before completion.
