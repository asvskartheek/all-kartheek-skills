# Session Mining Report

## Current pass scope

Deep scan of the actual Pi session tree under:

- `~/.pi/agent/sessions/**`
- `~/.claude/sessions/**`

## What was found in this pass

- `53` Pi session JSONL files under `~/.pi/agent/sessions/**`
- `0` Claude session files under `~/.claude/sessions/**`
- Pi sessions were spread across these repo buckets:
  - `--Users-asvs-all_kartheek_skills--`
  - `--Users-asvs-kartheek_hobby_projects--`
  - `--Users-asvs-kartheek_hobby_projects-auto_research_mm--`
  - `--Users-asvs-kartheek_hobby_projects-job-hunt-agent--`
  - `--Users-asvs-kartheek_hobby_projects-litellm-supply-chain-guard--`
  - `--Users-asvs-kartheek_hobby_projects-multi-agent-system--`
  - `--Users-asvs-kartheek_hobby_projects-news-monitor--`
  - `--Users-asvs-kartheek_hobby_projects-openai-param-golf--`
  - `--Users-asvs-kartheek_hobby_projects-phi3_speaks_yoda--`

## Strong repeated themes from the Pi tree

Keyword frequency from first-user prompts in this pass:

- `news`: 14
- `skill`: 8
- `github`: 7
- `session`: 6
- `feedback`: 6
- `autoresearch`: 4
- `notification`: 4
- `extension`: 3
- `plan`: 3
- `handoff`: 3
- `phoenix / trace / observability`: repeated across `multi-agent-system` and `news-monitor`

## Newly extracted capabilities from the deeper pass

### 1. Local session mining itself
Repeated asks:
- mine local Pi/Claude sessions
- identify repeatable workflows
- create new skills/extensions without duplication

Created:
- `skills/local-session-miner`

Why it is distinct:
- unlike `pi-share`, this mines local JSONL trees, not shared gist-backed session URLs
- unlike `next-session-handoff`, this is cross-session capability extraction rather than baton-passing one task

### 2. Autoresearch → polished paper workflow
Repeated asks in training/autoresearch repos:
- turn experiment history into a real paper
- summarize ablations and why the method worked
- render LaTeX to PDF

Created:
- `skills/autoresearch-paper`

Why it is distinct:
- unlike `researching-open-ended-problems`, this starts from completed experiment artifacts and writes publication-style output
- unlike `benchmark-repro-check`, this is about writeup synthesis, not reproduction judgment

### 3. Minimal / clean-room Pi session workflow
Repeated asks:
- start Pi with no extensions/skills/themes
- isolate noisy customizations
- debug Pi behavior in a bare session

Created:
- `skills/pi-minimal-session`

Why it is distinct:
- unlike `pi-package-bootstrap`, this is not about installing resources
- it is specifically about stripping Pi down for debugging/reproduction

### 4. Project-local Pi cleanup
Repeated asks:
- clean project Pi context/settings
- disable noisy local tooling
- clean stale `.pi/` clutter

Created:
- `skills/pi-project-cleanup`

Why it is distinct:
- unlike `repo-inventory`, this targets `.pi/` operational debris and local session artifacts
- unlike `pi-minimal-session`, it cleans the project state rather than just launching Pi minimally

### 5. Public-ready repo polish
Repeated asks:
- make the repo push-ready/public-ready
- improve README professionally
- add screenshots and packaging guidance

Created:
- `skills/repo-publish-readiness`

Why it is distinct:
- unlike `repo-deep-dive`, it optimizes for outside users, not internal understanding
- unlike `github`, it focuses on repo presentation and usability, not GitHub operations themselves

### 6. Feedback board / ticket normalization runtime behavior
Repeated asks:
- convert `user_requests.md` or feedback into tickets
- assign work to sub-agents
- show a board
- later: close/disable the board

Created and enriched:
- `extensions/feedback-ticket-board`

Deep-pass upgrade added:
- tool actions: `build`, `list`, `close`
- command: `/feedback-ticket-board`
- command: `/feedback-ticket-board-close`
- widget close support so the board can be hidden cleanly

Why it is an extension:
- this needs commands, a tool, widget state, and runtime UI behavior

### 7. LiteLLM incident audit runtime tool
Repeated asks:
- scan many repos for compromised LiteLLM versions
- produce remediation guidance

Created:
- `extensions/litellm-incident-audit`

Why it is an extension:
- this is best as an active runnable audit command/tool, not just a static playbook

## Useful removals from this pass

Removed as low-value or off-target:
- `extensions/idk` — placeholder extension with no meaningful capability
- `skills/kartheeks-skill-creator` — Claude-skill-specific and not a good fit for this Pi package’s focus

## Session-driven rationale for the new packages

Representative Pi sessions that directly motivated this deeper pass:

- Minimal Pi session:
  - `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects--/2026-03-24T11-21-11-257Z_4736c93c-a37b-49a9-8c10-cc287210120b.jsonl`
- Noisy Pi startup / config trimming:
  - `~/.pi/agent/sessions/--Users-asvs-all_kartheek_skills--/2026-03-25T16-53-21-713Z_8e40eec9-e5b2-4281-8bb2-ae8b437d81df.jsonl`
- Feedback board creation:
  - `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-news-monitor--/2026-03-24T10-50-05-026Z_670b05b7-95f5-411e-a636-dd6fbc77a993.jsonl`
- Feedback board close/disable pain:
  - `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-news-monitor--/2026-03-25T15-35-20-798Z_7a799f80-96bb-4b3e-8b3e-7356b3078cf4.jsonl`
- Public-ready README/repo polish:
  - `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-news-monitor--/2026-03-24T13-37-57-040Z_c49014e3-8978-484d-8d39-0678aadc101b.jsonl`
  - `~/.pi/agent/sessions/--Users-asvs-all_kartheek_skills--/2026-03-25T16-42-33-045Z_2d7ff92d-ac0b-45f4-9560-2dbf40ba2baf.jsonl`
- Autoresearch paper request:
  - `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-phi3_speaks_yoda--/2026-03-25T16-36-38-275Z_cba70c37-1817-47c5-b8d1-a051c4eeb644.jsonl`
- Repo-wide LiteLLM incident scanning ask:
  - `~/.pi/agent/sessions/--Users-asvs--/2026-03-24T18-19-56-093Z_3e4de1c9-bf4a-4376-8aea-6fe409069d61.jsonl`

## Net result after this deeper pass

Repo now contains:
- `54` packaged skills
- `3` packaged extensions

New additions from this pass:
- `local-session-miner`
- `autoresearch-paper`
- `pi-minimal-session`
- `pi-project-cleanup`
- `repo-publish-readiness`
- richer `feedback-ticket-board`
- `litellm-incident-audit`

## Selection rule

I promoted only workflows that looked:
- atomic
- repeatable across at least multiple sessions or clearly across multiple repos
- reusable without depending on one repo’s domain model

I excluded one-off product tweaks such as specific news-monitor UI fixes, source additions, or single-repo architectural decisions unless they generalized into a durable capability.