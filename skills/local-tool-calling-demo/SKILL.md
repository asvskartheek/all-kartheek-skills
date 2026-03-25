---
name: local-tool-calling-demo
description: Build a small educational demo of manual tool-calling using a local OpenAI-compatible endpoint or LM Studio, showing the raw system prompt, tool schema, tool-call parse step, tool execution, and final answer loop. Use when teaching how agents fundamentally work.
---

# Local Tool-Calling Demo

Use this skill for teaching and prototyping agent loops from scratch.

## Goal

Expose the wire protocol instead of hiding everything behind a framework.

## Include these pieces

- a tiny tool schema
- system prompt that injects the tools
- parser for model-emitted tool calls
- tool dispatch function
- explicit loop: prompt → model → parse → execute tool → append tool result → model
- verbose logging of each step

## Best use cases

- teaching a beginner
- explaining why tool calls are model text first, code execution second
- debugging local models with weak/broken native tool support

## Rule

Prefer clarity over abstraction. The code should be readable line-by-line by a newcomer.
