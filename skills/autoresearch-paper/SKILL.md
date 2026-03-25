---
name: autoresearch-paper
description: Turn a completed autoresearch run into a professional LaTeX research paper with a credible breakthrough narrative, ablation tables, experiment appendix, and rendered PDF. Use when the user wants a paper-grade writeup from benchmark artifacts, run ledgers, W&B exports, or optimization logs.
---

# Autoresearch Paper

Use this skill when the user says things like:
- turn this autoresearch into a paper
- write a research paper from these experiments
- make this ICLR / NeurIPS / arXiv style
- produce a LaTeX paper from the benchmark loop
- document the ablations and why the method worked
- render the paper to PDF

## Goal

Produce a **credible paper-grade artifact** from a completed experiment history.

The paper should read like a serious research report, not marketing copy and not a changelog dump.

It must:
- reconstruct the optimization story from evidence,
- separate major breakthroughs from tiny local refinements,
- include positive and negative results,
- explain why the best method likely worked,
- state limitations honestly,
- produce clean LaTeX,
- and render to PDF if the environment allows.

## Best-fit inputs to inspect

Read these when present:
- `autoresearch.md`
- `autoresearch.jsonl`
- `autoresearch.ideas.md`
- benchmark wrappers like `autoresearch.sh`
- workload scripts like `train_modal.py`, `bench.py`, `eval.py`, `export_*.sh`
- experiment dashboards / W&B exports / CSV metrics / plots
- README or model cards that document the final exported artifact
- any paper, plan, or notes the user already wrote

When the work is ML or benchmark-heavy, also inspect:
- dataset names and split details
- model names / adapter configs / tokenizer choices
- hardware and runtime environment
- exact primary metric definition

## Non-negotiable rules

- Never invent results, citations, or plots.
- Never claim novelty that is not supported by the evidence.
- Distinguish **measured facts** from **interpretation**.
- Keep the paper honest if this is really an engineering optimization report rather than a new algorithm.
- Use the real benchmark path, not notebook-only artifacts, unless the notebook was the benchmark.
- Include negative results and failed branches when they are important to understanding the win.
- If the evidence is thin, say so directly.

## Core workflow

### Phase 1: Reconstruct the experiment ledger

1. Read the experiment context and metric definition.
   - What was optimized?
   - What counts as baseline?
   - What files define the real workload?
2. Read the run ledger closely enough to extract:
   - baseline run,
   - all kept improvements,
   - all important discarded regressions,
   - crash / infra runs that changed the harness,
   - best final result,
   - repeat / confirmation runs.
3. Build a compact narrative table:
   - run id
   - change tested
   - metric result
   - keep/discard/crash
   - takeaway

### Phase 2: Infer the actual story

Do **not** just list runs in chronological order.
Infer the real structure:
- What was the first trustworthy baseline?
- What change caused the largest jump?
- What changes were merely local schedule tuning after the main breakthrough?
- Which conclusions changed after the regime changed?
- Which dead ends rule out easy alternative explanations?

The final paper should make the causal structure obvious.

A good framing usually looks like:
1. baseline,
2. harness stabilization,
3. dominant structural breakthrough,
4. secondary structural improvement,
5. local tuning around the improved regime,
6. limitations / unfinished ideas.

### Phase 3: Write the paper outline before drafting prose

At minimum include:
- Title
- Abstract
- Introduction
- Problem setting / benchmark setup
- Method or optimization narrative
- Experimental setup
- Results
- Ablation studies
- Why the method worked
- Limitations / threats to validity
- Conclusion
- Appendix with experiment ledger

Optional when useful:
- Related work / adjacent work
- Export / deployment artifact summary
- Reproducibility checklist

### Phase 4: Generate measured tables and assets programmatically

When the ledger is large, generate tables from code instead of hand-copying.

Strong defaults:
- `paper/generate_paper_assets.py`
- `paper/generated/summary_numbers.tex`
- `paper/generated/key_results_table.tex`
- `paper/generated/negative_results_table.tex`
- `paper/generated/all_runs_longtable.tex`

Use generated assets for:
- baseline vs best metric numbers
- accepted improvement path
- negative-results summary
- full appendix run ledger
- any coordinates for simple plots

If a metric comes from the ledger, source it directly from the ledger file.

### Phase 5: Draft paper-grade prose

Use these writing standards:
- sound like a careful research engineer,
- avoid hype words unless the measured effect is truly large,
- make each section answer a distinct question,
- prefer explicit numbers over adjectives,
- explain *why* the best change likely mattered.

The most important section after Results is usually:

## Why the Method Worked

This section should connect the strongest improvements back to the workload semantics.
Examples:
- preserving conversational boundaries,
- removing truncation,
- changing optimization dynamics after fixing data fidelity,
- reducing benchmark contamination,
- restoring a more faithful training target.

### Phase 6: Render robustly

Preferred rendering order:

```bash
cd paper && tectonic paper.tex
```

Fallbacks:

```bash
cd paper && tectonic -k --keep-logs -p paper.tex
cd paper && pdflatex paper.tex && pdflatex paper.tex
cd paper && xelatex paper.tex && xelatex paper.tex
```

If rendering hangs or becomes fragile:
- simplify the layout,
- prefer standard packages,
- remove expensive plotting packages if not necessary,
- switch from two-column to single-column if that unblocks a professional result,
- keep the PDF deliverable moving.

A clean rendered PDF beats a fancy template that fails to compile.

## Recommended directory layout

For short one-file papers:

```text
paper/
├── paper.tex
├── paper.pdf
├── generate_paper_assets.py
└── generated/
    ├── summary_numbers.tex
    ├── key_results_table.tex
    ├── negative_results_table.tex
    └── all_runs_longtable.tex
```

For larger papers:

```text
paper/
├── main.tex
├── sections/
│   ├── abstract.tex
│   ├── intro.tex
│   ├── setup.tex
│   ├── results.tex
│   ├── ablations.tex
│   ├── discussion.tex
│   └── limitations.tex
├── figures/
├── generated/
└── scripts/
```

## Strong paper defaults

Unless the user asks otherwise, include all of these:

### 1. Main claim paragraph
State in one paragraph:
- baseline metric,
- best metric,
- relative improvement,
- dominant breakthrough,
- what changed after that breakthrough.

### 2. Accepted-path table
Show the exact sequence of kept changes from baseline to best.

### 3. Negative-results table
Include nearby variants that lost. This is essential to show that the win was specific, not a random drift.

### 4. Honest limitations section
Mention things like:
- single validation split,
- lack of human eval,
- tiny dataset variance,
- no multi-seed study,
- incomplete follow-up branches,
- benchmark-specific tuning.

### 5. Full appendix ledger
If the run count is manageable, include all runs in an appendix longtable.

## What to emphasize in the narrative

When reading an autoresearch log, usually classify changes into these buckets:
- harness / infra stabilization
- data-shape or training-semantics fixes
- architecture or capacity changes
- optimizer and scheduler refinements
- checkpoint / eval cadence changes
- export / deployment confirmation

Usually the paper should emphasize the earliest bucket that caused the biggest durable gain.
That is often the real breakthrough.

## Claims checklist before finalizing

Before calling the paper done, verify:
- baseline metric is explicitly identified,
- best metric is explicitly identified,
- relative improvement is computed correctly,
- biggest win is called out separately from later refinements,
- no discarded run is accidentally described as a success,
- repeat / confirmation runs are used as confidence evidence when available,
- export artifact metrics are labeled as export results, not benchmark-best results,
- the PDF path exists.

## Render troubleshooting checklist

If compile fails:
1. keep logs,
2. inspect the exact failing package or file,
3. remove the least important complexity first,
4. prefer simple tables over advanced figures,
5. prefer single-column over two-column if necessary,
6. preserve source files in a clean state even if PDF rendering is not yet done.

## Final deliverables

Return:
- a 2-4 sentence summary of the paper's main claim,
- LaTeX source path,
- generated-asset path(s),
- PDF path if rendering succeeded,
- remaining evidence gaps that would most improve the paper.

## Anti-patterns to avoid

- dumping the JSONL ledger into prose with no synthesis
- calling every tiny gain a breakthrough
- hiding negative runs
- pretending an engineering optimization is a novel algorithmic contribution
- using hand-copied numbers when a script could derive them
- over-investing in aesthetics before the PDF compiles
- treating export-time metrics as equal to benchmark-best metrics without labeling them

## Example trigger outcome

A strong outcome should leave the repo with something like:
- `paper/paper.tex`
- `paper/paper.pdf`
- generated tables sourced from `autoresearch.jsonl`
- a paper that explains not just *what won*, but *why it won*
