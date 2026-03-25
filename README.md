# all-kartheek-skills
A public Pi package that now bundles the minimum set of skills you called out from `~/.claude/skills`, `~/.pi/agent/git/.../agent-stuff`, and `~/.pi/agent/git/.../pi-autoresearch`, plus the previously mined custom skills already in this repo.
## What is in this repo now
- **54 packaged skills total**
- Includes `autoresearch-paper`, a reusable workflow for turning benchmark/autoresearch runs into professional LaTeX papers with measured tables, ablation narrative, appendix ledgers, and PDF rendering.
- **27 mined custom Pi skills** from this repo
- **3 packaged Pi extensions** in `extensions/`
- **7 imported personal Claude skills** from `~/.claude/skills`
- **19 mirrored upstream skills** from `mitsuhiko/agent-stuff`
- **1 mirrored upstream skill** from `davebcn87/pi-autoresearch`

At a minimum, this repo now contains the exact Pi skills you listed: `autoresearch-create`, `anachb`, `apple-mail`, `commit`, `frontend-design`, `ghidra`, `github`, `google-workspace`, `librarian`, `mermaid`, `native-web-search`, `oebb-scotty`, `openscad`, `pi-share`, `sentry`, `summarize`, `tmux`, `update-changelog`, `uv`, and `web-browser`.
## Install
### This package
```bash
pi install git:github.com/asvskartheek/all-kartheek-skills
```
Or with HTTPS:
```bash
pi install https://github.com/asvskartheek/all-kartheek-skills
```
For project-local install:
```bash
pi install -l git:github.com/asvskartheek/all-kartheek-skills
```
### Related extension/packages from this machine
These are not all vendored as live Pi extensions in this repo yet, but they are part of the environment this repo was built from:
```bash
pi install npm:@plannotator/pi-extension
pi install https://github.com/mitsuhiko/agent-stuff
pi install https://github.com/davebcn87/pi-autoresearch
```
After installing, run `/reload` in Pi or restart the session if the new resources do not appear immediately.
## Source breakdown
- `skills/` now contains local mined skills, your older Claude skills, and mirrored upstream Pi skills.
- `SOURCES.md` documents where the imported skills came from and which external packages/extensions were discovered on this machine.
## Skills catalog
| Skill | What it does |
|---|---|
| `active-state-persistence` | Retrofit persistence for active application state so restarts resume from warm state instead of cold-loading everything again. Use when an app loses useful in-memory state on restart and should recover cached data, last known results, or active session state safely. |
| `adapt-ft-modal-code-to-new-model` | Adapts an existing Modal fine-tuning script (train_modal.py) to a new HuggingFace model. Use when the user says "adapt train_modal.py to", "switch the model to", "fine-tune a different model on Modal", or "port the training script to a new model". Follows a strict 4-phase workflow: research → tokenizer inspection with human confirmation → dependency verification via uv pip compile → code edits. Never edits code before human confirms tokenizer/chat-template output. |
| `agent-architecture-explainer` | Explain agent systems, tool-calling loops, and codebase architecture in a beginner-friendly way, optionally with Mermaid or Excalidraw-ready structure. Use when asked to explain how an agent works, teach a friend, or create architecture diagrams from code. |
| `anachb` | Austrian public transport (VOR AnachB) for all of Austria. Query real-time departures, search stations/stops, plan routes between locations, and check service disruptions. Use when asking about Austrian trains, buses, trams, metro (U-Bahn), or directions involving public transport in Austria. |
| `apple-mail` | Search, read, and extract attachments from Apple Mail's local storage. Query emails by sender, recipient, subject, body, date, mailbox, and flags. Read raw RFC822 messages and extract file attachments. |
| `autoresearch-create` | Set up and run an autonomous experiment loop for any optimization target. Gathers what to optimize, then starts the loop immediately. Use when asked to "run autoresearch", "optimize X in a loop", "set up autoresearch for X", or "start experiments". |
| `autoresearch-paper` | Turn a completed autoresearch run into a professional LaTeX research paper with a credible breakthrough narrative, ablation tables, experiment appendix, and rendered PDF. Use when the user wants a paper-grade writeup from benchmark artifacts, run ledgers, W&B exports, or optimization logs. |
| `basic-openai-agent` | Generates a minimal agent built from scratch using only the openai Python library. Includes the while loop, tool definition, system prompt injection, raw output parsing, and tool dispatcher. Use when the user asks to build a basic agent, write an agent from scratch, demonstrate how agents work, or create a minimal tool-calling loop with openai. |
| `batch-csv-brief` | Read many CSV files in a folder and produce concise per-file briefs with the key facts requested by the user. Use when summarizing interview sheets, tabular intake forms, batch exports, or datasets that need one-summary-per-file. |
| `benchmark-autoresearch-loop` | Run disciplined benchmark-driven optimization loops against a fixed harness, keeping only changes that improve the target metric. Use when asked to optimize in a loop, kick off experiments, autoresearch a project, or repeatedly test hypotheses against a benchmark spec. |
| `benchmark-repro-check` | Judge whether a claimed result was actually reproduced by comparing the target benchmark/plan/paper against the measured outputs, plots, logs, and metrics. Use when asked “did we recreate the results?” or to validate benchmark fidelity. |
| `commit` | Read this skill before making git commits |
| `create-new-ft-experiment` | Compares previous W&B fine-tuning runs and proposes one focused next experiment with code snippets. Use when the user says "suggest next experiment", "what should I try next", "create new ft experiment", or after finishing a fine-tuning run and wanting to iterate. Invokes /wandb-compare-runs first, then reasons about the bottleneck and suggests ONE change. |
| `frontend-design` | Design and implement distinctive, production-ready frontend interfaces with strong aesthetic direction. Use when asked to create or restyle web pages, components, or applications (HTML/CSS/JS, React, Vue, etc.). |
| `gguf-mlx-conversion-research` | Research and map viable conversion paths between Hugging Face checkpoints, LoRA outputs, GGUF artifacts, and MLX-compatible model formats for Apple Silicon workflows. Use when asked to adapt finetune outputs for MLX, LM Studio, or Hugging Face release pipelines. |
| `ghidra` | Reverse engineer binaries using Ghidra's headless analyzer. Decompile executables, extract functions, strings, symbols, and analyze call graphs without GUI. |
| `github` | Interact with GitHub using the `gh` CLI. Use `gh issue`, `gh pr`, `gh run`, and `gh api` for issues, PRs, CI runs, and advanced queries. |
| `google-workspace` | Access Google Workspace APIs (Drive, Docs, Calendar, Gmail, Sheets, Slides, Chat, People) via local helper scripts without MCP. Handles OAuth login and direct API calls. |
| `librarian` | Cache and refresh remote git repositories under ~/.cache/checkouts/<host>/<org>/<repo> so future references can reuse a local copy. Use this skill when the user points you to a remote git repository as reference or you encountered a remote git repo through other means. |
| `local-session-miner` | Mine local Pi and Claude session transcripts to find recurring workflows, cluster repeatable tasks, and propose non-duplicate skills/extensions for this repo. Use when the user asks what capabilities should be packaged from prior sessions. |
| `local-tool-calling-demo` | Build a small educational demo of manual tool-calling using a local OpenAI-compatible endpoint or LM Studio, showing the raw system prompt, tool schema, tool-call parse step, tool execution, and final answer loop. Use when teaching how agents fundamentally work. |
| `mermaid` | Must read guide on creating/editing mermaid charts with valiation tools |
| `ml-training-repo-audit` | Audit ML or LLM training repositories to extract datasets, model configs, training scripts, hyperparameters, checkpoints, experiment dashboards, and run commands. Use when asked to inspect training code, W&B/MLflow usage, MLX/PyTorch scripts, or summarize model sizes and training setup. |
| `modal-training-scaffold` | Adapt local training or evaluation code to run on Modal serverless GPUs while preserving local CLI ergonomics. Use when asked to create or retrofit `train_modal.py`, move notebook/code to Modal, or run ML experiments on remote GPUs. |
| `native-web-search` | Trigger native web search. Use when you need quick internet research with concise summaries and full source URLs. |
| `next-session-handoff` | Turn the current task state into a copy-paste-ready baton-pass prompt for a fresh Pi session. Use when the user wants to continue later, hand work to another agent/session, or preserve momentum without re-explaining everything. |
| `oebb-scotty` | Austrian rail travel planner (ÖBB Scotty). Use when planning train journeys in Austria, checking departures/arrivals at stations, or looking for service disruptions. Covers ÖBB trains, S-Bahn, regional trains, and connections to neighboring countries. |
| `openscad` | Create and render OpenSCAD 3D models. Generate preview images from multiple angles, extract customizable parameters, validate syntax, and export STL files for 3D printing platforms like MakerWorld. |
| `otlp-protocol-mismatch-debug` | Diagnose and fix OpenTelemetry export failures caused by protocol, content-type, or endpoint mismatches between exporters and collectors (HTTP JSON, HTTP protobuf, gRPC). Use when traces are sent but rejected, Phoenix returns 415 errors, or HTTP/gRPC expectations are confused. |
| `phoenix-ingestion-smoke-test` | Prove that a Phoenix instance is actually ingesting fresh traces by triggering a minimal trace, following it through the transport path, and confirming it appears in the UI/logs/storage. Use when “Phoenix is running” but you need evidence that traces are flowing. |
| `phoenix-tracing-debug` | Add, validate, or debug Arize Phoenix and OpenTelemetry tracing for agent apps, web apps, or local demos. Use when traces are missing, collector endpoints are wrong, Phoenix returns errors, or you need verified observability instead of assumed tracing. |
| `pi-multi-agent-demo` | Scaffold a small multi-agent demo using Pi packages such as `@mariozechner/pi-agent-core` and `@mariozechner/pi-web-ui`, optionally with Phoenix tracing. Use when building a concierge/router agent with specialist sub-agents and a simple UI. |
| `pi-minimal-session` | Start or configure a clean-room Pi session with no extensions, skills, prompt templates, themes, or saved session state. Use when the user wants the most minimal Pi possible for debugging, isolation, or reproduction. |
| `pi-package-bootstrap` | Install and verify Pi packages, skills, extensions, prompts, or themes from local paths, git repositories, or npm. Use when asked to set up Pi tooling from a repo, install shared skills globally, or wire custom resources into Pi. |
| `pi-project-cleanup` | Clean up noisy project-local Pi state such as .pi/settings.json, temporary boards, stale todos, handoffs, and local extensions when they are cluttering a repo. Use when the user asks to clean Pi context or reset repo-local Pi behavior. |
| `pi-share` | Load and parse session transcripts from shittycodingagent.ai/buildwithpi.ai/buildwithpi.com/pi.dev (pi-share) URLs. Fetches gists, decodes embedded session data, and extracts conversation history. |
| `plan-driven-build` | Read a `plan.md` or equivalent implementation plan, turn it into execution checkpoints, and build from the plan without losing traceability. Use when a project already has a plan file and the task is to implement it systematically. |
| `push-ft-model-to-hf-gguf` | Merges a PEFT/LoRA fine-tuned model into its base, converts to GGUF, and pushes to HuggingFace. Use when the user says "push to huggingface", "convert to GGUF", "merge lora", "export model", or after finishing a fine-tuning run and wanting to ship the model for local inference. |
| `repo-deep-dive` | Systematically explore a local code repository and produce a clear summary of what it does, its folder layout, stack, key modules, entrypoints, configs, and run paths. Use when asked to understand a repo, audit architecture, inventory structure, or answer “what is this project?”. |
| `repo-inventory` | Produce a clean inventory of a local repository: top-level tree, key docs, config files, likely entrypoints, and notable generated/vendor folders. Use when asked to list files, map a repo quickly, or create a lightweight project inventory before deeper analysis. |
| `repo-publish-readiness` | Make a repository public-ready and shareable with a strong README, install/run instructions, screenshots, packaging notes, and release hygiene. Use when the user wants to push a repo publicly or make it professional-grade for others. |
| `researching-open-ended-problems` | Conducts thorough research on open-ended technical problems before implementation. Use when the user says "research this", "investigate how to", "write a research document", "explore options for", or asks you to study a topic before building it. Gathers sources, clarifies the problem, and produces a structured research.md document. |
| `sentry` | Fetch and analyze Sentry issues, events, transactions, and logs. Helps agents debug errors, find root causes, and understand what happened at specific times. |
| `served-dashboard-upgrade` | Replace a plain static admin/dashboard page with a served dynamic page that is rendered or hydrated by an actual app/server route. Use when a dashboard should be data-driven, live, or integrated with backend state instead of being just a static file. |
| `solution-architecture-brief` | Turn requirements, markdown notes, RFPs, or problem statements into a concise system architecture brief covering components, deployment shape, integrations, data flow, and risks. Use when asked to design an architecture, blueprint a solution, or summarize architecture from scattered docs. |
| `summarize` | Fetch a URL or convert a local file (PDF/DOCX/HTML/etc.) into Markdown using `uvx markitdown`, optionally it can summarize |
| `supply-chain-incident-brief` | Analyze a software supply-chain incident (compromised package, malicious release, dependency exfiltration) and produce a crisp summary, remediation checklist, and optional public-facing comms. Use when a dependency compromise breaks and you need fast factual triage. |
| `tmux` | Remote control tmux sessions for interactive CLIs (python, gdb, etc.) by sending keystrokes and scraping pane output. |
| `training-config-extract` | Extract model-size definitions, hyperparameters, datasets, schedules, and checkpoint/logging cadence from training code and config files. Use when you need a precise table of training settings without doing a full repo audit. |
| `update-changelog` | Read this skill before updating changelogs |
| `uv` | Use `uv` instead of pip/python/venv. Run scripts with `uv run script.py`, add deps with `uv add`, use inline script metadata for standalone scripts. |
| `wandb-compare-runs` | Compares W&B experiment runs by fetching full eval/loss training history and finding the minimum eval/loss each run achieved (not just the final value). Reveals overfitting when a large gap exists between min and final eval/loss. Use when the user says "compare runs", "compare experiments", "which run was better", or asks about W&B experiment results. |
| `wandb-run-review` | Review Weights & Biases usage in a project, identify entity/project names, compare runs, and judge which run performed best based on the requested metric. Use when asked to inspect W&B runs, summarize training dashboards, or compare experiments. |
| `web-browser` | Allows to interact with web pages by performing actions such as clicking buttons, filling out forms, and navigating links. It works by remote controlling Google Chrome or Chromium browsers using the Chrome DevTools Protocol (CDP). When Claude needs to browse the web, it can use this skill to do so. |

## Extensions catalog
| Extension | What it does |
|---|---|
| `feedback-ticket-board` | Scans repo feedback artifacts such as `user_requests.md`, `.pi/todos/`, `.pi/handoffs/`, and `.pi/feedback-ops/`, writes a lightweight ticket board under `.pi/feedback-ops/`, and now supports build/list/close actions so the widget can also be hidden cleanly. |
| `litellm-incident-audit` | Audits nearby repositories for LiteLLM incident exposure, flags direct references to the compromised version, and writes a local remediation report. |
| `skill-or-extension-creator` | Chooses whether a requested capability should be a skill or an extension and can scaffold the starter files. |

## Notes
- `package.json` exposes both `./skills` and `./extensions` as Pi package resource roots.
- See `SESSION_MINING_REPORT.md` for the original mining background.
