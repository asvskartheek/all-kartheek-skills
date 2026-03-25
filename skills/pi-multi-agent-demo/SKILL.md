---
name: pi-multi-agent-demo
description: Scaffold a small multi-agent demo using Pi packages such as `@mariozechner/pi-agent-core` and `@mariozechner/pi-web-ui`, optionally with Phoenix tracing. Use when building a concierge/router agent with specialist sub-agents and a simple UI.
---

# Pi Multi-Agent Demo

Use this skill for small but polished multi-agent demos.

## Before coding

Read the Pi docs and examples relevant to the stack being used.

## Recommended shape

- one coordinator/concierge agent
- several focused specialists
- simple shared state or profile context
- specialist tools for domain actions/searches
- web UI showing conversation and agent status
- optional Phoenix/OpenTelemetry tracing

## Deliverables

- clear coordinator vs specialist responsibilities
- runnable dev command
- small curated demo dataset or tools
- UI that makes delegation visible
- observability hooks if requested

## Rule

Keep the demo honest: real delegation paths, small scope, and observable handoffs rather than fake agent theater.
