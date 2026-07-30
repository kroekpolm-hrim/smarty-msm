# SMARTY GitHub Pages Content Merge Design

## Goal

Update the published SMARTY GitHub Pages site so that everything below the hero matches `expo.html`, while the complete existing video hero from `index.html` remains unchanged.

## Source of Truth

- `index.html` is the source of truth for the navigation and the complete hero section.
- The preserved hero includes its copy, buttons, layout, `img/insm-hero.mp4`, presenter card, responsive behavior, and cursor-tracking JavaScript.
- `expo.html` is the source of truth for every section after the hero, including section order, content, styling, motion, FAQ, testimonials, download, contact, and footer.

## Merge Strategy

Use `expo.html` as the page base, then transplant the video-hero-specific CSS, hero HTML, and cursor-tracking JavaScript from `index.html`. This avoids manually recreating or selectively copying every content section and reduces the risk of omitting recent `expo.html` changes.

The final `index.html` remains a self-contained static page. No framework, build system, or new runtime dependency will be introduced.

## Preserved Hero Boundary

The preserved area includes:

1. Navigation shown above the hero.
2. The complete `<header class="hero">` block.
3. Hero presenter and video styles.
4. Desktop and mobile layout rules for the presenter.
5. The pointer-driven video seeking and card-tilt behavior.
6. Reduced-motion handling already present in the published page.

The first replaced block is the trust/usage section immediately after the closing hero header.

## Content Below the Hero

All post-hero markup follows `expo.html` exactly. This includes:

- Trust statistics and animated counters.
- Feature content.
- Payment and registration content.
- Resident and juristic-person information.
- Testimonials and disclosure.
- Two-column FAQ.
- Download call to action.
- Contact form presentation and validation behavior.
- Footer navigation and legal copy.

Section ordering, anchors, labels, and mock-content disclosures must match `expo.html`.

## CSS and JavaScript Integration

- Start from the full CSS and JavaScript in `expo.html`.
- Add only the hero presenter/video CSS that is absent from `expo.html`.
- Add only the cursor-tracking video JavaScript that is absent from `expo.html`.
- Avoid duplicate animation observers, counters, form listeners, or navigation handlers.
- Retain safe null checks so a missing video element does not stop other page scripts.

## Assets

The published page must continue referencing repository-relative assets. The required video remains `img/insm-hero.mp4`. All images referenced by `expo.html` must already exist under `img/` or be added before deployment. No `file://` or machine-local paths are allowed.

## Validation

Before deployment:

1. Compare all post-hero section identifiers and visible headings in final `index.html` against `expo.html`.
2. Confirm the final hero contains the video, presenter element, and cursor-tracking script from the current `index.html`.
3. Confirm HTML structure and JavaScript syntax are valid.
4. Confirm every relative image and video reference resolves to an existing repository file.
5. Inspect desktop and mobile layouts in a local browser.
6. Test navigation anchors, count-up animation, FAQ expansion, and contact-form validation.
7. Push the verified commit to `main`, then open the GitHub Pages URL and confirm the deployed page.

## Deployment

Commit only the intentional website changes and required assets. Preserve unrelated untracked WordPress artifacts. Push the `main` branch to `origin`; GitHub Pages will serve the updated `index.html`.

## Out of Scope

- Redesigning the hero.
- Changing the existing video or its interaction.
- Converting the site to WordPress or Elementor.
- Replacing mock testimonials with real customer statements.
- Connecting the contact form to a live backend or CRM.
