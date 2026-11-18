# Plate and ledger

An independent field atlas, not an OpenAI product page. The visual reference pairs an open-paper scientific plate with a source ledger. Preserve a discernible distinction between publication illustration and evidentiary data: the orbits do not chart performance.

- Paper #ded5c5, print #302834, solar #853921, ink-violet #49436f, mineral lavender #c6bfcd; in night mode use warm charcoal, candle-colored type and readable peach accents.
- Self-hosted Newsreader for display/long-form and Atkinson Hyperlegible Next for navigation and controls. Roman Sol and italic Astra echo the opposing bodies in the illustration, not a difference in factual authority.
- Left-aligned folio title alongside an interactive original solar engraving. A broad lavender comparison spread and a quieter reading index follow. On mobile the same illustration becomes a compact plate with touch-selectable focus. Source material follows in an accessible ledger.
- One memorable gesture: select a point in the star chart and the plate changes focus. Parallax reacts to the pointer; scrolling subtly shifts a single orbital group. The system reduced-motion preference freezes the plate without hiding either body.
- Keep nav labels clear, avoid decorative metrics and do not use constellation geometry as evidence. In night mode use the same publication, not a separate visual identity.

## The interface system

Use `design-system.css` for surfaces, controls, focus, spacing and timing. The landing and every route use the same square buttons, menu, inputs and disclosures. Rounded geometry is reserved for illustrations of celestial bodies, not UI corners. Atkinson Hyperlegible Next carries reading copy, metadata and controls; Newsreader is for titles. Small text uses normal case and spacing, not a monospaced eyebrow. Keep body text on a quiet ground; fine grain, the telescope etching, hatching and regional ink colors give the page texture without competing with a paragraph.

Reuse `src/design/components.tsx` for actions and disclosure indicators; native landing controls use the same CSS classes. New overlays should call `createDisclosure()` from `src/design/disclosure.js`, not set hidden immediately on exit. Source panels use Base UI's measured-height variable. Workload worksheets preserve entries when switching plans.

- **Feedback:** 140 ms. Color/opacity confirms selection without shifting content.
- **Entry:** 210 ms. Ease out on arrival, ease in when departing. An overlay originates beside its trigger; it remains rendered through exit. Opening interrupts a pending close.
- **Disclosure:** 260 ms. Interpolate content height without bounce so the reader can follow the same line. The plus/cross affords rotation with an interruptible damped Motion spring; overlay displacement uses a sampled, lightly overshooting response. Don't spring opacity or long text.
- **Reduced motion:** stop autonomous solar/orbital changes, parallax and spring travel; keep all information, actions and focus order. In a normal setting the animated plate has two navigable targets, with hover/focus/tap disclosure and Escape/outside dismissal. No mode switch or printed figure caption.

The appearance trigger is a 44px-tall instrument key: an etched phase mark and an independent SVG chevron. Rotate the chevron about the center of its symmetric viewBox, never the font baseline. Menus mark their list with `data-disclosure-content`; the panel reveals from the trigger edge as the list travels and fades, reversing on dismissal. All clickable labels are nonselectable; reading matter and editable fields remain selectable.

## Standard interface icons

Tabler Icons React 3.52.0 supplies the standard monitor, sun, moon, check, chevron, plus and directional arrows. `scripts/generate-icons.mjs` uses eight explicit named imports and React `renderToStaticMarkup` to build `public/assets/ui-icons.svg` before dev/build. The static header consumes the same symbols as the typed `UiIcon` React primitive; no header hydration or client-side Tabler registry is needed. The 24×24 view box preserves centered rotation for chevrons and disclosure marks. Icons are decorative beside named controls. Original celestial illustrations and brand artwork remain original and unchanged.

The installed package declares `sideEffects: false`; the client imports no Tabler runtime at all because only the eight generated symbols ship. The MIT license is retained in `licenses/Tabler-Icons-MIT.txt`. Tabler Icons are free for this use, require no paid service, and do not change the site's model pricing data. Version 3.52.0 was resolved from the npm stable `latest` tag with Bun on 18 November 2026.
