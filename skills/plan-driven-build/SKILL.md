---
name: plan-driven-build
description: Read a `plan.md` or equivalent implementation plan, turn it into execution checkpoints, and build from the plan without losing traceability. Use when a project already has a plan file and the task is to implement it systematically.
---

# Plan-Driven Build

Use this when the plan already exists.

## Workflow

1. Read `plan.md` completely.
2. Translate plan sections into concrete implementation tasks.
3. Validate assumptions against the current repo state.
4. Implement in checkpoints rather than one giant change.
5. Keep reporting tied back to the original plan items.

## Deliverables

- plan-to-task mapping
- implementation status by section
- deviations from plan
- unresolved blockers

## Rule

Don’t blindly follow stale plans; reconcile the plan against current code before editing.
