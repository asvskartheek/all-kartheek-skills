---
name: benchmark-repro-check
description: Judge whether a claimed result was actually reproduced by comparing the target benchmark/plan/paper against the measured outputs, plots, logs, and metrics. Use when asked “did we recreate the results?” or to validate benchmark fidelity.
---

# Benchmark Reproduction Check

Use this after evaluation has already been run.

## Compare

- target claim / plan / paper
- exact workload and settings used
- measured outputs (logs, tables, screenshots, plots)
- final metric values and tolerances

## Output

### Target result
### What was actually run
### Metric-by-metric comparison
### Reproduced / partially reproduced / not reproduced
### Why
### Next fixes to close the gap

## Rule

Be strict about mismatches in workload, hardware, dataset, seed, or evaluation settings.
