---
name: basic-openai-agent
description: Generates a minimal agent built from scratch using only the openai Python library. Includes the while loop, tool definition, system prompt injection, raw output parsing, and tool dispatcher. Use when the user asks to build a basic agent, write an agent from scratch, demonstrate how agents work, or create a minimal tool-calling loop with openai.
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Basic OpenAI Agent From Scratch

## What This Generates

A single `main.py` — no frameworks, no abstractions — that shows the complete agent loop:

```
user message → [LLM → <tool_call> → parse → run tool → <tool_response>]* → final answer
```

## Key Design Decisions

**Bypass the SDK's `tools` parameter.** Many local models (LM Studio, Ollama) have broken
translation layers. We inject tools into the system prompt manually and parse raw output.
This also makes the wire protocol visible — better for learning.

**The loop is the agent.** Everything else is plumbing.

## Workflow

### Step 1 — Gather context
Ask the user:
- Target: **LM Studio** (local) or **OpenAI API** (cloud)?
- What **tools** should the agent have? (name, description, params)
- What is the **task / demo scenario**?

If the user says "just show me" or "same as before", use defaults:
- LM Studio at `localhost:1234`
- Single tool: `get_weather(place: str, date: str)` with mock implementation
- Two demo queries: Tokyo tomorrow, Paris today

### Step 2 — Generate `main.py`

Use this exact structure:

```python
import json
import re
import openai

# ── Config ─────────────────────────────────────────────────────────────────────
MODEL = "<model-id>"          # exact ID from LM Studio or OpenAI model name

client = openai.OpenAI(
    base_url="http://localhost:1234/v1",  # remove for OpenAI cloud
    api_key="lm-studio",                  # any string for LM Studio
)

# ── Tool definitions (JSON schema) ────────────────────────────────────────────
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "<tool_name>",
            "description": "<what it does and when to call it>",
            "parameters": {
                "type": "object",
                "properties": {
                    "<param>": {"type": "string", "description": "<meaning>"},
                },
                "required": ["<param>"],
            },
        },
    }
]

# ── System prompt: inject tools in native format ──────────────────────────────
# Most instruct models fine-tuned for tool use expect <tools> XML in the system
# prompt and respond with <tool_call> JSON blocks.
def build_system_prompt(tools: list) -> str:
    tools_json = "\n".join(json.dumps(t) for t in tools)
    return f"""You are a helpful assistant with access to tools.

# Tools

<tools>
{tools_json}
</tools>

When you need a tool, respond ONLY with:
<tool_call>
{{"name": "<function-name>", "arguments": {{"<arg>": "<value>"}}}}
</tool_call>

After receiving the result, give a natural language answer."""

# ── Parse model output for tool calls ─────────────────────────────────────────
def parse_tool_call(text: str) -> dict | None:
    match = re.search(r"<tool_call>\s*(.*?)\s*</tool_call>", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return None

# ── Tool implementations ───────────────────────────────────────────────────────
def <tool_name>(<params>) -> str:
    # implement or mock here
    return "<result>"

TOOL_REGISTRY = {"<tool_name>": <tool_name>}

def call_tool(name: str, arguments: dict) -> str:
    print(f"\n[tool call]   {name}({arguments})")
    if name not in TOOL_REGISTRY:
        return f"Error: unknown tool '{name}'"
    result = TOOL_REGISTRY[name](**arguments)
    print(f"[tool result] {result}")
    return result

# ── Agent loop ─────────────────────────────────────────────────────────────────
def run_agent(user_message: str):
    print(f"\n{'='*60}\nUser: {user_message}\n{'='*60}")

    messages = [
        {"role": "system", "content": build_system_prompt(TOOLS)},
        {"role": "user",   "content": user_message},
    ]

    while True:
        print(f"\n[llm call]    messages={len(messages)}")
        response = client.chat.completions.create(model=MODEL, messages=messages)

        raw = response.choices[0].message.content
        raw = raw.replace("<|im_end|>", "").strip()  # clean up LM Studio token leaks

        tool_call = parse_tool_call(raw)

        if tool_call:
            result = call_tool(tool_call["name"], tool_call["arguments"])
            messages.append({"role": "assistant", "content": raw})
            messages.append({
                "role": "user",
                "content": (
                    f"<tool_response>\n"
                    f"{{\"name\": \"{tool_call['name']}\", \"content\": {json.dumps(result)}}}\n"
                    f"</tool_response>"
                ),
            })
            continue

        print(f"\nAssistant: {raw}\n")
        return raw

# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    run_agent("<demo query 1>")
    run_agent("<demo query 2>")
```

### Step 3 — Install and run

```bash
uv add openai
uv run main.py
```

### Step 4 — Verify output yourself before showing the user

Run `uv run main.py` and confirm:
- `[tool call]` line appears (model triggered the tool)
- `[tool result]` line appears (your code ran it)
- A second `[llm call]` happens (model reads the result)
- `Assistant:` line has a natural language answer

If the model never triggers a tool (just answers directly), the system prompt
or query phrasing is the issue — not the loop. Try a more direct question.

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| `tool_calls: []` from raw API | LM Studio translation broken | Already handled — we bypass it |
| Model answers without calling tool | Query too indirect for small model | Use explicit phrasing: "What is the weather in X on Y?" |
| `<\|im_end\|>` in output | LM Studio leaks chat template tokens | Already stripped in `parse_tool_call` |
| `JSONDecodeError` on parse | Model hallucinated malformed JSON | `parse_tool_call` returns `None` safely; treat as final answer |
| `Connection refused` | LM Studio server not running | Start LM Studio → load model → enable local server toggle |

## Adding a Second Tool

1. Add the schema to `TOOLS`
2. Write the Python function
3. Add to `TOOL_REGISTRY`

The loop handles multiple tool calls automatically — no other changes needed.

## LM Studio vs OpenAI Cloud

For cloud OpenAI, remove `base_url` and set a real `api_key`:
```python
client = openai.OpenAI(api_key="sk-...")
MODEL = "gpt-4o-mini"
```
The same system prompt format and parsing loop works unchanged.