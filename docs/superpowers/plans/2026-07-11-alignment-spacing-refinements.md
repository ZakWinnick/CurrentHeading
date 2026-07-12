# Current Heading Alignment and Spacing Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the five approved alignment, spacing, and content-removal refinements without changing the landing page architecture or live integrations.

**Architecture:** Keep the existing Astro components and shared stylesheet. Enforce the requested behavior through one structural removal in `About.astro`, scoped CSS rules in `global.css`, and source-level regression checks in the existing Node test suite.

**Tech Stack:** Astro 6, CSS Grid and Flexbox, Node test runner.

## Global Constraints

- Preserve all live YouTube, Instagram, Ground Loop, Patreon, and Fourthwall behavior.
- Preserve the established homepage section order and left-aligned typography.
- Apply hero and navigation vertical centering at desktop and mobile widths.
- Apply Shop vertical centering only in the two-column desktop layout.
- Add no new imagery, copy, components, or motion.

---

### Task 1: Alignment and spacing regression contract

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: source strings from `src/components/About.astro` and `src/styles/global.css`.
- Produces: a regression test that defines the approved structural and CSS contract.

- [x] **Step 1: Write the failing test**

Add five focused tests that assert the About quote and its text are absent, `.ww-hero` uses `align-items: center`, desktop navigation links use `display: inline-flex`, the Patreon-specific intro margin is tightened, and desktop `.ww-shop__grid` uses `align-items: center`.

- [x] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because the quote remains, the hero uses `flex-end`, desktop navigation anchors lack a flex display, the Patreon override is absent, and the Shop grid uses `end` alignment.

### Task 2: Implement the approved refinements

**Files:**
- Modify: `src/components/About.astro`
- Modify: `src/styles/global.css`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the regression contract from Task 1.
- Produces: vertically centered header and hero content, a compact Community introduction, a quote-free About section, and centered desktop Shop copy.

- [x] **Step 1: Remove the About quote**

Delete the `.ww-about__quote` block from `About.astro` and remove both its base and desktop CSS rules.

- [x] **Step 2: Center navigation and hero contents**

Set desktop `.ww-nav__links a` to `display: inline-flex`. Change `.ww-hero` to `align-items: center` and use `padding: calc(68px + 2rem) var(--ww-gutter) 2rem` so its content centers in the visible area below the fixed header.

- [x] **Step 3: Tighten Community spacing**

Add `.ww-patreon .ww-section-intro { margin-bottom: 1.25rem; }` so the heading and introductory paragraph form one group without affecting other sections.

- [x] **Step 4: Center the desktop Shop copy**

Use `align-items: start` for the stacked `.ww-shop__grid`, then set `align-items: center` inside the existing `min-width: 760px` media query.

- [x] **Step 5: Run automated verification**

Run: `npm test && npm run build && git diff --check`

Expected: 15 tests pass, the Astro production build completes, and the diff has no whitespace errors.

### Task 3: Responsive visual verification and preview

**Files:**
- Modify only files implicated by verified defects.

**Interfaces:**
- Consumes: the built landing page from Task 2.
- Produces: verified desktop and mobile layout plus a persistent local preview URL.

- [x] **Step 1: Inspect desktop and mobile layouts**

Start Astro locally, inspect at 1440 x 1000 and 430 x 932, and confirm no horizontal overflow, centered hero content, vertically centered navigation text, collapsed About layout, compact Community spacing, and centered desktop Shop copy.

- [x] **Step 2: Re-run final verification after any visual correction**

Run: `npm test && npm run build && git diff --check`

Expected: 15 tests pass and the production build completes.

- [x] **Step 3: Commit the implementation**

Run:

```bash
git add src/components/About.astro src/styles/global.css tests/site-contract.test.mjs docs/superpowers/plans/2026-07-11-alignment-spacing-refinements.md
git commit -m "fix: refine landing page alignment"
```

- [x] **Step 4: Leave the local preview running**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Astro reports `http://127.0.0.1:4321/` and continues watching for changes.
