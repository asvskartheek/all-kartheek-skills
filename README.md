# all-kartheek-skills

A public Pi package of reusable skills extracted from recurring real-world workflows.

It packages focused, task-specific skills for:
- repository analysis
- architecture and planning
- ML/training repo audits
- benchmark/reproduction work
- Phoenix/OpenTelemetry debugging
- Pi/package/bootstrap workflows
- structured product and ops tasks

## Install

### From GitHub

```bash
pi install git:github.com/asvskartheek/all-kartheek-skills
```

You can also use the raw HTTPS repo URL:

```bash
pi install https://github.com/asvskartheek/all-kartheek-skills
```

### From a local checkout

```bash
pi install /absolute/path/to/all_kartheek_skills
```

### Project-local install

By default, `pi install` writes to your global Pi settings. Use `-l` to install into the current project instead:

```bash
pi install -l git:github.com/asvskartheek/all-kartheek-skills
```

After installing, run `/reload` in Pi or restart the session if the new skills do not appear immediately.

## Package contents

This package currently exposes these skills from `./skills`:

### Repo and architecture

| Skill | What it does |
|---|---|
| `repo-inventory` | Produce a clean inventory of a local repository: top-level tree, key docs, config files, likely entrypoints, and notable generated/vendor folders. Use when asked to list files, map a repo quickly, or create a lightweight project inventory before deeper analysis. |
| `repo-deep-dive` | Systematically explore a local code repository and produce a clear summary of what it does, its folder layout, stack, key modules, entrypoints, configs, and run paths. Use when asked to understand a repo, audit architecture, inventory structure, or answer “what is this project?”. |
| `solution-architecture-brief` | Turn requirements, markdown notes, RFPs, or problem statements into a concise system architecture brief covering components, deployment shape, integrations, data flow, and risks. Use when asked to design an architecture, blueprint a solution, or summarize architecture from scattered docs. |
| `plan-driven-build` | Read a `plan.md` or equivalent implementation plan, turn it into execution checkpoints, and build from the plan without losing traceability. Use when a project already has a plan file and the task is to implement it systematically. |
| `agent-architecture-explainer` | Explain agent systems, tool-calling loops, and codebase architecture in a beginner-friendly way, optionally with Mermaid or Excalidraw-ready structure. Use when asked to explain how an agent works, teach a friend, or create architecture diagrams from code. |

### ML, training, and benchmarking

| Skill | What it does |
|---|---|
| `training-config-extract` | Extract model-size definitions, hyperparameters, datasets, schedules, and checkpoint/logging cadence from training code and config files. Use when you need a precise table of training settings without doing a full repo audit. |
| `ml-training-repo-audit` | Audit ML or LLM training repositories to extract datasets, model configs, training scripts, hyperparameters, checkpoints, experiment dashboards, and run commands. Use when asked to inspect training code, W&B/MLflow usage, MLX/PyTorch scripts, or summarize model sizes and training setup. |
| `wandb-run-review` | Review Weights & Biases usage in a project, identify entity/project names, compare runs, and judge which run performed best based on the requested metric. Use when asked to inspect W&B runs, summarize training dashboards, or compare experiments. |
| `modal-training-scaffold` | Adapt local training or evaluation code to run on Modal serverless GPUs while preserving local CLI ergonomics. Use when asked to create or retrofit `train_modal.py`, move notebook/code to Modal, or run ML experiments on remote GPUs. |
| `gguf-mlx-conversion-research` | Research and map viable conversion paths between Hugging Face checkpoints, LoRA outputs, GGUF artifacts, and MLX-compatible model formats for Apple Silicon workflows. Use when asked to adapt finetune outputs for MLX, LM Studio, or Hugging Face release pipelines. |
| `benchmark-autoresearch-loop` | Run disciplined benchmark-driven optimization loops against a fixed harness, keeping only changes that improve the target metric. Use when asked to optimize in a loop, kick off experiments, autoresearch a project, or repeatedly test hypotheses against a benchmark spec. |
| `benchmark-repro-check` | Judge whether a claimed result was actually reproduced by comparing the target benchmark/plan/paper against the measured outputs, plots, logs, and metrics. Use when asked “did we recreate the results?” or to validate benchmark fidelity. |

### Pi, agents, and workflow support

| Skill | What it does |
|---|---|
| `local-tool-calling-demo` | Build a small educational demo of manual tool-calling using a local OpenAI-compatible endpoint or LM Studio, showing the raw system prompt, tool schema, tool-call parse step, tool execution, and final answer loop. Use when teaching how agents fundamentally work. |
| `pi-multi-agent-demo` | Scaffold a small multi-agent demo using Pi packages such as `@mariozechner/pi-agent-core` and `@mariozechner/pi-web-ui`, optionally with Phoenix tracing. Use when building a concierge/router agent with specialist sub-agents and a simple UI. |
| `pi-package-bootstrap` | Install and verify Pi packages, skills, extensions, prompts, or themes from local paths, git repositories, or npm. Use when asked to set up Pi tooling from a repo, install shared skills globally, or wire custom resources into Pi. |
| `next-session-handoff` | Turn the current task state into a copy-paste-ready baton-pass prompt for a fresh Pi session. Use when the user wants to continue later, hand work to another agent/session, or preserve momentum without re-explaining everything. |

### Observability and Phoenix

| Skill | What it does |
|---|---|
| `phoenix-tracing-debug` | Add, validate, or debug Arize Phoenix and OpenTelemetry tracing for agent apps, web apps, or local demos. Use when traces are missing, collector endpoints are wrong, Phoenix returns errors, or you need verified observability instead of assumed tracing. |
| `phoenix-ingestion-smoke-test` | Prove that a Phoenix instance is actually ingesting fresh traces by triggering a minimal trace, following it through the transport path, and confirming it appears in the UI/logs/storage. Use when “Phoenix is running” but you need evidence that traces are flowing. |
| `otlp-protocol-mismatch-debug` | Diagnose and fix OpenTelemetry export failures caused by protocol, content-type, or endpoint mismatches between exporters and collectors (HTTP JSON, HTTP protobuf, gRPC). Use when traces are sent but rejected, Phoenix returns 415 errors, or HTTP/gRPC expectations are confused. |

### App and operations workflows

| Skill | What it does |
|---|---|
| `active-state-persistence` | Retrofit persistence for active application state so restarts resume from warm state instead of cold-loading everything again. Use when an app loses useful in-memory state on restart and should recover cached data, last known results, or active session state safely. |
| `served-dashboard-upgrade` | Replace a plain static admin/dashboard page with a served dynamic page that is rendered or hydrated by an actual app/server route. Use when a dashboard should be data-driven, live, or integrated with backend state instead of being just a static file. |
| `batch-csv-brief` | Read many CSV files in a folder and produce concise per-file briefs with the key facts requested by the user. Use when summarizing interview sheets, tabular intake forms, batch exports, or datasets that need one-summary-per-file. |
| `supply-chain-incident-brief` | Analyze a software supply-chain incident (compromised package, malicious release, dependency exfiltration) and produce a crisp summary, remediation checklist, and optional public-facing comms. Use when a dependency compromise breaks and you need fast factual triage. |

## Why these skills exist

These skills were distilled from recurring patterns found in local Claude and Pi session history, then split into smaller reusable workflows instead of one-off prompts.

## Repo structure

```text
skills/
  <skill-name>/SKILL.md
README.md
SESSION_MINING_REPORT.md
package.json
```

`package.json` declares this as a Pi package and exposes `./skills` through the `pi.skills` manifest.

## Notes

- This repo is intended for Pi package installation via git or local path.
- It is not currently published to npm.
- See `SESSION_MINING_REPORT.md` for the session-mining background that produced these skills.
