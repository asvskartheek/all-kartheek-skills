# all_kartheek_skills

A local Pi package built from recurring patterns found in your Claude and Pi session history.

## What I extracted

After a second pass, I split the broader workflows into **23 atomic skills** created from repeated workflows across `~/.claude/**` and `~/.pi/**` session files.

### Repo / architecture work
- `repo-inventory`
- `repo-deep-dive`
- `solution-architecture-brief`

### Training / experiments
- `training-config-extract`
- `ml-training-repo-audit`
- `wandb-run-review`
- `modal-training-scaffold`
- `gguf-mlx-conversion-research`
- `benchmark-autoresearch-loop`
- `benchmark-repro-check`
- `plan-driven-build`

### Agents / Pi / teaching
- `local-tool-calling-demo`
- `pi-multi-agent-demo`
- `agent-architecture-explainer`
- `pi-package-bootstrap`
- `next-session-handoff`

### Observability / Phoenix
- `phoenix-tracing-debug`
- `phoenix-ingestion-smoke-test`
- `otlp-protocol-mismatch-debug`

### App/product workflows
- `active-state-persistence`
- `served-dashboard-upgrade`
- `batch-csv-brief`
- `supply-chain-incident-brief`

## Install into Pi

Option 1:

```bash
pi install /Users/asvs/all_kartheek_skills
```

Option 2: add the local package path to `~/.pi/agent/settings.json`.

## Why only skills?

The patterns I found were mostly procedural workflows rather than always-on TUI/runtime behavior, so skills were the best atomic and reusable fit.

See `SESSION_MINING_REPORT.md` for the session patterns these came from.
