---
name: batch-csv-brief
description: Read many CSV files in a folder and produce concise per-file briefs with the key facts requested by the user. Use when summarizing interview sheets, tabular intake forms, batch exports, or datasets that need one-summary-per-file.
---

# Batch CSV Brief

Use this skill for repeated per-file extraction across many CSVs.

## Run first

```bash
bash scripts/list-csvs.sh <folder>
```

## Workflow

1. Enumerate the CSV files in scope.
2. Read them systematically.
3. Extract the same fields or summary dimensions for each file.
4. Present results in a consistent format.

## Good output formats

- one subsection per file
- compact table with fixed columns
- bullets for missing or ambiguous values

## Rule

Keep the extraction schema consistent across all files unless the user asks for special handling.
