---
name: pi-project-cleanup
description: Clean up noisy project-local Pi state such as .pi/settings.json, temporary boards, stale todos, handoffs, and local extensions when they are cluttering a repo. Use when the user asks to clean Pi context or reset repo-local Pi behavior.
---

# Pi Project Cleanup

Use this skill when a repo has accumulated noisy local Pi state and the user wants it simplified.

## Typical targets

- `.pi/settings.json`
- `.pi/extensions/`
- `.pi/skills/`
- `.pi/prompts/`
- `.pi/themes/`
- `.pi/todos/`
- `.pi/handoffs/`
- `.pi/feedback-ops/`

## Workflow

1. Inventory project-local `.pi/` contents.
2. Separate **runtime configuration** from **temporary working artifacts**.
3. Ask whether the cleanup should be:
   - non-destructive archival,
   - selective deletion,
   - or full reset.
4. Preserve anything clearly valuable before removing noise.
5. Remove or disable the items causing clutter.
6. Tell the user exactly what remains active after cleanup.

## Common cleanup actions

- disable a noisy project-local extension
- remove a temporary board/widget generator
- archive or delete stale handoffs/todos
- simplify `.pi/settings.json`
- convert one-off session artifacts into docs, then delete the raw clutter

## Rule

Do not delete project-local Pi state blindly. Always distinguish between intentional tooling and temporary session debris.
