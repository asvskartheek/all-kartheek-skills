---
name: modal-training-scaffold
description: Adapt local training or evaluation code to run on Modal serverless GPUs while preserving local CLI ergonomics. Use when asked to create or retrofit `train_modal.py`, move notebook/code to Modal, or run ML experiments on remote GPUs.
---

# Modal Training Scaffold

Use this skill for turning local ML code into a Modal job.

## Workflow

1. Read the local training/eval entrypoint and dependencies.
2. Identify dataset inputs, artifact outputs, env vars, and GPU requirements.
3. Preserve the existing CLI where possible.
4. Create a Modal entrypoint that wraps the local logic instead of rewriting everything.
5. Make outputs explicit: checkpoints, merged models, logs, uploaded artifacts.

## Checklist

- image/dependencies
- GPU type and concurrency
- volumes or data mounts
- secrets/env vars
- output artifact paths
- local invocation parity
- short smoke test command

## Rule

Keep the Modal wrapper thin and let the existing training logic stay the source of truth.
