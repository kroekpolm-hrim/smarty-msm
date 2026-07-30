# SMARTY React Hero + Expo Body Design

## Goal

Keep the current production React navigation and video hero visually and behaviorally unchanged, while replacing the complete body below the hero with the content, order, styling, and interactions from `expo.html`.

## Production Context

`origin/main` is a compiled React deployment. Its application renders three top-level components: navigation, hero, and the older body. The repository contains compiled JavaScript and CSS but not the React source project.

## Architecture

Create a deterministic build adapter that:

1. Reads the current compiled React bundle.
2. Writes a separate `index-hero-only.js` bundle that removes only the third top-level body render call.
3. Keeps the React navigation and hero calls byte-for-byte unchanged.
4. Extracts all markup after `</header>` from `expo.html`.
5. Extracts the CSS from `expo.html`, converts its document root selectors to scoped selectors, and wraps it in `@scope (#expo-content)`.
6. Extracts the existing `expo.html` JavaScript unchanged.
7. Generates `index.html` with the React root first and the scoped Expo body immediately after it.

The original compiled bundle remains in the repository as an untouched reference.

## Hero Contract

The rendered hero must match the approved screenshot:

- Existing sticky navigation.
- Left-aligned badge, headline, supporting copy, and two buttons.
- Phone UI image at the lower left.
- Large animated presenter video on the right.
- Existing responsive layout and animation behavior.
- Existing React CSS and production asset paths.

No Expo CSS may apply to elements inside `#root`.

## Expo Body Contract

Everything after the hero must match `expo.html`, including:

- Trust counters.
- Feature, payment, ecosystem, and onboarding sections.
- Testimonials and disclosure.
- Two-column FAQ.
- Download section.
- Contact form presentation and validation.
- Footer.

The React body must not render, preventing duplicate IDs and duplicate content.

## Validation

- Contract-test the compiled bundle transformation: three top-level render calls become two, preserving the first two exactly.
- Verify generated post-hero markup equals `expo.html`.
- Verify the scoped stylesheet contains no unscoped root selector.
- Verify all referenced assets exist.
- Browser-test desktop and 390px mobile widths.
- Confirm React root contains navigation and hero but no `<main>`.
- Confirm Expo body contains 9 sections and 8 FAQ items.
- Confirm video loads, counters animate, FAQ expands, form validation runs, and no horizontal overflow or console error exists.
- Push to `origin/main` and verify the GitHub Pages URL after deployment.

## Out of Scope

- Rebuilding or reverse-engineering the React source project.
- Redesigning the approved Hero.
- Connecting the form to a backend.
- Replacing mock testimonials with real customer quotes.
