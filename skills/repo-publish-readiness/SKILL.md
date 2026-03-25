---
name: repo-publish-readiness
description: Make a repository public-ready and shareable with a strong README, install/run instructions, screenshots, packaging notes, and release hygiene. Use when the user wants to push a repo publicly or make it professional-grade for others.
---

# Repo Publish Readiness

Use this skill when the user says things like:
- make this repo push ready
- make it shareable to everyone
- improve the README
- make this public-ready
- prepare this for GitHub

## Goal

Turn a working repo into a repo strangers can understand and use.

## Workflow

1. Inspect the actual product state.
   - `README.md`
   - entrypoints
   - package manifests
   - screenshots/assets already present
   - run/test commands
2. Reconcile docs against reality.
   - remove stale architecture claims
   - update install steps
   - update required env vars
   - document current stack honestly
3. Upgrade the README.
   - concise summary
   - feature list
   - screenshots/gifs if available
   - quick start
   - configuration
   - architecture overview
   - troubleshooting
   - distribution/install notes
4. Check packaging polish.
   - license if needed
   - repo metadata
   - package manifest fields
   - example config or `.env.example`
5. If screenshots exist, include them cleanly.
6. Return a push-readiness checklist with remaining gaps.

## Deliverables

- improved `README.md`
- any supporting docs/assets wired into it
- a short remaining-gaps list such as signing, CI, releases, or secrets handling

## Rule

Optimize for the first-time outsider, not for the original author who already knows how it works.
