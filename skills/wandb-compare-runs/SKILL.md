---
name: wandb-compare-runs
description: Compares W&B experiment runs by fetching full eval/loss training history and finding the minimum eval/loss each run achieved (not just the final value). Reveals overfitting when a large gap exists between min and final eval/loss. Use when the user says "compare runs", "compare experiments", "which run was better", or asks about W&B experiment results.
allowed-tools: mcp__wandb__query_wandb_entity_projects, mcp__wandb__query_wandb_tool
---

# W&B Compare Runs

## Core Insight

**Final eval/loss is misleading.** A model may have reached a great minimum mid-training and then overfit. Always judge a run by its **minimum eval/loss**, not its final value.

- Large gap (final - min) → overfitting occurred
- Small gap → training was stable and well-regularized

## Workflow

### Step 1: Get runs for the project

```graphql
query GetRuns($entity: String!, $project: String!) {
  project(name: $project, entityName: $entity) {
    runs(first: 10, order: "-createdAt") {
      edges {
        node {
          name
          displayName
          state
          summaryMetrics
        }
      }
      pageInfo { endCursor hasNextPage }
    }
  }
}
```

Default: `entity=asvskartheek`, `project=yoda-speak`. Ask the user if different.

### Step 2: Fetch eval/loss history per run

For **each run** (use `name` field as the run ID):

```graphql
query RunHistory($entity: String!, $project: String!, $runId: String!, $specs: [JSONString!]!) {
  project(name: $project, entityName: $entity) {
    run(name: $runId) {
      sampledHistory(specs: $specs)
    }
  }
}
```

Variables:
```json
{
  "entity": "asvskartheek",
  "project": "yoda-speak",
  "runId": "<run name field>",
  "specs": ["{\"keys\": [\"eval/loss\"], \"samples\": 100}"]
}
```

> `sampledHistory` returns a flat list — **do not add subfield selections**, it will error.

### Step 3: Compute metrics & present table

From the history array, compute:
- **min eval/loss**: the lowest value across all checkpoints
- **final eval/loss**: the last value in the history (or from `summaryMetrics`)
- **gap**: final - min (positive = overfit, negative = impossible, ~0 = stable)

**Verdict rules:**
- gap < 0.05 → Stable
- gap 0.05–0.3 → Mild overfit
- gap 0.3–1.0 → Overfit
- gap > 1.0 → Severe overfit

Present as a markdown table sorted by min eval/loss (ascending = best first):

| Run | Min eval/loss | Final eval/loss | Gap | Verdict |
|-----|--------------|-----------------|-----|---------|
| exp1-lower-lr-cosine | 1.565 | 1.601 | +0.036 | Stable ✅ |
| baseline | 1.575 | 3.283 | +1.708 | Severe overfit ❌ |

Follow the table with a brief summary: which run is best, why, and what the training dynamics reveal.
