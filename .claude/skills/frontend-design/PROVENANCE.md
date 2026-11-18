# Provenance and security assessment

Retrieved 2026-11-18. `SKILL.md` is unmodified from Anthropic's Claude Code repository:
https://github.com/anthropics/claude-code/blob/dbdd79cebfae5891f5b0fab6f7773ea520d289a7/plugins/frontend-design/skills/frontend-design/SKILL.md

That directory was subsequently removed when the marketplace moved to claude-plugins-official. The old snapshot references a LICENSE.txt that is absent from its directory. The same skill bytes are distributed by Anthropic under Apache License 2.0 at:
https://github.com/anthropics/skills/tree/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/frontend-design

`LICENSE.txt` is the unmodified license from that latter directory. This document is project-authored, not an Anthropic endorsement.

SHA-256:

- SKILL.md: d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3
- LICENSE.txt: 0d542e0c8804e39aa7f37eb00da5a762149dc682d7829451287e11b938e94594

## Static review: PASS

Reviewed all 71 lines of the skill and its accompanying license before inclusion. The skill is prose-only design guidance. It contains no executable helpers, hooks, dynamic shell interpolation, credential requests, downloads, external submission destinations, or changes to permissions. Its reference to memory is ordinary design-context use, not exfiltration. Its stylistic client narrative is not evidence about this project's actual user. Apply actual user instructions over illustrative assumptions.

Coverage: this exact skill file and license, not the entire Anthropic repositories. No bundled code was executed. Updating to a different snapshot requires a new review. This assessment is bounded, not a guarantee about all future usage or all external dependencies.
