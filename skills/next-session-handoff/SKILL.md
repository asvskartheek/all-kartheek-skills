---
name: next-session-handoff
description: Turn the current task state into a copy-paste-ready baton-pass prompt for a fresh Pi session. Use when the user wants to continue later, hand work to another agent/session, or preserve momentum without re-explaining everything.
---

# Next Session Handoff

Use this when the user says things like:
- "write a prompt for my next Pi session"
- "pass the baton"
- "create a handoff"
- "prepare continuation instructions"
- "summarize what the next agent should do"

## Goal

Produce a prompt that a fresh Pi session can execute immediately with minimal re-discovery.

## Before writing the prompt

1. Inspect the current repo state, relevant files, recent commits, screenshots, and open issues.
2. Separate **already completed work** from **still pending work**.
3. Capture explicit user constraints, especially anything the user said **not** to implement right now.
4. Identify the next concrete objective and the acceptance criteria.
5. Gather exact paths, URLs, commands, and documents the next session must read first.
6. Note any design docs / ADRs / decision logs that must be updated if the next session changes behavior.

## What the handoff prompt must include

- the exact objective for the next session
- current state / what is already implemented
- specific files and docs to read first
- the unresolved issue(s) to address next
- constraints and no-go items
- validation steps to run
- expected deliverables back to the user
- open questions only if they are truly blocking

## Rules

- Make the prompt **actionable**, not just descriptive.
- Prefer exact file paths and commands over vague references.
- Call out contradictions in the current implementation or UX explicitly.
- Preserve the user's language for sensitive constraints like "DO NOT IMPLEMENT THIS".
- If prior work added ADRs/decision logs, tell the next session to update them when behavior changes.
- Keep the final prompt copy-paste friendly.

## Output format

Return:
1. a short baton-pass summary for the current user, and
2. a single fenced prompt block they can paste into the next Pi session.

## Template

Use `references/prompt-template.md` as the starting structure and fill it with task-specific details.
