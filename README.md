# The Field Atlas: Sol & Astra

An independent English editorial guide to GPT-6.2 Sol and Astra. The site separates official claims, early tester reports, the provider response and editorial suggestions. It is a launch-period snapshot, not a benchmark or universal ranking. Source verification and limitations are available in the reading room.

## Run

Requires **Bun 1.4.4** (the latest registry version checked on 18 November 2026).

```sh
bun install --frozen-lockfile
bun run dev
bun run typecheck
bun run lint
bun run test
bun run format:check
bun run build
```

`npm install` was used only to bootstrap Bun in the build environment. The committed `bun.lock` is the reproducible Bun lockfile. No runtime credentials, backend or API keys are needed.

## Routes

- `/`: interactive editorial landing page
- `/compare`: positioning and practical model comparison
- `/field-notes`: attributed launch-period reports, system-card context and a local checklist
- `/sources`: searchable/filterable evidence with expandable verification notes
- `/access`: subscription-oriented Work and Codex access guide

The build emits dedicated `index.html` files for all four secondary routes plus a `404.html` fallback, so direct links do not depend solely on an SPA rewrite. Route bodies are lazy-loaded and native navigation links preload their route on pointer or keyboard intent. The application adds client navigation to native landing links while keeping URLs shareable. The public audience is configured through Sites, not this code.

## Implementation

- React **19.3.1**, React DOM and TypeScript (strict mode).
- Vite **8.3.8**; React Compiler enabled through the current Vite React plugin’s `compiler: true`, using `oxc-transform-react`.
- TanStack Router: intent preloading, view transitions, scroll restoration and route-aware titles/focus.
- TanStack Table **9.3.1**: official legacy adapter for a small semantic comparison table. No artificial sorting controls on a four-row comparison.
- Tailwind CSS **4.3.5** plus a reusable custom token-based editorial system.
- Base UI Accordion provides accessible source disclosures.
- Motion handles restrained route entry; React `Activity` preserves a hidden checklist, and React `ViewTransition` animates that change where supported.
- TanStack Markdown renders curated editorial notes using its React adapter, `@tanstack/markdown/react`. See the [official rendering guide](https://tanstack.com/markdown/latest/docs/guides/react).
- OXLint **1.94.0** with `--type-aware --type-check` and `oxlint-tsgolint`; TSRS **0.25.0-ts7.1.0-beta** for independent typechecking.
- OXFmt **0.79.0**: import sorting, package metadata sorting and Tailwind class sorting, with 100-column single-quoted formatting.

Version details are recorded in `package.json` and `bun.lock`; do not silently replace them when reproducing this build. React Compiler avoids unnecessary hand-authored memoization. Derived values stay derived, static table data lives outside components, and high-frequency celestial pointer work is kept out of React state.

## Accessibility and motion

Semantic sections, keyboard-accessible links, visible focus indicators, labeled controls, contrast-aware theme tokens and a horizontally keyboard-scrollable comparison table are intentional. System/light/dark preference and reduced-motion behavior are supported. The celestial experience is decorative; all editorial content and actions remain available without using the pointer effects. The checklist is session-local and is not sent anywhere.

## Evidence maintenance

`evidence.js` is the editorial source of truth. Each entry includes author, date, canonical URL, summary, caveat and how it was verified. Read the full relevant source before updating it. Do not convert reported experiences into established general facts. Direct X access was blocked during this research; attachments and public mirrors are disclosed per entry. Subscription prices and usage limits are deliberately not frozen into a launch-day table.

## Validation

The Node test suite checks source integrity, citation references, exact source-filter behavior and route/accessibility contracts. It is **not** a substitute for browser interaction testing. Check desktop and mobile, both color schemes, keyboard operation, reduced motion, direct route entry, back/forward navigation, source filtering and disclosures, the field checklist and the celestial interaction before release. Keep user-requested screenshots and short video artifacts separate from runtime assets.

## License

Apache License 2.0. Copyright 2026 David Basile Filho. Third-party packages and vendored materials retain their own licenses. This site is independent and is not affiliated with OpenAI.
