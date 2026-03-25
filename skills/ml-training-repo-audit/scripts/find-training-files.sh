#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"

find "$ROOT" -type f \( \
  -iname 'README.md' -o \
  -iname 'CLAUDE.md' -o \
  -iname 'AGENTS.md' -o \
  -iname 'train.py' -o \
  -iname 'trainer.py' -o \
  -iname 'finetune.py' -o \
  -iname 'eval.py' -o \
  -iname 'benchmark.py' -o \
  -iname 'model.py' -o \
  -iname 'configs.py' -o \
  -iname '*.yaml' -o \
  -iname '*.yml' -o \
  -iname '*.toml' -o \
  -iname '*.json' \
\) | rg -v '/(node_modules|\.git|dist|build|target|\.venv|wandb|checkpoints)/' | sort

echo
printf '== tracking references ==\n'
rg -n "wandb|mlflow|tensorboard|phoenix|openinference|otel|opentelemetry" "$ROOT" -g '!node_modules' -g '!dist' -g '!build' -g '!target' -g '!.venv' || true
