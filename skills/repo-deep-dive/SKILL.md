---
name: repo-deep-dive
description: Systematically explore a local code repository and produce a clear summary of what it does, its folder layout, stack, key modules, entrypoints, configs, and run paths. Use when asked to understand a repo, audit architecture, inventory structure, or answer “what is this project?”.
---

# Repo Deep Dive

Use this skill for broad repository reconnaissance.

## Fast start

Run the helper inventory first:

```bash
bash scripts/inventory.sh <repo-path>
```

If no path is given, use the current working directory.

## Workflow

1. **Cheap inventory first**
   - List top-level files and directories
   - Exclude noisy folders unless explicitly relevant: `.git`, `node_modules`, `dist`, `build`, `.venv`, `target`, `.next`, `.cache`
   - Use the inventory script or `find`/`rg`

2. **Read the human docs before source code**
   Prioritize:
   - `README.md`
   - `QUICK_START.md`
   - `CLAUDE.md`, `AGENTS.md`
   - `docs/README.md` or equivalent top-level docs index

3. **Read key config files**
   Look for stack and entrypoint clues in:
   - `package.json`, `tsconfig.json`, `vite.config.*`, `next.config.*`
   - `pyproject.toml`, `requirements.txt`, `uv.lock`
   - `Cargo.toml`
   - `go.mod`
   - `Dockerfile`, `docker-compose*.yml`, CI files

4. **Locate entrypoints and core modules**
   Find likely startup paths such as:
   - `main.*`, `app.*`, `server.*`, `index.*`
   - CLI entrypoints
   - web UI boot files
   - training / benchmark / worker scripts

5. **Read only the code that explains the architecture**
   Prefer:
   - routing / app bootstrap
   - orchestrators / service containers
   - domain models and configs
   - interfaces between major modules

6. **Summarize with file paths**
   Every major claim should name the supporting file path.

## Required output structure

Use this structure unless the user asked for something else:

### What this project is
- 2-5 bullets

### Stack
- Languages
- Frameworks/libraries
- Storage/runtime/infra

### Top-level layout
- concise tree or directory bullets

### Main components
- what each major module does

### Entrypoints / how it runs
- exact commands or scripts if discoverable

### Important configs and data flow
- where behavior is configured
- how data enters, moves, and leaves the system

### Key findings / risks / open questions
- unknowns, missing docs, unusual coupling, generated code, etc.

## Focus modes

If the user asks for a narrower recon, bias toward one of these:
- **training-focus** → use `ml-training-repo-audit`
- **benchmark-focus** → use `benchmark-autoresearch-loop`
- **agent internals / teaching** → use `agent-architecture-explainer`

See [the checklist](references/checklist.md).
