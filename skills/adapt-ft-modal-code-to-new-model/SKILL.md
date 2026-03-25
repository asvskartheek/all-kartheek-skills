---
name: adapt-ft-modal-code-to-new-model
description: Adapts an existing Modal fine-tuning script (train_modal.py) to a new HuggingFace model. Use when the user says "adapt train_modal.py to", "switch the model to", "fine-tune a different model on Modal", or "port the training script to a new model". Follows a strict 4-phase workflow: research → tokenizer inspection with human confirmation → dependency verification via uv pip compile → code edits. Never edits code before human confirms tokenizer/chat-template output.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch, Agent
---

# Adapt Fine-Tuning Modal Code to a New Model

Adapts `train_modal.py` to target a new HuggingFace model. **No code is changed until the user confirms the tokenizer output in Phase 2.**

## Quick Start

User says: *"Adapt train_modal.py to Qwen/Qwen3.5-0.8B"*
→ Follow the 4 phases below in order. Never skip or reorder.

---

## Phase 1 — Read & Research (no code changes)

**1. Read `train_modal.py`** and note:
- Current `BASE_MODEL`, `LORA_TARGET_MODULES`
- Tokenizer block (does it set `pad_token = unk_token`?)
- `app` name, `output_vol` name, `OUTPUT_DIR`, `RUN_NAME`, `hub_model_id`
- All pinned versions inside `.uv_pip_install(...)`

**2. Fetch the target model's config files** to gather facts before writing a single line:

```
GET https://huggingface.co/<model_id>/raw/main/config.json
```
→ Find the exact linear layer names (e.g. `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj` — **do not assume, read the actual keys**).

```
GET https://huggingface.co/<model_id>/raw/main/tokenizer_config.json
```
→ Extract `pad_token`, `eos_token`, `unk_token`. Note whether `pad_token == eos_token`.

---

## Phase 2 — Tokenizer Inspection (STOP for human confirmation)

**3. Install dependencies locally if missing:**
```bash
uv add transformers jinja2
```

**3b. Verify the locally installed transformers supports the new model type** by attempting to load just the config:
```bash
uv run python -c "from transformers import AutoConfig; AutoConfig.from_pretrained('<model_id>')"
```
- If it succeeds → current transformers version is sufficient; use it as the lower bound in Phase 3's `uv pip compile`.
- If it raises `KeyError: '<model_type>'` or `ValueError: model type not recognized` → the locally installed transformers is too old. Note the `model_type` value from config.json (e.g. `qwen3_5`), then search PyPI / HuggingFace release notes to find the first transformers version that added support. Use that as the `>=` constraint in Phase 3.

**4. Write and run `inspect_tokenizer.py`:**

```python
from transformers import AutoTokenizer

MODEL_ID = "<new_model_id>"
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

print("=== Special Token Info ===")
print(f"pad_token   : {repr(tokenizer.pad_token)}")
print(f"pad_token_id: {tokenizer.pad_token_id}")
print(f"eos_token   : {repr(tokenizer.eos_token)}")
print(f"eos_token_id: {tokenizer.eos_token_id}")
print(f"unk_token   : {repr(tokenizer.unk_token)}")
print(f"unk_token_id: {tokenizer.unk_token_id}")
print(f"bos_token   : {repr(tokenizer.bos_token)}")
print(f"pad == eos? : {tokenizer.pad_token == tokenizer.eos_token}")

system_msg = (
    "You are Yoda from Star Wars. Translate the user's sentence "
    "into Yoda-speak by inverting the sentence structure."
)
messages = [
    {"role": "system", "content": system_msg},
    {"role": "user",   "content": "The force is strong with you."},
    {"role": "assistant", "content": "Strong with you, the force is."},
]

print("\n=== [THINKING ON] raw string ===")
print(tokenizer.apply_chat_template(messages, tokenize=False, enable_thinking=True))

print("\n=== [THINKING ON] decoded from token ids ===")
ids = tokenizer.apply_chat_template(messages, tokenize=True, enable_thinking=True)
print(tokenizer.decode(ids))

print("\n=== [THINKING OFF] raw string ===")
print(tokenizer.apply_chat_template(messages, tokenize=False, enable_thinking=False))

print("\n=== [THINKING OFF] decoded from token ids ===")
ids = tokenizer.apply_chat_template(messages, tokenize=True, enable_thinking=False)
print(tokenizer.decode(ids))
```

Run with: `uv run inspect_tokenizer.py`

**5. ⛔ STOP — show the user all output and ask:**

> - Is the chat template format correct for your training needs?
> - Do you want thinking mode enabled or disabled in training?
>
> **Note on thinking mode:** `enable_thinking` only controls the *generation prompt* at inference time. For training data, the chat template always injects `<think>…</think>` around the last assistant turn regardless of the flag (as seen in Qwen3.5's Jinja template). If you want truly clean training targets with no `<think>` blocks, the assistant messages must be pre-formatted manually as raw strings — this requires switching `format_dataset` from `{"messages": [...]}` to `{"text": ...}` format.

**Do NOT proceed to Phase 3 or 4 until the user explicitly confirms.**

---

## Phase 3 — Dependency Verification (before touching train_modal.py)

**6. Resolve a fully compatible package set using `uv pip compile`:**

```bash
uv pip compile - <<'EOF'
torch
transformers>=<version confirmed in step 3b>
peft
accelerate
trl
bitsandbytes
datasets
safetensors
pandas
numpy
wandb
EOF
```

Use the **exact resolved versions** from the output — never manually bump individual pins.

### ⚠️ Past failures — do NOT repeat

| # | What went wrong | Result |
|---|---|---|
| 1 | Bumped `transformers` alone without updating `huggingface-hub` | Image build failed: `huggingface-hub==0.34.4` incompatible with `transformers==5.3.0` |
| 2 | Fixed `huggingface-hub` but left `torch==2.3.0` | Runtime crash: "PyTorch >= 2.4 required" + `ImportError: cannot import name 'HybridCache' from transformers` |
| Root cause | Mixing old torch with new transformers breaks the entire stack | Always resolve the full graph together |

**The fix:** let `uv pip compile` resolve everything at once with minimal pins. Do not guess compatible versions.

---

## Phase 4 — Apply All Changes to train_modal.py

Only after user confirms tokenizer output (Phase 2) and `uv pip compile` succeeds (Phase 3):

| # | What to change | Rule |
|---|---|---|
| 1 | Docstring | Update model name |
| 2 | `RUN_NAME` | Use user's choice; suggest `<shortname>-baseline` if not given |
| 3 | `BASE_MODEL` | New HuggingFace model ID |
| 4 | `LORA_TARGET_MODULES` | Exact layer names from config.json — never assumed |
| 5 | `modal.App(...)` name | Reflect new model |
| 6 | `modal.Volume.from_name(...)` name | Reflect new model |
| 7 | `OUTPUT_DIR` | Reflect new model |
| 8 | Tokenizer block | See tokenizer logic below |
| 9 | `hub_model_id` | `f"<shortname>-yoda-{RUN_NAME}"` |
| 10 | All `.uv_pip_install(...)` versions | Exact versions from `uv pip compile` output |

### Tokenizer block logic

```
pad_token == eos_token AND unk_token exists → keep pad_token = unk_token workaround
pad_token != eos_token                      → remove workaround, add comment explaining tokens are already distinct
unk_token is None                           → remove workaround, add comment noting unk_token unavailable; consider setting pad_token to a different safe token
```

### Final checklist

- [ ] All old model name references removed (names, paths, comments)
- [ ] LoRA target modules verified against actual config.json keys
- [ ] Tokenizer block matches what the tokenizer actually needs
- [ ] ALL package versions are from `uv pip compile` output (not guessed)
- [ ] `RUN_NAME`, `hub_model_id`, app name, volume name, `OUTPUT_DIR` all consistent with new model
