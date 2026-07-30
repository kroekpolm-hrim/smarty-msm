# SMARTY Layered Premium Tech Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dimensional premium-tech styling, the approved campaign banner, SMARTY Signal accents, and restrained depth motion while preserving the current content and React Hero video.

**Architecture:** Keep `expo.html` as the editable source for the body, scoped CSS, and interactions, then rebuild the generated Expo assets through `tools/build_react_hero_expo_body.mjs`. Add one focused global stylesheet for atmosphere around the compiled React Hero because scoped Expo CSS cannot target `#root`. Store the approved campaign artwork locally under `img/`.

**Tech Stack:** Static HTML, scoped CSS, vanilla JavaScript, Node.js generator, Python contract tests.

## Global Constraints

- Preserve IBM Plex Sans Thai, the current React Hero layout, copy, presenter video, form behavior, FAQ behavior, counters, and existing content.
- Use `#0B5FCE` as the cobalt signal and do not introduce another competing accent color.
- Replace the moving benefit ticker with the approved complete 12:5 campaign artwork.
- Keep ambient parallax within 6–12px, hover elevation within 3–5px, and disable both under `prefers-reduced-motion: reduce`.
- Do not add a JavaScript or CSS dependency.
- Do not create horizontal overflow at desktop, tablet, or mobile widths.

---

### Task 1: Lock the visual contract

**Files:**
- Modify: `tests/test_react_hero_expo_body.py`

**Interfaces:**
- Consumes: `expo.html`, `index.html`, `assets/expo-body.css`, `assets/expo-body.js`, `assets/hero-atmosphere.css`, and `img/smarty-campaign-banner.webp`
- Produces: regression assertions for the banner, atmosphere, depth hooks, and reduced-motion behavior

- [ ] **Step 1: Write the failing contract assertions**

Add these assertions inside `test_hybrid_contract()`:

```python
    hero_atmosphere = ROOT / "assets/hero-atmosphere.css"
    campaign_asset = ROOT / "img/smarty-campaign-banner.webp"
    assert campaign_asset.is_file()
    assert campaign_asset.stat().st_size > 100_000
    assert hero_atmosphere.is_file()

    assert "campaign-showcase" in expo
    assert "smarty-campaign-banner.webp" in expo
    assert "check-strip" not in expo
    assert "ledger-stage" in expo
    assert expo.count('class="ledger-chip') == 2
    assert "smarty-signal" in expo

    assert "data-depth-parallax" in expo
    assert "updateDepthParallax" in expo_js
    assert "prefers-reduced-motion: reduce" in css
    assert ".smarty-signal" in css
    assert ".campaign-frame" in css
    assert ".ledger-chip" in css

    atmosphere_css = read(hero_atmosphere)
    assert "#root > header + section" in atmosphere_css
    assert "@media (prefers-reduced-motion: reduce)" in atmosphere_css
    assert '<link rel="stylesheet" href="./assets/hero-atmosphere.css">' in index
```

- [ ] **Step 2: Run the test and confirm RED**

Run:

```bash
python3 tests/test_react_hero_expo_body.py
```

Expected: fail at `campaign_asset.is_file()` because the approved campaign asset and dimensional design hooks do not exist yet.

### Task 2: Add the campaign artwork and replace duplicated messaging

**Files:**
- Create: `img/smarty-campaign-banner.webp`
- Modify: `expo.html`

**Interfaces:**
- Consumes: approved WordPress asset URL
- Produces: a local campaign image and `section.campaign-showcase` between Trust and Features

- [ ] **Step 1: Download the approved artwork**

Run:

```bash
curl -L --fail --silent --show-error \
  "http://msm-muangthong.com/wp-content/uploads/2026/04/05-banner-Smarty-App_Revise1.webp" \
  -o img/smarty-campaign-banner.webp
```

Expected: `file img/smarty-campaign-banner.webp` reports a WebP image.

- [ ] **Step 2: Replace the moving benefit ticker**

Remove the complete `.check-strip` markup from `expo.html` and insert:

```html
<section class="campaign-showcase section-reveal smarty-signal" aria-label="ภาพรวมประโยชน์ของ SMARTY">
  <div class="container">
    <figure class="campaign-frame reveal" data-depth-parallax>
      <img
        src="img/smarty-campaign-banner.webp"
        alt="SMARTY เช็กค่าส่วนกลาง จ่ายและรับใบเสร็จออนไลน์ แจ้งพัสดุ และนัดหมายงานช่าง พร้อมระบบ SMART LIVING และ SMART FINANCE"
        width="2400"
        height="1000"
        loading="lazy"
      >
      <figcaption>SMARTY เชื่อมงานการเงินและบริการลูกบ้านไว้ในประสบการณ์เดียว</figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 3: Run the contract test and confirm the failure advances**

Run:

```bash
python3 tests/test_react_hero_expo_body.py
```

Expected: the asset and campaign assertions pass; the test next fails because the atmosphere stylesheet or depth styles do not exist.

### Task 3: Build the dimensional surface system

**Files:**
- Modify: `expo.html`
- Create: `assets/hero-atmosphere.css`
- Modify: `tools/build_react_hero_expo_body.mjs`

**Interfaces:**
- Consumes: existing design tokens and stable `#root .hero` React Hero structure
- Produces: SMARTY Signal, elevated cards, Hero atmosphere, product-stage chips, and responsive/reduced-motion rules

- [ ] **Step 1: Extend the visual tokens**

Add these variables to `:root` in `expo.html`:

```css
--canvas-cool: #f7faff;
--brand-blue-bright: #2d7fe8;
--hairline-blue: rgba(11,95,206,0.16);
--ambient-blue: rgba(45,127,232,0.14);
--shadow-soft: 0 18px 48px rgba(23,38,61,0.08);
--shadow-blue: 0 24px 64px rgba(11,95,206,0.12);
```

- [ ] **Step 2: Add the campaign, signal, and component depth CSS**

Add focused rules to `expo.html` for:

```css
.campaign-showcase { position: relative; padding: 28px 0 96px; background: linear-gradient(180deg, var(--canvas), var(--canvas-cool)); overflow: hidden; }
.campaign-frame { position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,.85); border-radius: 20px; background: var(--canvas); box-shadow: var(--shadow-blue); transform: translateY(var(--depth-parallax-y, 0)); }
.campaign-frame::before { content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none; box-shadow: inset 0 1px 0 rgba(255,255,255,.9); }
.campaign-frame img { width: 100%; height: auto; }
.campaign-frame figcaption { padding: 14px 20px; border-top: 1px solid var(--hairline-blue); background: rgba(255,255,255,.92); color: var(--body); font-size: 13px; }
.smarty-signal::after { content: ""; position: absolute; left: 8%; right: 8%; top: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--brand-blue-bright), transparent); transform: scaleX(0); transform-origin: left; transition: transform 900ms var(--ease-out-premium); }
.smarty-signal.section-in::after { transform: scaleX(1); }
.trust-grid { position: relative; box-shadow: var(--shadow-soft); }
.trust-stat::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--brand-blue-bright); box-shadow: 0 0 0 5px rgba(45,127,232,.10); }
.f-card { position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(23,38,61,.04); }
.f-card::before { content: ""; position: absolute; left: 18px; right: 18px; top: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--brand-blue-bright), transparent); opacity: 0; transition: opacity var(--motion-fast) ease; }
.f-card:hover::before { opacity: 1; }
.f-card:nth-child(2), .f-card:nth-child(5) { transform: translateY(10px); }
.f-icon { box-shadow: inset 0 1px 0 rgba(255,255,255,.9); }
.ledger-stage { position: relative; padding: 26px; }
.ledger-stage::before { content: ""; position: absolute; inset: 8% 0; border-radius: 50%; background: var(--ambient-blue); filter: blur(34px); }
.ledger-stage .ledger { position: relative; z-index: 1; box-shadow: var(--shadow-blue); }
.ledger-chip { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 7px; padding: 8px 11px; border: 1px solid var(--hairline-blue); border-radius: 999px; background: rgba(255,255,255,.92); box-shadow: 0 10px 28px rgba(23,38,61,.10); color: var(--ink); font-family: var(--mono); font-size: 11px; }
.ledger-chip--top { top: 0; right: 4px; }
.ledger-chip--bottom { bottom: 2px; left: 0; }
.steps { position: relative; }
.steps::before { content: ""; position: absolute; left: 15px; top: 30px; bottom: 30px; width: 1px; background: linear-gradient(var(--brand-blue-bright), rgba(45,127,232,.12)); }
.step { position: relative; z-index: 1; box-shadow: 0 10px 28px rgba(23,38,61,.04); }
.testimonial-card { background: linear-gradient(145deg, #fff 0%, #f8fbff 100%); }
.dl-band { position: relative; overflow: hidden; background: radial-gradient(circle at 50% 15%, rgba(45,127,232,.14), transparent 42%), var(--canvas-cool); }
.contact-panel { position: relative; box-shadow: var(--shadow-blue); }
```

- [ ] **Step 3: Add the payment-stage markup**

Replace the direct payment `.ledger` wrapper with:

```html
<div class="ledger-stage smarty-signal reveal" data-depth-parallax>
  <span class="ledger-chip ledger-chip--top" aria-hidden="true">● ยอดตรงกัน</span>
  <div class="ledger" role="img" aria-label="ตัวอย่างรายการชำระค่าส่วนกลางในระบบ">
    <div class="ledger-head">
      <div class="win-dots"><span></span><span></span><span></span></div>
      <span class="ledger-title">smarty · billing/2569-07</span>
    </div>
    <table>
      <tr><td class="lg-label">A-1204 · ค่าส่วนกลาง ก.ค.</td><td>4,850.00</td></tr>
      <tr><td class="lg-label">A-1204 · ค่าน้ำ</td><td>312.50</td></tr>
      <tr><td class="lg-label">ช่องทาง</td><td>QR PromptPay</td></tr>
      <tr><td class="lg-label">ใบเสร็จ RC-2569-07-1188</td><td class="lg-ok">✓ ออกแล้ว</td></tr>
      <tr><td class="lg-label">กระทบยอดธนาคาร</td><td class="lg-ok">✓ ตรงกัน</td></tr>
      <tr class="lg-total"><td>ยอดรวมรับชำระ</td><td>฿5,162.50</td></tr>
    </table>
  </div>
  <span class="ledger-chip ledger-chip--bottom" aria-hidden="true">↻ อัปเดตแบบ Real-Time</span>
</div>
```

- [ ] **Step 4: Create the global React Hero atmosphere stylesheet**

Create `assets/hero-atmosphere.css` with:

```css
#root .hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
#root .hero::before {
  content: "";
  position: absolute;
  z-index: 0;
  width: min(54vw, 760px);
  aspect-ratio: 1;
  right: -8%;
  top: 2%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(45,127,232,.20), rgba(45,127,232,.07) 42%, transparent 70%);
  filter: blur(4px);
  pointer-events: none;
}
#root .hero::after {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0 0 0 52%;
  background-image: linear-gradient(rgba(11,95,206,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(11,95,206,.055) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent);
  pointer-events: none;
}
@media (max-width: 767px) {
  #root .hero::after { display: none; }
  #root .hero::before { width: 120vw; right: -52%; opacity: .65; }
  #root .hero > div:last-child {
    opacity: .28;
    filter: saturate(.85);
    mask-image: linear-gradient(to bottom, transparent, #000 18%, #000);
  }
}
@media (prefers-reduced-motion: reduce) {
  #root .hero::before,
  #root .hero::after { transform: none !important; }
}
```

- [ ] **Step 5: Link the atmosphere stylesheet from the generator**

Add this line after the compiled React stylesheet in the generated `index` template:

```html
<link rel="stylesheet" href="./assets/hero-atmosphere.css">
```

### Task 4: Add restrained parallax and responsive safeguards

**Files:**
- Modify: `expo.html`

**Interfaces:**
- Consumes: `[data-depth-parallax]` elements
- Produces: `--depth-parallax-y` in the range `-6px` to `6px`

- [ ] **Step 1: Add the parallax controller**

Insert before the section reveal observers:

```js
const depthParallaxItems = document.querySelectorAll('[data-depth-parallax]');
let depthParallaxFrame = 0;
const updateDepthParallax = () => {
  depthParallaxFrame = 0;
  if (reduceMotion) return;
  depthParallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
    const offset = Math.max(-6, Math.min(6, centerOffset * -12));
    item.style.setProperty('--depth-parallax-y', `${offset.toFixed(2)}px`);
  });
};
const requestDepthParallax = () => {
  if (!depthParallaxFrame) depthParallaxFrame = requestAnimationFrame(updateDepthParallax);
};
if (!reduceMotion) {
  updateDepthParallax();
  window.addEventListener('scroll', requestDepthParallax, { passive: true });
  window.addEventListener('resize', requestDepthParallax);
}
```

- [ ] **Step 2: Add responsive and reduced-motion rules**

Add:

```css
@media (max-width: 820px) {
  .campaign-showcase { padding: 18px 0 64px; }
  .campaign-frame { border-radius: 14px; transform: none; }
  .campaign-frame figcaption { font-size: 12px; }
  .f-card:nth-child(2), .f-card:nth-child(5) { transform: none; }
  .ledger-chip { display: none; }
  .ledger-stage { padding: 12px 0; }
}
@media (prefers-reduced-motion: reduce) {
  [data-depth-parallax] { transform: none !important; }
  .smarty-signal::after { transform: scaleX(1); transition: none; }
}
```

- [ ] **Step 3: Rebuild generated assets**

Run:

```bash
node tools/build_react_hero_expo_body.mjs
```

Expected: `Built React Hero + scoped Expo body`.

- [ ] **Step 4: Run the contract test and confirm GREEN**

Run:

```bash
python3 tests/test_react_hero_expo_body.py
```

Expected: `PASS: React Hero + Expo body hybrid contract`.

### Task 5: Visual QA, commit, and deploy

**Files:**
- Verify: all modified and generated files

**Interfaces:**
- Consumes: completed local landing page
- Produces: verified GitHub Pages deployment

- [ ] **Step 1: Run fresh static verification**

Run:

```bash
git diff --check
node --check tools/build_react_hero_expo_body.mjs
node --check assets/expo-body.js
python3 tests/test_react_hero_expo_body.py
```

Expected: all commands exit `0`.

- [ ] **Step 2: Verify desktop and mobile in a browser**

Check:

```text
Hero video exists and reaches readyState 4.
Campaign banner appears after Trust and before Features.
No check-strip remains.
Parallax stays within ±6px.
Payment chips appear on desktop and are hidden on mobile.
No horizontal overflow at 1440px and 390px.
Every section reveals and no console error or warning appears.
```

- [ ] **Step 3: Commit**

Run:

```bash
git add assets/hero-atmosphere.css assets/expo-body.css assets/expo-body.js expo.html img/smarty-campaign-banner.webp index.html tests/test_react_hero_expo_body.py tools/build_react_hero_expo_body.mjs
git commit -m "feat: add layered premium depth to SMARTY"
```

- [ ] **Step 4: Merge, push, and verify GitHub Pages**

Fast-forward `main`, push `origin main`, wait for the Pages workflow to report `success`, then open:

```text
https://kroekpolm-hrim.github.io/smarty-msm/
```

Verify the same desktop/mobile checklist against the live URL.
