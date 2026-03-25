---
name: repo-inventory
description: Produce a clean inventory of a local repository: top-level tree, key docs, config files, likely entrypoints, and notable generated/vendor folders. Use when asked to list files, map a repo quickly, or create a lightweight project inventory before deeper analysis.
---

# Repo Inventory

Use this when the user wants a fast, factual repo map without a full architecture deep dive.

## Run first

```bash
bash scripts/inventory-lite.sh <repo-path>
```

## Output

- top-level directories/files
- key docs (`README`, `QUICK_START`, `CLAUDE`, `AGENTS`)
- key config files
- candidate entrypoints
- noisy/generated directories worth ignoring

## Rules

- Be concise and file-path-heavy.
- Don’t infer architecture unless asked.
- Exclude `.git`, `node_modules`, `dist`, `build`, `.venv`, `target`, caches unless relevant.
