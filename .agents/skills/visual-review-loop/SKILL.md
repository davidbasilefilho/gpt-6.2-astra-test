---
name: visual-review-loop
description: Compare and improve rendered interface versions using screenshots, genuine motion evidence, and reproducible UX checks in a cloud browser. Use for visual refinement, responsive or interaction QA, and design sign-off; not for backend-only changes.
---

# Visual Review Loop

Make the next version demonstrably better for its intended reader. Treat the brief and accepted design as constraints, not a license to redesign unrelated surfaces.

## Establish comparable evidence

Record the route, viewport, appearance, motion preference, input method, scroll position and interaction state for each capture. Retain an unchanged baseline before editing. Use the same state for the candidate; different viewports, animation phases, or font loading can masquerade as regressions.

In a managed Sites cloud environment, read the Sites preview reference before launching a server. Use the supported cloud browser through `cua_repl`, not the owner's computer. Read the browser's current documentation and observe controls before acting. If preview or capture is unavailable, report that gap; do not invent screenshots or bypass environment restrictions with a second browser automation stack. This skill does not grant publication or account permissions.

Capture the page after fonts/layout stabilize. Prefer screenshots directly from the browser. Save at least the decisive first viewport and a downstream content/interaction state for meaningful changes. Do not commit private content or credentials visible in captures.

## Judge before changing

Open the baseline, design reference when present, and candidate through an image-viewing tool. Compare them directly. If useful, run the local helper to place two existing captures side by side:

```sh
python .agents/skills/visual-review-loop/scripts/compare_frames.py before.png after.png --output comparison.png
```

The helper never captures a page and cannot establish correctness. It preserves screenshot aspect ratios and labels both versions. A contact sheet is a comparison artifact, not an authentic browser screenshot or video.

Write specific observations in a review log outside production assets:

- **Reading:** where the eye starts; whether the next action and information hierarchy are obvious; line length, wrapping, density and unnecessary copy.
- **Composition:** alignment, rhythm, whitespace, token consistency, image crop and whether the subject has a distinct visual identity rather than template decoration.
- **Use:** navigation, active state, keyboard order/focus, touch targets, overflow, persistent settings, empty/error states and working links.
- **Access:** contrast, semantics and accessible names; behavior at narrow widths and zoom; non-color cues; reduced motion and absence of inaccessible hover-only content.
- **Motion:** whether an effect explains an action; settling time; interrupted/repeated actions; pointer/touch parity; content remaining available when animation is disabled.

Name each issue, its affected state, severity, evidence file and proposed fix. Fix blockers first, then the largest perceptual issue. Keep the useful qualities of the baseline. Avoid rounds of cosmetic changes without evidence of improvement.

## Motion and responsive checks

Test at one narrow phone, tablet and desktop size, adding widths where actual wrapping fails. Test all affected routes and light/dark/system behavior. Verify keyboard traversal and Escape behavior where relevant. Resize the same state rather than judging unrelated content.

Record short genuine browser/desktop motion only through capabilities the environment advertises. If video capture is unavailable, use a clearly labeled chronological screenshot sequence and state that it cannot prove frame smoothness. Do not call a slideshow a recording. For a recording, inspect representative frames plus the actual playback when possible; a single frame cannot verify duration, smoothness, or input response. Capture hover, click, scroll, transition completion and reduced-motion behavior as applicable without unnecessarily recording unrelated user content.

## Close the loop

Re-run functional checks after the visual change. Re-capture the same states and compare the final artifact to both the previous version and the accepted design. Record what improved, any regression, and any remaining blocker. Repeat when evidence reveals a material issue; do not chase an arbitrary score or require endless rounds.

Stop when relevant states have no unresolved material defects and the final captures support the brief. Otherwise stop with a precise verification gap or blocker. Deliver the best final evidence and a concise before/after rationale. Keep artifacts only when requested or useful for review; keep QA files out of production bundles unless deliberately part of the site.
