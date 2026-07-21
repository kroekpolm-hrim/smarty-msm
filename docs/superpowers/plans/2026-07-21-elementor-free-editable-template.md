# SMARTY Elementor Free Editable Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an importable Elementor Free JSON template that recreates the SMARTY landing page with every visible content item editable as a native Elementor widget.

**Architecture:** A deterministic Node.js builder will assemble Elementor's JSON document from small container/widget helper functions and page-section functions. A contract test will parse the generated artifact, reject Pro/custom/HTML/shortcode widgets and local paths, and verify required editable sections and responsive settings. Portable image files and a Thai import guide will be packaged beside the JSON without changing the existing shortcode plugin.

**Tech Stack:** Elementor template JSON, Elementor Free containers/widgets, Node.js ES modules, Python 3 contract tests, ZIP packaging

## Global Constraints

- Use only widgets and layout controls available in Elementor Free.
- Do not require the SMARTY shortcode plugin or Elementor Pro.
- Do not modify global Elementor Site Settings, the active WordPress theme, or existing pages.
- Keep the existing shortcode plugin ZIP unchanged.
- Do not use machine-local `file://` paths in the delivered JSON.
- Live form submission, custom JavaScript counters, and exact bespoke CSS animation are out of scope.

---

### Task 1: Template Contract and Builder Foundation

**Files:**
- Create: `tests/test_elementor_free_template.py`
- Create: `tools/build-elementor-template.mjs`
- Create: `wordpress/elementor-free-template/.gitkeep`

**Interfaces:**
- Consumes: existing SMARTY copy and image names from `expo.html`
- Produces: `dist/smarty-elementor-free-template.json` with top-level keys `version`, `title`, `type`, `content`, and `page_settings`

- [ ] **Step 1: Write the failing contract test**

```python
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTIFACT = ROOT / "dist/smarty-elementor-free-template.json"
ALLOWED_WIDGETS = {"heading", "text-editor", "image", "button", "icon", "icon-list", "divider", "spacer", "accordion"}


def walk(elements):
    for element in elements:
        yield element
        yield from walk(element.get("elements", []))


def test_elementor_free_template_contract():
    document = json.loads(ARTIFACT.read_text())
    assert document["version"] == "0.4"
    assert document["type"] == "page"
    assert document["title"] == "SMARTY Landing — Editable"
    assert isinstance(document["content"], list) and document["content"]

    elements = list(walk(document["content"]))
    widgets = [item for item in elements if item.get("elType") == "widget"]
    assert widgets
    assert {item["widgetType"] for item in widgets} <= ALLOWED_WIDGETS
    serialized = json.dumps(document, ensure_ascii=False)
    assert "[smarty_landing]" not in serialized
    assert "file://" not in serialized
    assert "/Users/" not in serialized
    for section in ("hero", "trust", "resident", "juristic", "previews", "testimonials", "download", "faq", "contact", "footer"):
        assert f'"smarty_section":"{section}"' in serialized.replace(" ", "")


if __name__ == "__main__":
    test_elementor_free_template_contract()
    print("PASS: Elementor Free template contract")
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python3 tests/test_elementor_free_template.py`

Expected: FAIL because `dist/smarty-elementor-free-template.json` does not exist.

- [ ] **Step 3: Implement deterministic Elementor helpers and a minimal document**

Create `tools/build-elementor-template.mjs` with:

```js
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const id = (seed) => crypto.createHash('sha1').update(seed).digest('hex').slice(0, 7);
const widget = (seed, widgetType, settings) => ({ id: id(seed), elType: 'widget', widgetType, settings, elements: [] });
const container = (seed, settings, elements = []) => ({ id: id(seed), elType: 'container', settings, elements, isInner: false });
const heading = (seed, title, tag = 'h2') => widget(seed, 'heading', { title, header_size: tag });
const text = (seed, editor) => widget(seed, 'text-editor', { editor });
const button = (seed, label, url = '#contact') => widget(seed, 'button', { text: label, link: { url }, size: 'md' });

const content = [container('hero', { smarty_section: 'hero', content_width: 'boxed' }, [
  heading('hero-title', 'SMARTY ระบบบริหารนิติบุคคลอาคารชุด', 'h1'),
  text('hero-copy', 'เชื่อมทุกการอยู่อาศัยให้สะดวก โปร่งใส และจัดการง่ายในที่เดียว'),
  button('hero-cta', 'นัดขอ Demo ทดลองใช้'),
])];

const document = { version: '0.4', title: 'SMARTY Landing — Editable', type: 'page', content, page_settings: [] };
const output = path.resolve('dist/smarty-elementor-free-template.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
```

- [ ] **Step 4: Build and confirm the contract now fails only for missing sections**

Run: `node tools/build-elementor-template.mjs && python3 tests/test_elementor_free_template.py`

Expected: FAIL on the first missing `smarty_section` after `hero`.

- [ ] **Step 5: Commit the foundation**

```bash
git add tests/test_elementor_free_template.py tools/build-elementor-template.mjs wordpress/elementor-free-template/.gitkeep
git commit -m "test: define Elementor Free template contract"
```

### Task 2: Editable Page Sections and Responsive Layout

**Files:**
- Modify: `tools/build-elementor-template.mjs`
- Modify: `tests/test_elementor_free_template.py`
- Create: `dist/smarty-elementor-free-template.json`

**Interfaces:**
- Consumes: `container`, `widget`, `heading`, `text`, and `button` builder helpers
- Produces: ten top-level containers tagged by `smarty_section`, containing only native Elementor Free widgets

- [ ] **Step 1: Extend the failing test for editability and responsive behavior**

Add these assertions inside `test_elementor_free_template_contract`, immediately before the `if __name__ == "__main__"` runner:

```python
top_sections = {item.get("settings", {}).get("smarty_section"): item for item in document["content"]}
assert set(top_sections) == {"hero", "trust", "resident", "juristic", "previews", "testimonials", "download", "faq", "contact", "footer"}
assert all(section.get("elType") == "container" for section in top_sections.values())
assert sum(item.get("widgetType") == "heading" for item in widgets) >= 18
assert sum(item.get("widgetType") == "text-editor" for item in widgets) >= 20
assert sum(item.get("widgetType") == "button" for item in widgets) >= 4
assert sum(item.get("widgetType") == "image" for item in widgets) >= 4
assert any("flex_direction_mobile" in item.get("settings", {}) for item in elements)
assert not any(item.get("widgetType") in {"html", "shortcode", "form", "slides", "testimonial-carousel"} for item in widgets)
```

- [ ] **Step 2: Run the test to verify the new assertions fail**

Run: `node tools/build-elementor-template.mjs && python3 tests/test_elementor_free_template.py`

Expected: FAIL because only the hero exists.

- [ ] **Step 3: Add section builders with native widgets**

Implement `image`, `card`, and section functions in `tools/build-elementor-template.mjs`. Use `image` settings shaped as `{ image: { url: 'smarty-assets/<filename>', id: '' }, image_size: 'full' }`. Build:

- `trust`: four editable statistic cards for 1,000+ downloads, 12+ projects, 8,500+ units, and 24/7 access.
- `resident`: heading plus four cards covering notices, parcels, payments, and service requests.
- `juristic`: heading plus four cards covering residents, accounting, maintenance, and reporting.
- `previews`: three image widgets for phone, pre-registration, and web dashboard images.
- `testimonials`: three separately editable testimonial cards labeled as mock content.
- `download`: large heading, supporting text, and store/action buttons.
- `faq`: two child containers with four resident and four juristic-person question-and-answer pairs, using headings and text widgets so every entry remains directly editable.
- `contact`: visual field labels/placeholders and call-to-action button, with copy stating that form integration is required.
- `footer`: logo image, product description, navigation labels, and copyright.

Every grid or row container must set `flex_direction_mobile: 'column'`; dense four-column rows must set tablet width to two columns and mobile width to full width. Use the existing pink `#D92F68`, blue `#0B5ED7`, dark `#17171B`, cream `#FFF9F7`, rounded corners, and restrained shadows in Elementor settings.

- [ ] **Step 4: Generate the artifact and run the contract**

Run: `node tools/build-elementor-template.mjs && python3 tests/test_elementor_free_template.py`

Expected: `PASS: Elementor Free template contract`.

- [ ] **Step 5: Commit the editable template**

```bash
git add tools/build-elementor-template.mjs tests/test_elementor_free_template.py dist/smarty-elementor-free-template.json
git commit -m "feat: build editable Elementor Free landing template"
```

### Task 3: Portable Assets and Import Guide

**Files:**
- Create: `wordpress/elementor-free-template/assets/logo.png`
- Create: `wordpress/elementor-free-template/assets/phone3_img-min.png`
- Create: `wordpress/elementor-free-template/assets/pre_registration_img-min.jpg`
- Create: `wordpress/elementor-free-template/assets/web-01-min.jpg`
- Create: `wordpress/elementor-free-template/README-TH.md`
- Modify: `tests/test_elementor_free_template.py`

**Interfaces:**
- Consumes: the four existing files in `img/`
- Produces: a relinkable asset folder whose basenames exactly match the JSON image references

- [ ] **Step 1: Add failing asset-reference checks**

```python
ASSETS = ROOT / "wordpress/elementor-free-template/assets"
expected_assets = {"logo.png", "phone3_img-min.png", "pre_registration_img-min.jpg", "web-01-min.jpg"}
assert expected_assets == {item.name for item in ASSETS.iterdir() if item.is_file()}
for name in expected_assets:
    assert f"smarty-assets/{name}" in serialized
assert (ROOT / "wordpress/elementor-free-template/README-TH.md").exists()
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python3 tests/test_elementor_free_template.py`

Expected: FAIL because the portable asset folder is empty.

- [ ] **Step 3: Copy assets and write the Thai import guide**

Copy `img/logo.png`, `img/phone3_img-min.png`, `img/pre_registration_img-min.jpg`, and `img/web-01-min.jpg` into `wordpress/elementor-free-template/assets/`. Write `README-TH.md` with exact instructions for importing through **Templates > Saved Templates**, inserting from the folder icon, selecting Elementor Canvas, uploading the four assets into Media Library, relinking missing images, and reviewing all three responsive modes. State clearly that the contact block is visual only.

- [ ] **Step 4: Run the contract test**

Run: `python3 tests/test_elementor_free_template.py`

Expected: `PASS: Elementor Free template contract`.

- [ ] **Step 5: Commit assets and documentation**

```bash
git add wordpress/elementor-free-template tests/test_elementor_free_template.py
git commit -m "docs: package Elementor template assets and import guide"
```

### Task 4: Distribution Package and Final Verification

**Files:**
- Create: `dist/smarty-elementor-free-package.zip`
- Modify: `tests/test_elementor_free_template.py`

**Interfaces:**
- Consumes: generated JSON, portable assets, and Thai guide
- Produces: a clean ZIP for handoff plus the standalone JSON used by WordPress import

- [ ] **Step 1: Add failing package checks**

```python
from zipfile import ZipFile

package = ROOT / "dist/smarty-elementor-free-package.zip"
with ZipFile(package) as archive:
    names = set(archive.namelist())
    assert "smarty-elementor-free/smarty-elementor-free-template.json" in names
    assert "smarty-elementor-free/README-TH.md" in names
    for name in expected_assets:
        assert f"smarty-elementor-free/assets/{name}" in names
    assert not any("__MACOSX" in name or name.endswith(".DS_Store") for name in names)
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python3 tests/test_elementor_free_template.py`

Expected: FAIL because the distribution ZIP does not exist.

- [ ] **Step 3: Build the clean distribution ZIP**

Create a temporary `smarty-elementor-free/` directory containing the JSON, `README-TH.md`, and `assets/`, then archive that explicit directory to `dist/smarty-elementor-free-package.zip`. Do not include macOS metadata or unrelated repository files.

- [ ] **Step 4: Run fresh verification**

Run:

```bash
node tools/build-elementor-template.mjs
python3 tests/test_elementor_free_template.py
node --check tools/build-elementor-template.mjs
unzip -tq dist/smarty-elementor-free-package.zip
shasum -a 256 dist/smarty-elementor-free-template.json dist/smarty-elementor-free-package.zip
```

Expected: contract PASS, Node syntax PASS, ZIP integrity PASS, and two SHA-256 lines.

- [ ] **Step 5: Commit the distribution artifact**

```bash
git add dist/smarty-elementor-free-package.zip
git commit -m "build: package editable SMARTY Elementor template"
```
