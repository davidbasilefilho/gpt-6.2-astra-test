# Field Atlas agent instructions

## Applicable skills

For frontend creation, styling, or substantial visual changes, read and apply `.claude/skills/frontend-design/SKILL.md`. Its pinned origin and review are documented beside it. The user's actual brief wins over illustrative assumptions in the skill.

For rendered-interface QA, motion, responsive changes, or iterative visual refinement, read and apply `.agents/skills/visual-review-loop/SKILL.md`. Compare actual artifacts; do not substitute a self-assigned numerical score for evidence.

Use the supplied Sites workflow for source packaging and publication, preserving the project identity in `.openai/hosting.json`. The present project targets public publication, but a new request does not automatically authorize other projects or audiences.

## Product and evidence

Maintain an independent English editorial guide to GPT-6.2 Sol and Astra, not an official OpenAI site. Prefer useful concise copy. Distinguish official statements, tester experience, and editorial judgment. Do not invent benchmark numbers, product availability, quotations, or pricing. Cite primary sources and date mutable claims. Subscription usage, not API tutorials, is the scope. Preserve a balanced account of strengths, failures, and uncertainty.

## Engineering

Use the checked-in package scripts and lockfile. Prefer Bun, React, TypeScript, Tailwind, TanStack Router, Table, Motion, and Base UI where applicable. Keep intent preloading and route view transitions with a reduced-motion path. Use Activity or ViewTransition only where supported and useful. Preserve the actual installed versions; do not claim requested unreleased versions are installed. Use React Compiler guidance rather than gratuitous memoization. Run Oxlint type-aware lint/typecheck, formatting checks, tests and production build where configured. Report unavailable checks honestly.

## Design and verification

Preserve reusable tokens and component primitives. Keep the celestial interaction original rather than copying source art. Support light, dark and system appearance; keyboard, touch, visible focus, readable contrast and reduced motion. Review narrow phone, tablet and desktop layouts and all meaningful routes, not only the landing hero. Preserve private reference images outside public output unless separately licensed for redistribution. Capture requested screenshots and motion evidence, distinguish genuine video from a still-image sequence, and compare successive versions with a written change rationale.

## Scope and delivery

Use cloud capabilities for work that does not depend on the user's computer. No secrets, credentials, personal exports, dependency directories or private source material in commits. Original project code is Apache-2.0, copyright 2026 David Basile Filho; retain third-party notices and licenses. Publish only after the applicable checks and verified deployment outcome. Never describe a pending deployment as live.
