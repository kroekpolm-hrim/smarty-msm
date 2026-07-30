# SMARTY Expo Content + Video Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an `index.html` whose navigation and complete video hero come from the current live page, while all markup after the hero comes from `expo.html`.

**Architecture:** A small deterministic Node.js merge script extracts the navigation, hero markup, video-hero CSS, and cursor-tracking JavaScript from the current `index.html`, applies them to an `expo.html` base, and writes the merged `index.html`. A Python contract test compares source boundaries, checks assets and scripts, and protects the preserved video hero from later replacement.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js ES modules, Python 3 contract tests, GitHub Pages

## Global Constraints

- `index.html` remains the source of truth for the complete existing navigation and video hero.
- `expo.html` remains the source of truth for every section after the hero.
- Preserve `img/insm-hero.mp4` and the cursor-driven video behavior.
- Do not add a framework, package dependency, or backend.
- Do not include `file://` or machine-local paths.
- Preserve unrelated untracked WordPress artifacts.
- Push the verified result to `origin/main` and confirm the GitHub Pages deployment.

---

### Task 1: Define the Merge Contract

**Files:**
- Create: `tests/test_video_hero_content_merge.py`

**Interfaces:**
- Consumes: `index.html`, `expo.html`, and repository-relative assets
- Produces: a standalone contract test executable with `python3 tests/test_video_hero_content_merge.py`

- [ ] **Step 1: Write the failing contract test**

```python
#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
EXPO = (ROOT / "expo.html").read_text(encoding="utf-8")


def block(html, start, end):
    return html.split(start, 1)[1].split(end, 1)[0]


def test_merge_contract():
    index_post_hero = block(INDEX, "</header>", "<script>")
    expo_post_hero = block(EXPO, "</header>", "<script>")
    assert index_post_hero == expo_post_hero

    assert 'id="heroPresenter"' in INDEX
    assert 'id="heroVid"' in INDEX
    assert 'src="img/insm-hero.mp4"' in INDEX
    assert "hero.addEventListener('pointermove'" in INDEX

    for required in (
        'id="trust"',
        'id="testimonials"',
        'id="faq"',
        'id="download"',
        'id="contact"',
    ):
        assert required in INDEX

    assert "02-000-0000" not in INDEX
    assert "file://" not in INDEX
    assert "/Users/" not in INDEX

    for ref in re.findall(r'(?:src|href)="(img/[^"#?]+)', INDEX):
        assert (ROOT / ref).is_file(), f"missing asset: {ref}"


if __name__ == "__main__":
    test_merge_contract()
    print("PASS: video hero + expo content merge contract")
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python3 tests/test_video_hero_content_merge.py`

Expected: FAIL because the existing `index.html` post-hero markup does not exactly match `expo.html`.

- [ ] **Step 3: Commit the test**

```bash
git add tests/test_video_hero_content_merge.py
git commit -m "test: define SMARTY hero and content merge contract"
```

### Task 2: Build the Merged Static Page

**Files:**
- Create: `tools/merge_expo_with_video_hero.mjs`
- Modify: `index.html`
- Test: `tests/test_video_hero_content_merge.py`

**Interfaces:**
- Consumes: current `index.html` and `expo.html`
- Produces: a merged, self-contained `index.html`

- [ ] **Step 1: Implement deterministic block extraction**

Create `tools/merge_expo_with_video_hero.mjs` with helpers that:

```js
const between = (source, start, end) => {
  const left = source.indexOf(start);
  const right = source.indexOf(end, left + start.length);
  if (left < 0 || right < 0) throw new Error(`Missing merge boundary: ${start} … ${end}`);
  return source.slice(left, right + end.length);
};

const replace = (source, start, end, value) => {
  const current = between(source, start, end);
  return source.replace(current, value);
};
```

The script must read both source files before writing. It must then:

1. Extract the navigation block from the current `index.html`.
2. Extract `<header class="hero">…</header>` from the current `index.html`.
3. Extract the CSS block from `.hero-stage {` through the closing mobile presenter rule.
4. Extract the final video-presenter IIFE containing `heroPresenter` and `heroVid`.
5. Start from the full `expo.html`.
6. Replace the expo navigation and hero markup with the preserved blocks.
7. Insert the presenter CSS immediately after the expo `.hero-device img` rule.
8. Insert the presenter IIFE immediately before `</body>`.
9. Write the result to `index.html`.

- [ ] **Step 2: Run the merge**

Run: `node tools/merge_expo_with_video_hero.mjs`

Expected: prints `Built index.html from expo content with preserved video hero`.

- [ ] **Step 3: Run the contract and JavaScript syntax checks**

Run:

```bash
python3 tests/test_video_hero_content_merge.py
node --check tools/merge_expo_with_video_hero.mjs
python3 - <<'PY'
from pathlib import Path
html = Path("index.html").read_text()
scripts = html.split("<script>")[1:]
for i, script in enumerate(scripts, 1):
    Path(f"/tmp/smarty-script-{i}.js").write_text(script.split("</script>", 1)[0])
print(f"extracted {len(scripts)} inline scripts")
PY
for script in /tmp/smarty-script-*.js; do node --check "$script"; done
```

Expected: merge contract PASS and every JavaScript syntax check exits 0.

- [ ] **Step 4: Verify all post-hero headings and section IDs match**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
for name in ("index.html", "expo.html"):
    text = Path(name).read_text()
    post = text.split("</header>", 1)[1].split("<script>", 1)[0]
    print(name, post.count("<section"), post.count("<h2"), post.count("<details"))
PY
```

Expected: the three counts are identical for both files.

- [ ] **Step 5: Commit the merge**

```bash
git add index.html tools/merge_expo_with_video_hero.mjs
git commit -m "feat: merge expo content with existing video hero"
```

### Task 3: Browser QA and GitHub Pages Deployment

**Files:**
- Modify only if QA exposes a regression: `index.html`, `tools/merge_expo_with_video_hero.mjs`, or `tests/test_video_hero_content_merge.py`

**Interfaces:**
- Consumes: merged `index.html` and `img/` assets
- Produces: verified `origin/main` and live `https://kroekpolm-hrim.github.io/smarty-msm/`

- [ ] **Step 1: Serve the static page locally**

Run: `python3 -m http.server 4173`

Expected: server responds at `http://127.0.0.1:4173/index.html`.

- [ ] **Step 2: Inspect desktop and mobile**

Open the local URL and verify:

- Hero video card appears and tracks horizontal pointer movement.
- Hero copy and buttons remain unchanged.
- Every post-hero section from `expo.html` is present in the same order.
- FAQ items expand.
- Trust counters animate.
- Contact form displays validation for empty required fields.
- No horizontal overflow at desktop width and at 390px mobile width.
- Browser console contains no errors.

- [ ] **Step 3: Run fresh automated verification**

Run:

```bash
node tools/merge_expo_with_video_hero.mjs
python3 tests/test_video_hero_content_merge.py
node --check tools/merge_expo_with_video_hero.mjs
git diff --check
git status --short
```

Expected: PASS, no syntax errors, no whitespace errors, and only intentional files are modified or committed.

- [ ] **Step 4: Push the verified main branch**

```bash
git push origin main
```

Expected: push succeeds and reports the new commit on `main`.

- [ ] **Step 5: Confirm GitHub Pages**

Open `https://kroekpolm-hrim.github.io/smarty-msm/` after deployment, reload it, and confirm:

- The live hero still uses `img/insm-hero.mp4`.
- FAQ and testimonials match `expo.html`.
- The contact section no longer contains the old `02-000-0000` mock phone number.
- Console contains no errors.
