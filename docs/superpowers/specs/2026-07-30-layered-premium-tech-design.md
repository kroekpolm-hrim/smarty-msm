# SMARTY Layered Premium Tech Design

## Goal

Give the existing SMARTY landing page more visual depth and product presence while preserving its trustworthy corporate tone, IBM Plex Sans Thai typography, current content, React Hero video, responsive behavior, and accessibility.

## Creative direction

The page will use a **Layered Premium Tech** direction: quiet white and pale-blue surfaces, controlled cobalt light, structured product panels, and small depth cues. The design must feel more dimensional without becoming dark, glossy, crowded, or game-like.

The single signature element is the **SMARTY Signal**: a thin cobalt data path with a restrained glow that appears in selected sections and visually connects measurable trust, payment data, and onboarding. It represents one connected system serving residents and property-management teams.

## Visual system

### Color

- Canvas white: `#FFFFFF`
- Cool canvas: `#F7FAFF`
- Cobalt signal: `#0B5FCE`
- Bright signal: `#2D7FE8`
- Deep ink: `#171717`
- Cool body: `#606A78`
- Hairline blue: `rgba(11, 95, 206, 0.16)`
- Ambient cobalt light: `rgba(45, 127, 232, 0.14)`

No new accent color will compete with cobalt. Green remains limited to status indicators.

### Typography

- Display and body: IBM Plex Sans Thai
- Data and utility labels: IBM Plex Mono
- Existing type scale remains intact.
- Dimension comes from layout, light, borders, and data hierarchy rather than decorative display fonts.

### Surfaces and depth

- Important sections receive soft radial blue light behind the content, never behind every section.
- Cards use a subtle upper-edge highlight, a cool border, and a layered shadow that grows slightly on hover.
- Feature cards use two elevation levels to avoid a perfectly flat repeated grid.
- Large product panels use an inset highlight and one or two small floating status chips.
- Shadows remain under 12% black opacity or 15% cobalt opacity.
- Border radii remain within the existing 12–20px family.

## Section treatments

### Hero

- Preserve the current layout, copy, presenter video, and phone imagery.
- Add a soft cobalt ambient halo behind the video and a very faint technical grid behind the right half.
- Add one short SMARTY Signal curve near the phone group.
- Do not add extra Hero copy or buttons.

### Trust ledger

- Convert the flat stat row into a lightly elevated ledger surface.
- Add a thin SMARTY Signal line passing behind the stat markers.
- Give each number a small cobalt marker and slightly stronger data typography.
- Keep the mock-data disclosure visible.

### Campaign banner

- Place the approved SMARTY campaign banner immediately after the Trust ledger and before Features.
- Replace the current moving benefit ticker because its five messages repeat the benefits already embedded in the banner artwork.
- Store the banner as a local optimized WebP asset instead of loading it from the WordPress URL at runtime.
- Present it inside a full-width rounded frame with a cool-blue ambient glow, a subtle upper-edge highlight, and a restrained 6px scroll parallax effect.
- Preserve the complete 12:5 artwork at its native `2400 × 1000` ratio without cropping because its typography is embedded in the image.
- On mobile, show the complete artwork at its natural ratio without parallax. Add a concise caption below it so the campaign message remains accessible even when baked-in text becomes visually small.
- Use descriptive alternative text summarizing the five benefits and the SMART LIVING / SMART FINANCE relationship.

### Features

- Add a restrained alternating elevation rhythm across cards.
- Add a 2px top highlight that appears on hover.
- Give icon wells a blue-tinted inset surface.
- No 3D tilt; cards move vertically by no more than 5px.

### Payment

- Emphasize the existing ledger as the main product object with a deeper layered shadow.
- Add two decorative, non-interactive status chips: `ยอดตรงกัน` and `อัปเดตแบบ Real-Time`.
- Add a short SMARTY Signal segment leading toward the ledger.
- Chips must be `aria-hidden="true"` because the same information already exists in the content.

### Onboarding

- Connect the three real steps with a thin data path on desktop.
- Each step receives a compact raised number plate.
- On mobile the path becomes a simple vertical rule.

### Testimonials and FAQ

- Keep these quieter so the page has visual breathing room.
- Testimonial cards gain a soft internal gradient and quote watermark.
- FAQ rows gain a shallow raised state on hover and a cobalt focus ring.
- Do not add decorative motion to open FAQ content.

### Download and contact

- Download receives a wide ambient glow and a slightly raised store-button dock.
- Contact remains the strongest conversion surface, with the current two-column structure and a soft cobalt halo outside the panel.
- Do not change form fields, validation, or submission behavior.

## Motion

- Existing section reveal remains the primary scroll animation.
- Decorative ambient elements use a short parallax range of 6–12px.
- Feature cards and product panels use the existing premium easing.
- Hover elevation is limited to 3–5px.
- The SMARTY Signal may animate once as a short line-draw when its section first enters the viewport.
- Motion stops after entry; no perpetual floating loops.
- Under `prefers-reduced-motion: reduce`, parallax and line-draw movement are disabled and all elements render in their final state.

## Responsive behavior

- Desktop shows the full ambient lighting, signal paths, and floating chips.
- Tablet reduces glow size and removes overlapping decoration that could touch content.
- Mobile removes the Hero grid and decorative floating chips, simplifies signal paths to short straight accents, and keeps all content in normal document flow.
- No decorative element may create horizontal scrolling.

## Technical approach

- Keep `expo.html` as the editable body/CSS/JavaScript source.
- Extend existing design tokens and component classes instead of adding a library.
- Add decorative markup only where pseudo-elements cannot express the required signal path or status chips.
- Download `http://msm-muangthong.com/wp-content/uploads/2026/04/05-banner-Smarty-App_Revise1.webp` during implementation and commit it under `img/` with a stable project-owned filename.
- Rebuild `index.html`, `assets/expo-body.css`, and `assets/expo-body.js` through the existing generator.
- Preserve the compiled React Hero architecture; Hero atmosphere should use the stable React `.hero` class and pseudo-elements. On mobile, reduce only the presenter layer opacity so Hero copy remains readable while the presenter and video pipeline remain present.

## Verification

- Contract tests must confirm the signature hooks, motion fallback, generated/source parity, and preserved content.
- Browser QA must check desktop and mobile layouts, Hero video readiness, absence of horizontal overflow, section reveal behavior, hover/focus states, and console errors.
- GitHub Pages must deploy successfully, followed by a live URL verification.
