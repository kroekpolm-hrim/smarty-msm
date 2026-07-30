# SMARTY React Hero + Expo Body Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and deploy a hybrid page with the approved production React Hero and the complete scoped body from `expo.html`.

**Architecture:** A Node.js adapter produces a hero-only copy of the current React bundle, extracts Expo markup/CSS/JavaScript into isolated artifacts, and writes the production `index.html`. Contract tests validate the bundle boundary, content equality, CSS isolation, assets, and production-safe paths.

**Tech Stack:** Compiled React bundle, static HTML/CSS/JavaScript, Node.js ES modules, Python 3 contract tests, GitHub Pages

## Global Constraints

- Keep React navigation and Hero unchanged.
- Replace only the React body below Hero.
- Scope all Expo CSS to `#expo-content`.
- Preserve production asset paths under `/smarty-msm/`.
- Do not edit the original compiled React bundle.
- Push only after desktop/mobile browser QA passes.

---

### Task 1: Hybrid Output Contract

**Files:**
- Create: `tests/test_react_hero_expo_body.py`

**Interfaces:**
- Consumes: `expo.html`, `index.html`, `assets/index-9aNYj2SZ.js`
- Produces: executable assertions for generated artifacts and content boundaries

- [ ] Write a failing test that requires `assets/index-hero-only.js`, `assets/expo-body.css`, `assets/expo-body.js`, and `#expo-content`.
- [ ] Assert the generated bundle retains the Navigation and Hero render calls but omits the third Body render call.
- [ ] Assert generated Expo markup equals the source markup after `</header>`.
- [ ] Assert the stylesheet is wrapped in `@scope (#expo-content)` and production files contain no `file://` or `/Users/`.
- [ ] Run `python3 tests/test_react_hero_expo_body.py` and confirm it fails because the artifacts do not exist.

### Task 2: Deterministic Hybrid Builder

**Files:**
- Create: `tools/build_react_hero_expo_body.mjs`
- Create: `assets/index-hero-only.js`
- Create: `assets/expo-body.css`
- Create: `assets/expo-body.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: compiled React bundle and `expo.html`
- Produces: production-ready hybrid site artifacts

- [ ] Extract the final React application render block and remove only its third top-level JSX call.
- [ ] Extract Expo CSS, replace `:root`, `html`, and `body` document selectors with `:scope`, and wrap the result in `@scope (#expo-content)`.
- [ ] Extract exact post-Hero markup and the Expo interaction script.
- [ ] Write `index.html` with `#root`, followed by `#expo-content`, and links to the generated CSS and JavaScript.
- [ ] Run the builder twice and verify identical checksums.
- [ ] Run contract and JavaScript syntax checks.
- [ ] Commit the generated hybrid page.

### Task 3: Browser QA and Deployment

**Files:**
- Modify generated files only if QA finds a reproducible defect

**Interfaces:**
- Consumes: generated hybrid site
- Produces: verified GitHub Pages deployment

- [ ] Serve the repository under a local `/smarty-msm/` path.
- [ ] Verify the approved Hero at desktop and mobile widths.
- [ ] Verify `#root` has no React `<main>` and the Expo body has 9 sections and 8 FAQs.
- [ ] Verify video readiness, counter completion, FAQ expansion, form validation, responsive width, and console logs.
- [ ] Run fresh contract and syntax verification.
- [ ] Merge verified commits into local `main`, reconcile `origin/main`, and push `main`.
- [ ] Reload `https://kroekpolm-hrim.github.io/smarty-msm/` and verify the deployed result.
