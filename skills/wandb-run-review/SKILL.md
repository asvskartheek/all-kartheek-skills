---
name: wandb-run-review
description: Review Weights & Biases usage in a project, identify entity/project names, compare runs, and judge which run performed best based on the requested metric. Use when asked to inspect W&B runs, summarize training dashboards, or compare experiments.
---

# W&B Run Review

Use this skill when experiment tracking is central to the question.

## Workflow

1. Find W&B references in code/config/docs.
2. Extract the exact entity and project names.
3. Identify the primary decision metric (e.g. eval loss, perplexity, accuracy).
4. If W&B tools or APIs are available, compare the relevant runs directly.
5. If not, fall back to repo logs, screenshots, local artifacts, and documented run IDs.

## Output

- W&B entity/project
- relevant runs
- comparison metric
- best run and why
- any caveats (overfitting, incomplete runs, noisy comparisons)

## Rule

Don’t declare a “best” run without stating the metric and evidence.
