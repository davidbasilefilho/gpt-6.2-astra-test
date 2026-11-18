# Field Atlas design system

This is the working design contract for the landing and all four reading routes. Read it before changing a control, layout or motion. `design-system.css` and `src/design/` implement the shared system; route CSS may compose it, not silently redefine it. Update this document when an accepted implementation changes the contract. The project-local frontend-design and visual-review-loop skills describe the design and review process, not a second set of tokens.

## Publication, not dashboard

The original solar plate is the memorable gesture. Keep the surrounding guide quiet enough to read and compare evidence. Left-align editorial copy, use informative headings, and avoid chapter numbers, eyebrow labels or explanatory microcopy that exist only to fill space. Illustrations are not charts of model performance. Keep evidence provenance, effort, harness, date and uncertainty adjacent to quantitative claims.

Square controls and surfaces belong to the atlas. Rounded celestial bodies belong to the illustration. Do not replace the engraving, sunrise mark or constellations with stock UI art. Do not turn every paragraph into a bordered card. Use layout and spacing before adding a rule.

## Tokens and typography

Use variables from `design-system.css`, not copied hex values in components.

| Role                  | Light                 | Dark                  |
| --------------------- | --------------------- | --------------------- |
| `--paper`             | `#ded5c5`             | `#20232f`             |
| `--ink`               | `#302834`             | `#f8ecda`             |
| `--muted`             | `#534a52`             | `#d0c8ce`             |
| `--rule`              | `#9a8b92`             | `#6d626f`             |
| `--accent`            | `#853921`             | `#f2a481`             |
| `--wash`              | `#c6bfcd`             | `#3b354b`             |
| `--star` / focus      | `#49436f`             | `#c4c1ee`             |
| `--btn` / `--btn-ink` | `#873a22` / `#fff9f2` | `#f1ae91` / `#36201a` |

The comparison spread uses its own paired ground/print/soft/rule variables. Its light-theme ground is plum `#5a5263`, not the main paper. The night edition distinguishes blue-black paper from its plum spread (#493d53), lit copper sunrise mark and quiet horizon. Warmth is local to the sun, not an overlay on every page. Never reuse a foreground without its intended background.

- **Newsreader (`--serif`):** titles and expressive display. Roman Sol and italic Astra are typographic identities, not evidence rankings.
- **Atkinson Hyperlegible Next (`--sans`):** reading copy, navigation, inputs, metadata and tables. Use sentence case and ordinary tracking; metadata is not a monospaced eyebrow.
- **Spacing:** shared steps are 4, 8, 12, 16, 24 and 32px. Compose responsive layouts from these before introducing a new value. Keep reading lines comfortably below 80 characters and test actual wrapping.
- **Geometry:** `--radius-control` and `--radius-surface` are 0. `--control-height` is 44px; keep usable hit areas even when an icon is smaller.
- **Focus:** shared actions use a 3px `--focus-ring`, offset 3px. Form inputs and choice labels use a 2px ring at 3px offset; tabs use a 2px inset ring at −4px, panels a 2px ring at 4px offset. Focus must remain distinguishable on paper and spread backgrounds.
- **Texture:** original paper/night PNG grain stays behind content. Review both body and panels at 1:1; it must read as material, not noise over letters. Do not increase opacity globally to fix one surface.

## Dividers have a job

Keep a line only when it communicates a boundary: header versus article, separate evidence rows, table headers, distinct pricing groups or a disclosure's hit area. Use one edge between adjacent items rather than double boxing. A change of paper stock, a heading or sufficient spacing often provides the boundary already.

Do not remove table or evidence-row structure merely to make the page look cleaner. Conversely, do not add a horizontal line above every heading or a frame around each paragraph. A decorative CSS border is not an HTML thematic break; use `hr` only for an actual thematic transition. Record what each added or removed divider helps the reader distinguish, and verify the same boundary at phone width.

## Controls and semantic primitives

Existing shared pieces include Base UI Button-backed `ActionButton` and `DisclosureMark` in `src/design/components.tsx`, `UiIcon` in `icons.tsx`, the composed trigger in `tooltip.tsx`, and the appearance and celestial surfaces in `appearance.tsx` and `celestial.tsx`. Use Base UI for semantic composite controls rather than reproducing their keyboard model in route code.

`src/design/forms.tsx` and `forms.css` provide the form system now used by Sources and Access:

- **`TextField`:** Base UI `Field.Root`, `Field.Label`, `Field.Control` and optional `Field.Description` provide source search and other text inputs. Inputs are at least 46px high with 16px text, square borders and selectable contents. A placeholder is not a label. Optional `errorMessage` renders Base UI `Field.Error`; `validationMode="onBlur"` validates after leaving the control. Keep errors associated with the input and explain its accepted range, not just its invalid color.
- **`ChoiceField<T>`:** a labeled Base UI `RadioGroup` with wrapping labels, `Radio.Root` and `Radio.Indicator` handles source category, API model and input-context range. The 16px square radio sits inside a minimum 46px label target; its 8px checked mark supplies a non-color selection cue. Base UI manages arrow selection and the group's tab stop. These parameter choices are radios, not tabs merely because they look segmented.
- **`AtlasTabs`:** Base UI Root/List/Tab/Indicator/Panel switches real content panels, such as measurement charts. Its API is `{ label, items: [{ value, label, content }] }`. Tabs are at least 48px high and activate on focus; Base UI handles arrows and Home/End. `keepMounted` panels plus React `Activity` preserve local state while hiding inactive content from interaction. A reduced-motion-aware `ViewTransition` wraps the panels; the underline follows the selected tab. The short inline strip becomes full width below 520px. Do not add a second keyboard model.

The completed-work worksheet was deliberately removed at the user's request. Do not restore its fields, invented throughput inputs or numeric helper as a demonstration of the component system. There is no live NumberField/Fieldset wrapper merely to tick a library checklist. Source category and query still compose and retain result-count feedback.

### Native versus Base UI audit

Use the installed Base UI implementation where it owns interaction: Button for shared actions; Field for text entry; RadioGroup/Radio for mutually exclusive parameters; Tabs for distinct panels; Accordion for source disclosures; Tooltip for help. The appearance menu uses Menu with a labeled radio group. Celestial help uses Popover. Horizontally overflowing tables use ScrollArea and remain real tables. Measured benchmark scores use Meter, not progress bars: a result is a reading, not work underway.

Keep true navigation as anchors with hrefs, structural navigation as `nav`, and reading content as semantic headings, paragraphs, lists and tables. Keep associated native labels inside Radio compositions, and `output` for calculated/filtered results. These are not missing library conversions. A decorative rule is not a Separator widget. New controls must use real installed primitives, not merely adopt their class names or imitate their ARIA attributes.

Standard UI icons come from the eight-symbol Tabler sprite generated by `scripts/generate-icons.mjs`. Use the typed `UiIcon` API or the same static sprite for the non-hydrated header; do not import a whole client icon registry. Icons alongside visible labels are decorative. Preserve original celestial drawings. Keep the MIT notice in `licenses/Tabler-Icons-MIT.txt`.

### Quantitative graphics

Build the subscription evidence plots with the installed `@tanstack/charts` React adapter, narrow bar/text imports and fixed, zero-based scale instances. Compare like units within a panel. Put the exact amount on each bar and expose its meaning as a chart description. Historical usage and the proxy for a different plan are not current $200 plan allowances. Keep denominators, dates, assumptions and links alongside the graphic, not hidden on hover. Both themes and 360px layouts need legible labels without horizontal scrolling.

## Action variants and color feedback

`src/design/variants.ts` re-exports the actual MIT `cn` package, pinned at 0.5.2, verified against the npm registry and [official source](https://github.com/shadcn-ui/cn). It conditionally joins classes and resolves Tailwind v4 utility conflicts. The supported direct runtime import needs no compiler plugin; the optional build compiler is not enabled. Do not add a second clsx/tailwind-merge implementation or assume custom `ds-*` names are Tailwind conflict groups.

Use `cn(controlVariants({ variant, tone, size }), className)`. Variants are `default`, `outline` and `ghost` (`primary` is a compatibility alias for `default`); tones are `accent` and `neutral`; sizes are `sm` (44px), `md` (46px), `lg` (48px) and `icon` (44px square). The choice is semantic, not route-specific. `ActionButton` renders Base UI Button. `ButtonLink` renders a real anchor; the static hero anchor uses exactly the same classes without rehydrating the header.

Color transitions use the 140ms feedback token on background, ink and border, with a distinct pressed state, disabled exclusion and reduced-motion removal of transitions. The neutral hover palette also covers disclosure rows and the appearance trigger. Hover must change a visible area, not only a one-pixel edge. Preserve checked marks, active-tab underlines and visible keyboard focus rather than substituting color for state.

Light accent hover/pressed are `#a84a2b` / `#662b1a` on `#fff9f2` text; dark uses `#ffd2b5` / `#d58c70` on `#36201a`. Neutral light hover/pressed are `#c2b5c7` / `#ad9db5` with ink; dark uses `#51445c` / `#62506d`. Calculated text contrast across these pairs is at least 5.45:1. This verifies the explicit palette, not every composited browser pixel: inspect the final cascade in both themes and the actual intermediate hover frames.

## Input, appearance and motion

Keep a visible Theme label, a recognizable current-state icon and a centered chevron. System appearance follows the operating system; an explicit light/dark choice persists. Test system changes as well as explicit choices. A tooltip adds help, not the control's only accessible name. Hover/focus can reveal it; Escape, touch and opening the menu must not leave it trapped over the menu. Do not restore native UI `title` tooltips.

All interactive content must work by keyboard and touch, not only hover. Use one interaction per constellation, not per star; Sol, Luna and Terra remain independently accessible. Preserve Escape/outside dismissal, moving hitboxes and a safe path from target to popover. Fine-pointer perspective affects the inner artwork, not the geometry used to locate targets.

| Motion     | Token | Use                                |
| ---------- | ----- | ---------------------------------- |
| Feedback   | 140ms | Color/opacity selection feedback   |
| Entry      | 210ms | Short arrival/departure            |
| Disclosure | 260ms | Measured height and content reveal |

CSS timings match `src/design/motion.ts`. Entry uses `(0.2, 0.75, 0.25, 1)`; exit uses `(0.4, 0, 0.8, 0.25)`. The damped spring belongs to physical affordances such as a rotating disclosure mark, not long reading copy or opacity.

Every spatial transition has an origin. Menus and tooltips emerge from the trigger-facing edge after collision placement; reversal closes toward that edge. Repositioning on scroll or a flip must update the origin without stale exit callbacks hiding a reopened panel. Accordions expand away from their header; bars grow from their measurement baseline; SVG rotation uses the visible pivot. Route origins come from the activating pointer or focused link, with a neutral reading-edge history fallback. Color-only feedback needs no invented direction.

Use the installed primitives’ lifecycle markers for enter/exit. Do not duplicate dismissal and stacking state in bespoke JavaScript. Base UI disclosure panels use their measured-height variable. The route article and colophon must transition together: never expose a footer while a lazy article is still empty. Avoid a second independent fade competing with native View Transitions.

Reduced motion removes autonomous orbit, perspective, spring travel and spatial route motion while preserving information, focus and actions. Check changing the preference during an in-flight animation. Production CSS may normalize `260ms` to `.26s`; verify computed timing on the actual built popup.

### Twelve principles, used selectively

Use the principles as a review lens rather than twelve effects per element. **Staging and appeal:** let group lighting and an underline indicate the subject without competing with text. **Anticipation:** hover or focus signals an available action; it must never delay activation. **Timing and slow-in/slow-out:** celestial phases accelerate continuously; menus have distinct arrival and departure curves. **Arcs:** bodies move along dashed elliptical tracks and symbols rotate about their visible pivots. **Follow-through/overlap and secondary action:** the etched rays and star light vary gently on offset phases; these are subordinate to the orbit and grouping. **Squash/stretch and exaggeration:** compress a decorative pressed icon, not its button; use a small amount of deformation on a floating surface, never text-heavy page motion. **Straight-ahead versus pose-to-pose:** calculate the sky from elapsed time, but use interruptible start/open/end poses for interactive surfaces. **Solid drawing:** preserve silhouettes, perspective origin, layer separation and readable text.

For celestial cards, resolve the vector from the **actual rendered sun** toward the untransformed popup (75%) with a secondary pointer offset (25%). Apply bounded pitch/yaw (±1.2°), sub-degree roll and shallow depth (up to 2px) only on a fine-pointer interaction. If the sun is at the card center, its directional contribution is zero. Keyboard, touch and reduced-motion presentations stay flat. Capture the open card’s local position instead of making a reader chase a moving orbit. Keep viewport clamps and scroll flips live, a 26px hover bridge, and a short 400ms grace period when the pointer crosses the gap. The two constellation areas contain all 13 stars; no star opens an individual card. Verify motion over several seconds, not just its brightest single frame.

## Evidence before release

Keep an unchanged baseline, then compare the same candidate route, viewport, theme, scroll position and interaction state after fonts settle. Inspect actual images side by side using the visual-review-loop skill. A different orbit phase is not evidence of improvement. Write concrete changes and regressions, not a numerical beauty score.

Cover phone at 360–390px, tablet and desktop; every affected route; light/dark/system; keyboard, pointer and touch; reduced motion; cold direct entry and Back/Forward. For controls, test focus, selection, validation, rapid reversal and preserved panel state. For overlays, test edge collision and scroll during movement. Check overflow without globally clipping valid popovers. Inspect intermediate frames of the compiled build; a still image cannot establish smoothness. If true video is unavailable, label a timestamped image sequence honestly.

Run frozen-lock installation, typecheck, type-aware lint, formatting, production build, then tests. Build precedes tests so the production-CSS test runs rather than skips. The suite includes executable semantic SSR coverage of the shared form controls and disabled actions, not just source-text assertions. CI is necessary but does not replace the browser checks. Freeze the reviewed source and let independent reviewers inspect that same version. Keep private references, captures and QA harnesses outside shipped assets.

Production publication follows the user's **main-only** preference: use an authorized work branch and normal PR for changes, complete review/checks, and deploy the exact verified GitHub `main` tree only after merge and applicable authorization. Do not deploy a work branch to production. Preview is not production. Verify tree identity and the resulting live deployment before reporting it complete; do not silently add docs or source changes between the reviewed tree and the release.
