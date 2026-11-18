# Field Atlas design system

This is the working design contract for the landing and all four reading routes. Read it before changing a control, layout or motion. `design-system.css` and `src/design/` implement the shared system; route CSS may compose it, not silently redefine it. Update this document when an accepted implementation changes the contract. The project-local frontend-design and visual-review-loop skills describe the design and review process, not a second set of tokens.

## Publication, not dashboard

The original solar plate is the memorable gesture. Keep the surrounding guide quiet enough to read and compare evidence. Left-align editorial copy, use informative headings, and avoid chapter numbers, eyebrow labels or explanatory microcopy that exist only to fill space. Illustrations are not charts of model performance. Keep evidence provenance, effort, harness, date and uncertainty adjacent to quantitative claims.

Square controls and surfaces belong to the atlas. Rounded celestial bodies belong to the illustration. Do not replace the engraving, sunrise mark or constellations with stock UI art. Do not turn every paragraph into a bordered card. Use layout and spacing before adding a rule.

## Tokens and typography

Use variables from `design-system.css`, not copied hex values in components.

| Role                  | Light                 | Dark                  |
| --------------------- | --------------------- | --------------------- |
| `--paper`             | `#ded5c5`             | `#211e26`             |
| `--ink`               | `#302834`             | `#f9eddf`             |
| `--muted`             | `#534a52`             | `#c9bfc9`             |
| `--rule`              | `#9a8b92`             | `#6d626f`             |
| `--accent`            | `#853921`             | `#f2a481`             |
| `--wash`              | `#c6bfcd`             | `#352e42`             |
| `--star` / focus      | `#49436f`             | `#b8b7f4`             |
| `--btn` / `--btn-ink` | `#873a22` / `#fff9f2` | `#f1ae91` / `#36201a` |

The comparison spread uses its own paired ground/print/soft/rule variables. Its light-theme ground is plum `#5a5263`, not the main paper. In dark appearance those roles resolve to the dark palette. Never reuse a foreground without its intended background.

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

Existing shared pieces include `ActionButton` and `DisclosureMark` in `src/design/components.tsx`, `UiIcon` in `icons.tsx`, the tooltip in `tooltip.tsx`, and native-overlay lifecycle helpers in `disclosure.js`. Use Base UI for semantic composite controls rather than reproducing their keyboard model in route code.

`src/design/forms.tsx` and `forms.css` provide the form system now used by Sources and Access:

- **`TextField`:** Base UI `Field.Root`, `Field.Label`, `Field.Control` and optional `Field.Description` provide source search and numeric worksheet inputs. Inputs are at least 46px high with 16px text, square borders and selectable contents. Numeric constraints remain on the control. A placeholder is not a label. Optional `errorMessage` renders Base UI `Field.Error`; `validationMode="onBlur"` validates after leaving the control. Keep errors associated with the input and explain its accepted range, not just its invalid color. Incomplete worksheet values produce guidance, not fabricated results.
- **`ChoiceField<T>`:** a labeled Base UI `RadioGroup` with wrapping labels, `Radio.Root` and `Radio.Indicator` handles source category, API model and input-context range. The 16px square radio sits inside a minimum 46px label target; its 8px checked mark supplies a non-color selection cue. Base UI manages arrow selection and the group's tab stop. These parameter choices are radios, not tabs merely because they look segmented.
- **`WorksheetTabs`:** Base UI Root/List/Tab/Indicator/Panel switches distinct workload worksheets. The worksheet is capped at 680px; its short inline tab strip follows the labels rather than spanning an empty row. Tabs are at least 48px high and activate on focus; Base UI handles arrows and Home/End. `keepMounted` panels plus React `Activity` preserve each worksheet's state while hiding inactive content from interaction. A reduced-motion-aware `ViewTransition` wraps the panels; the active-tab underline follows the selected tab. Do not add a second keyboard model or animate a focused field out from underneath the reader.

Below 520px worksheet labels stack above inputs and the tab strip becomes flex and tabs share available width. Keep calculations independent of these visual wrappers. Source category and query must compose, result-count feedback must remain available, and switching worksheets must not reset measurements. Reuse these wrappers rather than rebuilding route-specific controls; extend their API only for an actual semantic need.

Standard UI icons come from the eight-symbol Tabler sprite generated by `scripts/generate-icons.mjs`. Use the typed `UiIcon` API or the same static sprite for the non-hydrated header; do not import a whole client icon registry. Icons alongside visible labels are decorative. Preserve original celestial drawings. Keep the MIT notice in `licenses/Tabler-Icons-MIT.txt`.

## Input, appearance and motion

Keep a visible Theme label, a recognizable current-state icon and a centered chevron. System appearance follows the operating system; an explicit light/dark choice persists. Test system changes as well as explicit choices. A tooltip adds help, not the control's only accessible name. Hover/focus can reveal it; Escape, touch and opening the menu must not leave it trapped over the menu. Do not restore native UI `title` tooltips.

All interactive content must work by keyboard and touch, not only hover. The constellation uses one roving star tab stop across 13 targets, with arrows/Home/End; Sol, Luna and Terra remain independently accessible. Preserve Escape/outside dismissal, moving hitboxes and a safe path from target to popover. Fine-pointer perspective affects the inner artwork, not the geometry used to locate targets.

| Motion     | Token | Use                                |
| ---------- | ----- | ---------------------------------- |
| Feedback   | 140ms | Color/opacity selection feedback   |
| Entry      | 210ms | Short arrival/departure            |
| Disclosure | 260ms | Measured height and content reveal |

CSS timings match `src/design/motion.ts`. Entry uses `(0.2, 0.75, 0.25, 1)`; exit uses `(0.4, 0, 0.8, 0.25)`. The damped spring belongs to physical affordances such as a rotating disclosure mark, not long reading copy or opacity.

Every spatial transition has an origin. Menus and tooltips emerge from the trigger-facing edge after collision placement; reversal closes toward that edge. Repositioning on scroll or a flip must update the origin without stale exit callbacks hiding a reopened panel. Accordions expand away from their header; bars grow from their measurement baseline; SVG rotation uses the visible pivot. Route origins come from the activating pointer or focused link, with a neutral reading-edge history fallback. Color-only feedback needs no invented direction.

Use `createDisclosure()` for native overlays so content remains mounted through exit, becomes inert immediately on close, and rapid reopening interrupts a stale close. Base UI disclosure panels use their measured-height variable. The route article and colophon must transition together: never expose a footer while a lazy article is still empty. Avoid a second independent fade competing with native View Transitions.

Reduced motion removes autonomous orbit, perspective, spring travel and spatial route motion while preserving information, focus and actions. Check changing the preference during an in-flight animation. Production CSS may normalize `260ms` to `.26s`; the WAAPI bridge must parse units rather than assuming milliseconds.

## Evidence before release

Keep an unchanged baseline, then compare the same candidate route, viewport, theme, scroll position and interaction state after fonts settle. Inspect actual images side by side using the visual-review-loop skill. A different orbit phase is not evidence of improvement. Write concrete changes and regressions, not a numerical beauty score.

Cover phone at 360–390px, tablet and desktop; every affected route; light/dark/system; keyboard, pointer and touch; reduced motion; cold direct entry and Back/Forward. For controls, test focus, selection, validation, rapid reversal and preserved worksheet values. For overlays, test edge collision and scroll during movement. Check overflow without globally clipping valid popovers. Inspect intermediate frames of the compiled build; a still image cannot establish smoothness. If true video is unavailable, label a timestamped image sequence honestly.

Run frozen-lock installation, typecheck, type-aware lint, formatting, production build, then tests. Build precedes tests so the production-CSS test runs rather than skips. The current 26-test suite includes executable semantic SSR coverage of all three form primitives, not just source-text assertions. CI is necessary but does not replace the browser checks. Freeze the reviewed source and let independent reviewers inspect that same version. Keep private references, captures and QA harnesses outside shipped assets.

Production publication follows the user's **main-only** preference: use an authorized work branch and normal PR for changes, complete review/checks, and deploy the exact verified GitHub `main` tree only after merge and applicable authorization. Do not deploy a work branch to production. Preview is not production. Verify tree identity and the resulting live deployment before reporting it complete; do not silently add docs or source changes between the reviewed tree and the release.
