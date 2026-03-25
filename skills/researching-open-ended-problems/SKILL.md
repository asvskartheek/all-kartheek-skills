---
name: researching-open-ended-problems
description: Conducts thorough research on open-ended technical problems before implementation. Use when the user says "research this", "investigate how to", "write a research document", "explore options for", or asks you to study a topic before building it. Gathers sources, clarifies the problem, and produces a structured research.md document.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch, AskUserQuestion, Task
---

# Researching Open-Ended Problems

## Quick Start

When given a research task, follow the three phases in order: **Clarify -> Gather -> Compile**.

## Phase 1: Clarify the Problem (MANDATORY)

Before any research begins, you MUST have clear answers to these questions. Use AskUserQuestion or ask directly in conversation:

### 1.1 Problem Definition
Ask until you can write a single sentence stating: "We need to [solve X] because [Y is broken/missing], and success looks like [Z]."

If the user's request is vague, ask follow-ups like:
- "What specific problem are you trying to solve?"
- "What does success look like? How will we know the research is useful?"
- "What constraints do we have? (budget, time, hardware, team size)"
- "What have you already tried that didn't work?"
- "Are there specific technologies or approaches you want to include or exclude?"

### 1.2 Starting Sources
Ask the user: **"Do you have any starting sources — blog posts, papers, docs, tutorials, or repos — that I should begin with?"**

This is critical because:
- The user often knows domain-specific resources that web search won't surface easily
- It anchors the research in the user's existing mental model
- It prevents wasting time rediscovering what the user already knows

### 1.3 Scope & Output
Confirm:
- What file should the research go into? (default: `research.md` in project root)
- How deep? (quick overview vs. thorough deep-dive)
- Any specific questions the research MUST answer?

**Do NOT proceed to Phase 2 until you have: a clear problem statement, at least some starting sources (user-provided or agreed-upon), and defined scope.**

## Phase 2: Gather Information

### 2.1 Read Project Context First
Before any external research, read the relevant project files the user points you to. Understand:
- What exists today (architecture, code, configs)
- What failed and why (error messages, test results)
- What constraints the codebase imposes

### 2.2 Fetch User-Provided Sources
Fetch ALL user-provided URLs in parallel using WebFetch. Extract maximum detail from each.

### 2.3 Expand with Web Search
Search for related topics in parallel. Good search patterns:
- `"[technology] [specific technique] tutorial 2025 2026"` — for recent guides
- `"[technology] [problem] reward function design"` — for specific solutions
- `"[product] pricing GPU cost per hour"` — for cost analysis
- `"[library] [feature] documentation API"` — for API details
- `"[technique] small model [size] results benchmark"` — for feasibility data

### 2.4 Deep Dive on Key Findings
From initial results, identify the 3-5 most important sources and fetch them in full. Look for:
- Official documentation pages
- Academic papers with methodology details
- Production case studies with concrete numbers
- API/library reference docs with code examples

### 2.5 Parallel Research Strategy
Launch independent research queries in parallel (multiple WebSearch/WebFetch calls in one message). Only serialize when one result determines the next query.

## Phase 3: Compile Research Document

### 3.1 Structure Template

```markdown
# Research: [Problem Title]

## 1. Problem Statement
[Clear statement of what we're solving, why, and what success looks like]

## 2. All the approaches
[A comprehensive list of possible approaches, with pros/cons, costs, and risks for each]

## 3. Recommended approach
[Based on the research, which approach do you recommend and why? Include concrete numbers and sources to back this up]

## 4. Technical Details
[Architecture, APIs, configurations, code examples]

## 5. Key References
[Numbered list of all sources with URLs]
```

### 3.2 Quality Standards

Every research document MUST include:
- **Concrete numbers** — benchmarks, costs, time estimates, not vague claims
- **Code examples** — actual configuration snippets, not pseudocode
- **Source citations** — link every claim to a source
- **Risk analysis** — what could go wrong and what's the fallback
- **Decision points** — clearly flag choices the user needs to make before implementation

### 3.3 Save to Memory
After writing research.md, update the project memory file with:
- Key findings summary (2-3 lines)
- Technical notes that will be needed during implementation
- File references

## Anti-Patterns to Avoid

- **Starting research before clarifying the problem** — you'll waste context window on irrelevant tangents
- **Fetching URLs sequentially** — always parallelize independent fetches
- **Vague conclusions** — "this might work" is useless; give numbers and evidence
- **Missing alternatives** — always present at least one fallback option
- **No cost analysis** — if compute/money is involved, calculate it explicitly
- **Ignoring user-provided sources** — these are your highest-signal starting points

## Example Trigger Phrases

- "Research how to fine-tune this model"
- "Investigate options for deploying on edge"
- "Write up a research doc on caching strategies"
- "Explore whether we can use X for Y"
- "I need to understand how Z works before we build it"
