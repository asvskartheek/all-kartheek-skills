---
name: create-new-ft-experiment
description: Compares previous W&B fine-tuning runs and proposes one focused next experiment with code snippets. Use when the user says "suggest next experiment", "what should I try next", "create new ft experiment", or after finishing a fine-tuning run and wanting to iterate. Invokes /wandb-compare-runs first, then reasons about the bottleneck and suggests ONE change.
---

# Create New Fine-Tuning Experiment

## Workflow

### Step 1: Compare existing runs
Run `/wandb-compare-runs` first. It will fetch the full eval/loss history for all runs and produce a comparison table with min/final/gap/verdict.

If the W&B entity or project is unknown, ask the user before proceeding.

### Step 2: Identify the bottleneck

Read the comparison table and classify the situation:

| Pattern | Bottleneck | Direction |
|---|---|---|
| Gap > 1.0 (severe overfit) | LR too high / no regularization | Lower LR, add cosine schedule, add early stopping |
| Gap 0.05–0.3 (mild overfit) | Mild regularization needed | Add `weight_decay`, increase `lora_dropout` |
| Gap < 0.05 but min val_loss plateau across runs | Data ceiling | System prompt, different data split, augmentation |
| min val_loss improving run-over-run | Still converging | Continue current direction, minor tuning |
| All runs stop at same step, same min | Hyperparams exhausted | Change data or model architecture (rank, target modules) |

### Step 3: Propose ONE experiment

Rules:
- Suggest **exactly one** focused change — not a bundle
- Show **only the lines that change** in the config, not the full SFTConfig
- Explain the **why** in 2–3 sentences referencing the actual numbers from the comparison table
- Give the new `run_name` string

### Step 4: Output format

````
## Run Comparison
[paste table from /wandb-compare-runs]

## Bottleneck Analysis
[1–2 sentences: what the numbers reveal]

## Next Experiment: `exp-N-<short-name>`

**Why:** [reason tied to the actual gap/min numbers]

**Change:**
```python
# Only the lines that differ from the last experiment
run_name = 'exp-N-<short-name>'
<param> = <new_value>   # was <old_value>
```
````

## Decision Guide for Common Situations

**Severe overfit (gap > 1.0)**
```python
learning_rate = 1e-4          # was 3e-4
lr_scheduler_type = "cosine"  # was "linear"
warmup_ratio = 0.05
load_best_model_at_end = True
metric_for_best_model = "eval_loss"
greater_is_better = False
save_strategy = "steps"
save_steps = 10  # match eval_steps
# + EarlyStoppingCallback(early_stopping_patience=3)
```

**Stable but plateau (gap < 0.05, min not improving)**
Try in this order across separate experiments:
1. System prompt — leverage the base model's instruction-following
2. Increase LoRA rank (`r=16`) — more capacity
3. Add more target modules (e.g. include MLP layers if only attention was targeted)
4. Data quality / augmentation

**System prompt addition (when model is instruction-tuned like Phi-3, Llama-3-Instruct)**
```python
# In format_dataset(), prepend a system message:
{"role": "system", "content": "<task description>"}
```
This is free — no hyperparameter change, just data formatting.

## Notes
- Always confirm the W&B entity/project with the user if not in memory
- Never suggest changing both LR and dropout in the same experiment — changes must be isolated to be interpretable
- `eval_loss` is the correct `metric_for_best_model` key for HuggingFace Trainer (wandb displays it as `eval/loss` but the Trainer key is `eval_loss`)
