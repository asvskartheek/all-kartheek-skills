---
name: gguf-mlx-conversion-research
description: Research and map viable conversion paths between Hugging Face checkpoints, LoRA outputs, GGUF artifacts, and MLX-compatible model formats for Apple Silicon workflows. Use when asked to adapt finetune outputs for MLX, LM Studio, or Hugging Face release pipelines.
---

# GGUF / MLX Conversion Research

Use this when a user wants a reliable conversion path, not hand-wavy format guesses.

## Workflow

1. Identify the starting artifact exactly:
   - base HF model
   - LoRA adapter
   - merged weights
   - GGUF
   - quantized output
2. Identify the desired target exactly:
   - MLX model dir
   - HF uploadable weights
   - GGUF variant
   - merged + quantized deliverables
3. Verify whether the path is actually supported.
4. Produce the safest conversion pipeline, including any unavoidable intermediate formats.

## Output

- source format
- target format
- supported / unsupported path
- required intermediate steps
- expected limitations (quantization loss, tokenizer mismatch, unsupported ops)

## Rule

Never imply direct format compatibility without evidence; state the required intermediate representation explicitly.
