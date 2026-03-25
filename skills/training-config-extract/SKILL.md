---
name: training-config-extract
description: Extract model-size definitions, hyperparameters, datasets, schedules, and checkpoint/logging cadence from training code and config files. Use when you need a precise table of training settings without doing a full repo audit.
---

# Training Config Extract

Use this for a surgical extraction of training settings.

## Read these first

- `train.py`, `trainer.py`, `finetune.py`
- config modules (`configs.py`, YAML/TOML/JSON)
- model config definitions
- README sections describing model sizes or runs

## Deliverables

### Model sizes table
- layers
- hidden/model dim
- heads
- FFN dim
- vocab
- context length
- parameter count if available

### Training hyperparameters
- batch size
- max steps/epochs
- LR max/min
- warmup
- weight decay
- grad clip
- eval interval
- checkpoint interval

### Dataset / tokenizer notes
- source dataset
- split/preprocessing behavior

## Rules

- Separate explicit values from inferred values.
- Name the exact file path for each table source.
