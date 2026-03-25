---
name: benchmark-autoresearch-loop
description: Run disciplined benchmark-driven optimization loops against a fixed harness, keeping only changes that improve the target metric. Use when asked to optimize in a loop, kick off experiments, autoresearch a project, or repeatedly test hypotheses against a benchmark spec.
---

# Benchmark Autoresearch Loop

Use this skill for iterative optimization with a clear benchmark or evaluation harness.

## First read the rules

Before editing anything, identify:
- editable files
- forbidden files
- benchmark command
- primary metric and direction (`lower` or `higher` is better)
- keep/discard rule
- any logging/result files already used by the repo

Common spec files to read first:
- `program.md`
- `benchmark.md`
- `README.md`
- `eval.py`
- `bench/*`
- project `CLAUDE.md` / `AGENTS.md`

## Preferred execution mode in Pi

If Pi experiment tools are available, prefer them:
1. `init_experiment` once per optimization target (unless already initialized for the same target)
2. `run_experiment` for the benchmark command
3. `log_experiment` after every run

If those tools are not available, fall back to a normal git + benchmark loop.

## Loop discipline

1. Establish a baseline
2. Change **one idea at a time**
3. Run the benchmark
4. Keep only real improvements in the **primary** metric
5. Revert or discard regressions
6. Record what you learned
7. Repeat

## Strong rules

- Do not mix multiple hypotheses in one experiment unless they are inseparable.
- Do not change the benchmark harness unless the user explicitly asks.
- Prefer small, attributable edits over heroic rewrites.
- If noise is high, rerun the same experiment before deciding.
- If you find promising but untried ideas, preserve them in notes instead of losing them.

## Recommended output per iteration

- hypothesis
- code change summary
- benchmark command
- result vs baseline / current best
- keep or discard decision
- next idea

## Final summary format

When pausing or handing off, include:
- best metric and commit/state
- experiments tried
- regressions rejected
- unresolved ideas
- exact benchmark command and workload

See [the loop checklist](references/checklist.md).
