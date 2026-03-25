# Session Mining Report

Scanned recursively under:

- `~/.claude/**`
- `~/.pi/**`

## What was found

- `167` JSONL session files total
- Claude history mostly lived under `~/.claude/projects/**`
- Pi history mostly lived under `~/.pi/agent/sessions/**`
- The originally mentioned roots `~/.claude/sessions` and `~/.pi/sessions` were empty, but recursive search found the real session locations in subfolders.

## Recurring patterns turned into skills

After your follow-up, I did a second pass and split the larger patterns into more **atomic, repeatable sub-skills** instead of stopping at only 6 broad buckets.

### 1. Repository exploration / architecture understanding
Repeated in sessions like:

- `~/.claude/projects/-Users-asvs-centific-aidf-2-0/.../subagents/agent-abc538e6b85d0aa1c.jsonl`
- `~/.claude/projects/-Users-asvs-transformer-rs/.../subagents/agent-aa9dd3dbd160ca14f.jsonl`
- multiple repo inventory / architecture / project-structure prompts

Extracted skills:
- `repo-inventory`
- `repo-deep-dive`
- `solution-architecture-brief`

### 2. ML / training / experiment analysis
Repeated in sessions across `transformer-rs`, `phi3-speaks-yoda`, `ft_modal`, and `autoresearch-macos` involving training scripts, model sizes, W&B, Modal GPU runs, and output format conversions.

Representative sessions:
- `~/.claude/projects/-Users-asvs-transformer-rs/.../subagents/agent-aa9dd3dbd160ca14f.jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-phi3-speaks-yoda/*.jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-ft-modal/*.jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-autoresearch-macos/*.jsonl`

Extracted skills:
- `training-config-extract`
- `ml-training-repo-audit`
- `wandb-run-review`
- `modal-training-scaffold`
- `gguf-mlx-conversion-research`

### 3. Benchmark / autoresearch / eval verification
Repeated in optimization and evaluation sessions such as:

- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-auto-research-mm/*.jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-ft-modal/*.jsonl`
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-auto_research_mm--/*.jsonl`

Extracted skills:
- `benchmark-autoresearch-loop`
- `benchmark-repro-check`
- `plan-driven-build`

### 4. Agent internals / teaching / demos
Repeated in sessions asking to explain agent architecture, build toy agent loops, and scaffold Pi-based multi-agent demos.

Representative sessions:
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-explain-agents/545da89c-....jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-explain-agents/055b7e3a-....jsonl`
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-multi-agent-system--/2026-03-24T09-00-35-584Z_....jsonl`

Extracted skills:
- `local-tool-calling-demo`
- `pi-multi-agent-demo`
- `agent-architecture-explainer`

### 5. Phoenix / OpenTelemetry / observability
Repeated in sessions building or debugging tracing for agent apps and dashboards.

Representative sessions:
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-multi-agent-system--/2026-03-24T10-55-16-073Z_....jsonl`
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-news-monitor--/*.jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-nifty-fut-trade-agent/*.jsonl`

Extracted skills:
- `phoenix-tracing-debug`
- `phoenix-ingestion-smoke-test`
- `otlp-protocol-mismatch-debug`

### 6. Pi setup / package bootstrap
Repeated in sessions installing and verifying Pi packages, skills, themes, and other custom resources.

Representative sessions:
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-openai-param-golf--/2026-03-24T08-03-12-256Z_....jsonl`

Extracted skills:
- `pi-package-bootstrap`

### 7. Product / app implementation patterns
Repeated in sessions around dynamic dashboards, persistent warm state, and structured bulk file intake.

Representative sessions:
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-news-monitor--/2026-03-24T14-20-38-664Z_....jsonl`
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-multi-agent-system--/2026-03-24T09-03-19-820Z_....jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-prime-tutorial/.../agent-a022d01.jsonl`
- `~/.claude/projects/-Users-asvs-kartheek-hobby-projects-prime-tutorial/.../agent-a840e78.jsonl`

Extracted skills:
- `active-state-persistence`
- `served-dashboard-upgrade`
- `batch-csv-brief`

### 8. Security / incident communication
Repeated enough to be reusable when dependency compromise news breaks.

Representative session:
- `~/.pi/agent/sessions/--Users-asvs-kartheek_hobby_projects-litellm-supply-chain-guard--/2026-03-24T18-44-29-728Z_....jsonl`

Extracted skills:
- `supply-chain-incident-brief`

## Total extracted skills

22 total skills were created in `~/all_kartheek_skills/skills/`.

## Selection rule

I only promoted patterns that looked:

- atomic
- repeatable across projects
- reusable without depending on one repo’s domain objects

I intentionally did **not** convert one-off project-specific implementation details into generic skills.
