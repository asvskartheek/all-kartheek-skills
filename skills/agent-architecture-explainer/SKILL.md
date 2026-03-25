---
name: agent-architecture-explainer
description: Explain agent systems, tool-calling loops, and codebase architecture in a beginner-friendly way, optionally with Mermaid or Excalidraw-ready structure. Use when asked to explain how an agent works, teach a friend, or create architecture diagrams from code.
---

# Agent Architecture Explainer

Use this skill when the goal is understanding and teaching, not just auditing.

## Teaching workflow

1. **Read the smallest complete execution path**
   Start with the code that turns user input into model calls, tool calls, state updates, and final output.

2. **Extract the layers**
   Usually these are:
   - user / UI
   - system prompt / instructions
   - model call
   - tool schema / tool selection
   - tool execution
   - state/history/memory
   - final response back to user

3. **Explain at 3 levels**
   - **Beginner analogy** — what it feels like in plain English
   - **Component map** — boxes and arrows
   - **Step-by-step runtime loop** — what happens in order

4. **Diagram it**
   - If Mermaid is appropriate, load the `mermaid` skill before authoring or editing Mermaid.
   - If the user asks for Excalidraw, produce a clear scene plan: boxes, labels, arrows, grouping, and annotations.

## Output pattern

### 1. Elevator pitch
A 3-6 sentence explanation for a beginner.

### 2. Component glossary
Brief definition of each major moving part.

### 3. Runtime walkthrough
A numbered sequence from user action to final answer.

### 4. Diagram source
Mermaid text or Excalidraw-ready layout description.

### 5. “What to notice” section
Call out the non-obvious ideas:
- where decisions happen
- where state changes
- where tools are real code vs model text
- where retries or failures can occur

## Quality bar

A good explanation should make these things obvious:
- the model does not directly execute tools
- tool definitions constrain what the model can ask for
- runtime code validates and executes tool calls
- conversation/history shapes later behavior
- observability/debugging hooks sit outside the model itself

See [the diagram checklist](references/checklist.md).
