---
name: local-session-miner
description: Mine local Pi and Claude session transcripts to find recurring workflows, cluster repeatable tasks, and propose non-duplicate skills/extensions for this repo. Use when the user asks what capabilities should be packaged from prior sessions.
---

# Local Session Miner

Use this skill when the user wants to mine prior local agent sessions for repeatable workflows worth turning into Pi skills or extensions.

## Scope

Primary local sources:
- `~/.pi/agent/sessions/`
- `~/.claude/sessions/`
- project-local `.pi/handoffs/`, `.pi/todos/`, `.pi/feedback-ops/`

## Goal

Turn messy historical sessions into an actionable shortlist of **atomic**, **repeatable**, **non-duplicate** capabilities.

## Workflow

1. Inventory recent session files first.
   - Prefer the last 1-3 days unless the user asks for a wider window.
   - Extract: repo path, first user request, notable repeated corrections, and end state.
2. Cluster requests by repeatable workflow.
   - Good clusters: convert feedback into tickets, create handoff prompts, generate research papers from experiments, audit repos for incidents.
   - Bad clusters: one-off bugfixes, project-specific filenames without reusable behavior.
3. Compare candidate capabilities against the existing package catalog.
   - Check `README.md`, `skills/`, and `extensions/`.
   - Reject semantic duplicates, not just exact name collisions.
4. Decide skill vs extension.
   - **Skill** when the capability is mostly workflow guidance, reusable playbooks, or helper commands.
   - **Extension** when it needs runtime commands, custom tools, widgets, persistent state, or session UI behavior.
5. Keep the output atomic.
   - Prefer one sharp capability over a giant “do everything” package.
   - Split large ideas into smaller pieces if they can be used independently.
6. Write or scaffold the chosen packages in this repo.
7. Update repo docs briefly so the new items are discoverable.

## Dedup heuristics

A candidate is probably a duplicate if an existing skill/extension already covers most of:
- the same trigger phrase,
- the same workflow steps,
- and the same user outcome.

A candidate is probably **not** a duplicate if it changes the primary job to be done, for example:
- `next-session-handoff` vs mining many sessions for new capabilities,
- `pi-share` vs scanning local session JSONL files,
- `phoenix-tracing-debug` vs turning feedback into a ticket board,
- `researching-open-ended-problems` vs writing a polished paper from finished autoresearch artifacts.

## Useful commands

```bash
find ~/.pi/agent/sessions -type f -name '*.jsonl' | tail -200
find ~/.claude/sessions -type f 2>/dev/null | tail -200
```

```bash
python3 - <<'PY'
import os, json, glob
base=os.path.expanduser('~/.pi/agent/sessions')
for path in sorted(glob.glob(base+'/**/*.jsonl', recursive=True))[-50:]:
    cwd=''; first=''
    with open(path) as f:
        for line in f:
            obj=json.loads(line)
            if obj.get('type')=='session': cwd=obj.get('cwd','')
            if obj.get('type')=='message' and obj.get('message',{}).get('role')=='user':
                first=' '.join(block.get('text','') for block in obj['message'].get('content',[]) if block.get('type')=='text')
                break
    print(os.path.basename(path), '\t', cwd, '\t', first[:180])
PY
```

```bash
rg -n "^name:|^description:" skills extensions README.md
```

## Output expected back to the user

Return:
- the mined capability shortlist,
- why each item is repeatable,
- why each item is not a duplicate,
- whether each should be a skill or extension,
- and the exact files created/updated.

## Rules

- Do not claim a workflow is reusable unless it appears in more than one session or clearly generalizes beyond one repo.
- Prefer repo-local capabilities over personal/private workflows that would only work on one machine.
- Avoid giant kitchen-sink skills.
- If unclear, build the smaller package first.
