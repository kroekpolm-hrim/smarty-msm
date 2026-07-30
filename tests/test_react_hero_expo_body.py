#!/usr/bin/env python3
import hashlib
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ORIGINAL_BUNDLE = ROOT / "assets/index-9aNYj2SZ.js"
HERO_BUNDLE = ROOT / "assets/index-hero-only.js"
EXPO_CSS = ROOT / "assets/expo-body.css"
EXPO_JS = ROOT / "assets/expo-body.js"
INDEX = ROOT / "index.html"
EXPO = ROOT / "expo.html"


def read(path):
    return path.read_text(encoding="utf-8")


def app_calls(bundle):
    marker = bundle.rfind("function b(){return")
    assert marker >= 0, "React application boundary not found"
    tail = bundle[marker:]
    create_root = tail.index("createRoot")
    app = tail[:create_root]
    calls = re.findall(
        r"\(0,([A-Za-z_$][\w$]*)\.jsx\)\(([A-Za-z_$][\w$]*),\{\}\)",
        app,
    )
    return calls


def between(source, start, end):
    return source.split(start, 1)[1].split(end, 1)[0]


def test_hybrid_contract():
    original = read(ORIGINAL_BUNDLE)
    hero_only = read(HERO_BUNDLE)
    original_calls = app_calls(original)
    hero_calls = app_calls(hero_only)
    assert len(original_calls) == 3
    assert len(hero_calls) == 2
    assert hero_calls == original_calls[:2]

    index = read(INDEX)
    expo = read(EXPO)
    generated_body = between(
        index,
        '<div id="expo-content">',
        '</div><!-- /expo-content -->',
    )
    source_body = between(expo, "</header>", "<script>")
    assert generated_body == source_body

    css = read(EXPO_CSS)
    assert css.startswith("@scope (#expo-content) {")
    assert ":scope {" in css
    assert "\n  body {" not in css
    assert "\n  html {" not in css

    assert '<script type="module" crossorigin src="/smarty-msm/assets/index-hero-only.js"></script>' in index
    assert '<link rel="stylesheet" href="./assets/expo-body.css">' in index
    assert '<script src="./assets/expo-body.js"></script>' in index
    assert read(EXPO_JS).strip() == between(expo, "<script>", "</script>").strip()

    assert "SMARTY by MSM" in hero_only
    assert "SMART LIVING BY MSM" not in hero_only

    removed_content = (
        "ครอบครัว SMARTY",
        "สองแอป หนึ่งระบบ ดูแลทั้งการอยู่อาศัยและการเงิน",
        "SMART LIVING · FINANCE",
        "#ecosystem",
    )
    for token in removed_content:
        assert token not in expo
        assert token not in index
    assert '{label:`ครอบครัว SMARTY`,href:`#ecosystem`},' not in hero_only

    top_level_sections = re.findall(r"<section\b[^>]*>", generated_body)
    assert top_level_sections
    assert all(
        re.search(r'class="[^"]*\bsection-reveal\b[^"]*"', section)
        for section in top_level_sections
    )
    top_level_footer = re.search(r"<footer\b[^>]*>", generated_body)
    assert top_level_footer
    assert re.search(
        r'class="[^"]*\bsection-reveal\b[^"]*"',
        top_level_footer.group(0),
    )

    assert ".section-reveal {" in css
    assert ".section-reveal.section-in" in css
    assert ".section-reveal, .reveal" in css

    expo_js = read(EXPO_JS)
    assert "const sectionObserver = new IntersectionObserver" in expo_js
    assert "section.classList.add('section-in')" in expo_js
    assert (
        "body > section, body > footer, #expo-content > section, #expo-content > footer"
        in expo_js
    )
    assert "if (reduceMotion || !('IntersectionObserver' in window))" in expo_js

    serialized = "\n".join((index, hero_only, css, read(EXPO_JS)))
    assert "file://" not in serialized
    assert "/Users/" not in serialized

    for ref in re.findall(r'(?:src|href)="(?:\./)?(img/[^"#?]+)', index):
        assert (ROOT / ref).is_file(), f"missing asset: {ref}"

    hashes = {
        path.name: hashlib.sha256(path.read_bytes()).hexdigest()
        for path in (HERO_BUNDLE, EXPO_CSS, EXPO_JS, INDEX)
    }
    assert len(hashes) == 4


if __name__ == "__main__":
    test_hybrid_contract()
    print("PASS: React Hero + Expo body hybrid contract")
