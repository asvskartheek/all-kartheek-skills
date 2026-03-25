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

Produce a prompt that a fresh Pi session can execute immediately with minimal re-discovery, save it to disk, and when the user wants it, launch a fresh Pi session in Ghostty from the same repo folder using that saved prompt.

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
- the exact repo path and a saved handoff file path that can be launched with pi

## Rules

- Make the prompt **actionable**, not just descriptive.
- Prefer exact file paths and commands over vague references.
- Call out contradictions in the current implementation or UX explicitly.
- Preserve the user's language for sensitive constraints like "DO NOT IMPLEMENT THIS".
- If prior work added ADRs/decision logs, tell the next session to update them when behavior changes.
- Keep the final prompt copy-paste friendly.
- Save the prompt to a repo-local handoff file, preferably under `.pi/handoffs/`.
- If the user asks to launch the next session too, run `scripts/open-in-ghostty.sh <repo> <prompt-file>` after saving the prompt.
- If Ghostty launch fails, still return the saved prompt path and the exact manual `pi @<prompt-file>` command.

## Output format

Return:
1. a short baton-pass summary for the current user,
2. a single fenced prompt block they can paste into the next Pi session, and
3. the saved handoff file path plus whether Ghostty launch was attempted/succeeded.

## Launch workflow

When the user wants you to actually open the continuation session:

1. Write the generated prompt to `.pi/handoffs/<timestamp>-next-session.md` inside the current repo.
2. Run `scripts/open-in-ghostty.sh "<repo-path>" "<handoff-file>"`.
3. Tell the user the exact file path used and whether Ghostty was launched.
4. If launch fails, give the user the exact fallback command:
   - `cd <repo-path> && pi @<handoff-file>`

## Template

Use `references/prompt-template.md` as the starting structure and fill it with task-specific details.
