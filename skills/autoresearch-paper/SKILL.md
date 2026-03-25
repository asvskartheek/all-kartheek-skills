---
name: autoresearch-paper
description: Turn an autoresearch run into a professional LaTeX research paper with experiment narrative, ablation tables, and PDF render steps. Use when the user wants a paper-grade writeup from benchmark artifacts and experiment logs.
---

# Autoresearch Paper

Use this skill when the user wants a polished research-paper style writeup from completed optimization or training experiments.

## Inputs to inspect

Prefer reading these when present:
- `autoresearch.md`
- `autoresearch.jsonl`
- `autoresearch.ideas.md`
- benchmark wrappers like `autoresearch.sh`
- plots, eval CSVs, metrics JSON, W&B exports, and benchmark logs
- training/eval scripts that define the real workload

## Goal

Produce a **credible paper**, not marketing copy.

That means:
- clear problem statement,
- reproducible experiment setup,
- honest ablation coverage,
- measured claims only,
- explicit limitations,
- and a renderable LaTeX source tree.

## Workflow

1. Read the experiment artifacts completely enough to reconstruct:
   - objective,
   - baseline,
   - metric definitions,
   - sequence of changes,
   - strongest wins and strongest failures.
2. Build an experiment ledger.
   - Baseline
   - Each kept/discarded change
   - Best metric reached
   - Important regressions or dead ends
3. Infer the real story of the work.
   - What bottleneck mattered?
   - Which design choice had the largest effect?
   - Which tweaks were merely local refinements?
4. Draft a paper structure.
   - Title
   - Abstract
   - Introduction
   - Related/adjacent work if useful
   - Method
   - Experimental setup
   - Results
   - Ablations
   - Discussion / why it worked
   - Limitations
   - Conclusion
5. Create tables directly from measured data.
   - Do not invent numbers.
   - If a section lacks evidence, say so.
6. Write LaTeX source.
   - Keep it self-contained and renderable.
   - Prefer standard packages and simple macros.
7. Render to PDF.
   - Prefer `tectonic` if available.
   - Fallback to `pdflatex`.
8. Return the output paths and any render warnings.

## Strong defaults for the paper

- Include a compact experiment timeline table.
- Include a main results table with baseline vs best.
- Include an ablations table for nearby variants.
- Include a short “Why this worked” section grounded in evidence.
- Include a “Threats to validity” or limitations section.

## Recommended directory layout

```text
paper/
├── main.tex
├── sections/
│   ├── abstract.tex
│   ├── intro.tex
│   ├── method.tex
│   ├── setup.tex
│   ├── results.tex
│   ├── ablations.tex
│   ├── discussion.tex
│   └── limitations.tex
└── figures/
```

## Rendering commands

```bash
tectonic paper/main.tex
```

Fallback:

```bash
cd paper && pdflatex main.tex && pdflatex main.tex
```

## Rules

- Never fabricate citations, plots, or results.
- Distinguish observed evidence from interpretation.
- If the work is engineering-heavy rather than novel research, say so while still producing a paper-grade report.
- When tables are derived from logs, mention the source file path.
- If PDF rendering fails, still leave the LaTeX tree in a clean state and report the exact command/output.

## Deliverables

Return:
- a short summary of the paper’s main claim,
- the LaTeX source path,
- the PDF path if rendering succeeded,
- and any missing evidence that would improve the paper.
