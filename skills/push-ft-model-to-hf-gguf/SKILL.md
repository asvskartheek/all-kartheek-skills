---
name: push-ft-model-to-hf-gguf
description: Merges a PEFT/LoRA fine-tuned model into its base, converts to GGUF, and pushes to HuggingFace. Use when the user says "push to huggingface", "convert to GGUF", "merge lora", "export model", or after finishing a fine-tuning run and wanting to ship the model for local inference.
allowed-tools: Read, NotebookEdit, Bash
---

# Push Fine-Tuned Model to HF as GGUF

Generates 4 notebook cells that merge a LoRA adapter, convert to GGUF, and push to HuggingFace.

## Before Writing Any Cells — Ask the User

If not already known from context:
- `BASE_MODEL`: HF repo of base model (e.g. `microsoft/Phi-3-mini-4k-instruct`)
- `OUTPUT_DIR`: local trainer output_dir (e.g. `./phi3-yoda`)
- `MERGED_DIR`: where to save merged model (e.g. `./phi3-speaks-yoda-merged`)
- `GGUF_FILE`: output filename (e.g. `phi3-speaks-yoda.gguf`)
- `HF_ADAPTER_REPO`: HF repo for the LoRA adapter (e.g. `asvskartheek/phi3-yoda-exp4`)
- `HF_GGUF_REPO`: HF repo for the GGUF (e.g. `asvskartheek/phi3-speaks-yoda-gguf`)
- `QUANT_TYPE`: quantization — `q4_0`, `q8_0`, `f16` (default: `q4_0`)

Then insert 4 cells after the last training cell using `NotebookEdit`.

---

## Cell 1 — Fix Push to Hub (replaces trainer.push_to_hub)

> ⚠️ PITFALL: `trainer.push_to_hub()` is NOT PEFT-aware — it skips `adapter_config.json`.
> Always replace it with direct `model.push_to_hub()` + `tokenizer.push_to_hub()`.

```python
model.push_to_hub("{HF_ADAPTER_REPO}")
tokenizer.push_to_hub("{HF_ADAPTER_REPO}")
print(f"Adapter pushed to: https://huggingface.co/{HF_ADAPTER_REPO}")
```

---

## Cell 2 — Merge LoRA into Base + Save

> ⚠️ PITFALL 1: Cannot call `merge_and_unload()` on a 4-bit (BitsAndBytes) in-memory model.
> Fix: reload from LOCAL output_dir with `torch_dtype=torch.float16` — this strips quantization.
>
> ⚠️ PITFALL 2: `tokenizer.save_pretrained()` saves `tokenizer.json` (fast tokenizer) but NOT
> `tokenizer.model` (SentencePiece binary). llama.cpp REQUIRES `tokenizer.model`.
> Fix: use `hf_hub_download` to copy it from HF cache — no sentencepiece install needed.
> DO NOT use `AutoTokenizer.from_pretrained(..., use_fast=False)` — requires sentencepiece
> which may not be installed and will throw ImportError: LlamaTokenizer requires SentencePiece.

```python
from peft import AutoPeftModelForCausalLM
from huggingface_hub import hf_hub_download
import shutil, torch

# Reload from local output_dir in fp16 — bypasses 4-bit quantization
merged_model = AutoPeftModelForCausalLM.from_pretrained(
    "{OUTPUT_DIR}",
    device_map="cuda:0",
    torch_dtype=torch.float16,
).merge_and_unload()

merged_model.save_pretrained("{MERGED_DIR}")
tokenizer.save_pretrained("{MERGED_DIR}")

# Copy tokenizer.model from HF cache (already downloaded) — no sentencepiece needed
src = hf_hub_download(repo_id="{BASE_MODEL}", filename="tokenizer.model")
shutil.copy(src, "{MERGED_DIR}/tokenizer.model")
print("Merged model saved.")
```

---

## Cell 3 — Convert to GGUF (isolated venv)

> ⚠️ PITFALL: `pip install -r llama.cpp/requirements.txt` in the notebook kernel breaks
> training dependencies. Fix: isolated venv at /tmp/gguf-env, run conversion as subprocess.
>
> Supported --outtype values directly in convert_hf_to_gguf.py: f32, f16, bf16, q8_0, q4_0
> For q4_k_m: NOT directly supported — need to convert to f16 first, then run llama-quantize binary separately.

```python
import subprocess

!git clone https://github.com/ggerganov/llama.cpp --depth=1

subprocess.run(["python", "-m", "venv", "/tmp/gguf-env"], check=True)
subprocess.run(["/tmp/gguf-env/bin/pip", "install", "-q", "-r", "llama.cpp/requirements.txt"], check=True)
subprocess.run([
    "/tmp/gguf-env/bin/python", "llama.cpp/convert_hf_to_gguf.py",
    "{MERGED_DIR}",
    "--outfile", "{GGUF_FILE}",
    "--outtype", "{QUANT_TYPE}"
], check=True)
print("GGUF conversion done.")
```

---

## Cell 4 — Push GGUF to HuggingFace

```python
from huggingface_hub import HfApi

api = HfApi()
api.create_repo("{HF_GGUF_REPO}", repo_type="model", exist_ok=True)
api.upload_file(
    path_or_fileobj="{GGUF_FILE}",
    path_in_repo="{GGUF_FILE}",
    repo_id="{HF_GGUF_REPO}",
    repo_type="model",
)
print("Done: https://huggingface.co/{HF_GGUF_REPO}")
```

---

## Pitfall Summary

| # | Symptom | Cause | Fix |
|---|---------|-------|-----|
| 1 | `Can't find adapter_config.json` on HF hub | `trainer.push_to_hub()` skips PEFT files | Use `model.push_to_hub()` + `tokenizer.push_to_hub()` |
| 2 | `merge_and_unload()` fails or produces garbage | Base model loaded in 4-bit (BnB) | Reload via `AutoPeftModelForCausalLM` with `torch_dtype=torch.float16` from local dir |
| 3 | `ValueError: Missing tokenizer.model` in llama.cpp | Fast tokenizer doesn't save SentencePiece binary | `hf_hub_download` + `shutil.copy` to merged dir |
| 4 | Training env breaks after GGUF conversion | llama.cpp deps conflict with training deps | Isolated `/tmp/gguf-env` venv + subprocess |
