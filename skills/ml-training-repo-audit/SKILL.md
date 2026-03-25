---
name: ml-training-repo-audit
description: Audit ML or LLM training repositories to extract datasets, model configs, training scripts, hyperparameters, checkpoints, experiment dashboards, and run commands. Use when asked to inspect training code, W&B/MLflow usage, MLX/PyTorch scripts, or summarize model sizes and training setup.
---

# ML Training Repo Audit

Use this skill when the user wants a training-focused audit rather than a general repo summary.

## Fast start

Run:

```bash
bash scripts/find-training-files.sh <repo-path>
```

Then read the most relevant files it finds.

## What to inspect

### Documentation
- `README.md`
- any docs mentioning training, finetuning, eval, sweeps, checkpoints, or dashboards
- `CLAUDE.md` / `AGENTS.md` for local rules

### Likely training files
- `train.py`, `trainer.py`, `finetune.py`, `benchmark.py`, `eval.py`
- config files (`configs.py`, YAML, TOML, JSON)
- model definitions (`model.py`, module files, architecture configs)
- data loaders / tokenizers / dataset prep
- experiment launcher scripts (Modal, Slurm, shell scripts)

### Experiment tracking
Extract exact references to:
- W&B entity/project
- MLflow experiments
- TensorBoard, Phoenix, or custom dashboards
- checkpoint naming / artifact upload

## Output checklist

Report these sections whenever available:

### Training commands
- exact commands to run training/eval

### Dataset and preprocessing
- source datasets
- tokenization / chunking
- train/eval split behavior

### Model sizes / configs
- each named model size
- layer counts, hidden sizes, heads, FFN sizes, vocab, context length

### Hyperparameters
- batch size
- steps / epochs
- LR schedule
- warmup
- weight decay
- grad clip
- eval cadence
- checkpoint cadence

### Experiment tracking
- W&B entity/project or equivalent
- logged metrics and logging frequency

### Architecture summary
- what model classes exist
- what runtime/framework they use (MLX, PyTorch, JAX, Rust bridge, etc.)

### Training risks or caveats
- missing resume logic
- hardcoded paths
- unclear seed handling
- expensive defaults
- mismatched config comments vs actual code

## Guidance

- Prefer tables when summarizing model sizes and hyperparameters.
- Quote exact file paths for anything operational.
- Be explicit about what is inferred vs explicitly configured.
- If there is both inference and training code, keep them separate.

See [the training checklist](references/checklist.md).
