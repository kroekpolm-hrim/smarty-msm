# SMARTY Elementor Free Editable Template Design

## Goal

Rebuild the SMARTY landing page as an importable Elementor template whose visible content can be edited with Elementor Free. The template is intended as a safe trial alongside the existing shortcode-based page.

## Delivery

- Deliver one Elementor Template JSON file ready for import through **Templates > Saved Templates**.
- Use only widgets and layout controls available in Elementor Free.
- Do not require the SMARTY shortcode plugin or Elementor Pro.
- Do not modify global Elementor Site Settings, the active WordPress theme, or existing pages.
- Keep the existing shortcode plugin ZIP unchanged so the current implementation remains available as a fallback.

## Page Structure

The imported template will contain independently selectable containers and widgets for:

1. Hero and primary calls to action.
2. Trust and usage statistics.
3. Resident features.
4. Juristic-person and property-management features.
5. Product interface previews.
6. Testimonials.
7. Download call to action.
8. Two-column FAQ, with resident and juristic-person questions separated.
9. Contact and demo-request form presentation.
10. Footer content.

Each heading, paragraph, image, button, statistic, testimonial, FAQ entry, and form-field presentation will be a standard Elementor widget or an independently editable child container. Repeated content will not be hidden inside a single HTML widget.

## Visual Direction

- Preserve the current SMARTY page's soft, premium appearance.
- Retain its pink primary color and blue accent color.
- Use IBM Plex Sans Thai where Elementor's typography controls permit it; otherwise inherit the website font and document the one-time global font setup.
- Reproduce spacing, rounded cards, shadows, and responsive hierarchy with Elementor controls.
- Use Elementor Free entrance effects sparingly for section reveal. Custom JavaScript counters and bespoke motion are out of scope.

## Responsive Behavior

- Desktop uses multi-column feature, statistic, testimonial, and FAQ layouts.
- Tablet reduces dense grids to two columns where appropriate.
- Mobile stacks content into a single reading order, keeps buttons touch-friendly, and prevents horizontal overflow.
- Decorative elements that cannot be represented reliably with Elementor Free will be simplified instead of embedded as custom code.

## Images and Portability

- Reference the existing SMARTY image assets in the template when the export format supports URLs.
- Include a companion image folder and a short image-relink checklist because imports into a different WordPress installation may not copy local media automatically.
- Do not use machine-local `file://` paths in the delivered JSON.

## Forms

Elementor Free does not include Elementor's Form widget. The contact section will therefore be built as an editable visual mockup using headings, text, and button widgets. It will clearly indicate that submission requires a separate form plugin or a later integration. The template will not pretend to collect or transmit leads.

## Import Workflow

1. Import the JSON through WordPress **Templates > Saved Templates > Import Templates**.
2. Open the target page with Elementor.
3. Insert the imported SMARTY template from the folder icon.
4. Set the page layout to Elementor Canvas if the theme header and footer should be hidden.
5. Relink any missing images from Media Library.
6. Review desktop, tablet, and mobile modes before publishing.

## Validation

- Confirm the JSON parses successfully and has Elementor template metadata.
- Check that the template uses no Pro-only widgets and no SMARTY shortcode.
- Check that all visible content is represented by editable Elementor elements.
- Check that local filesystem paths are absent.
- Inspect desktop, tablet, and mobile structure for readable ordering and sensible spacing.

## Out of Scope

- Live lead submission or CRM/email integration.
- Custom JavaScript number counters.
- Exact reproduction of all bespoke CSS animation.
- Editing or replacing the already published shortcode plugin.
- Uploading the template into the user's WordPress installation.
