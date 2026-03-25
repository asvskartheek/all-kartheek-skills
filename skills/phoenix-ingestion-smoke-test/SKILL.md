---
name: phoenix-ingestion-smoke-test
description: Prove that a Phoenix instance is actually ingesting fresh traces by triggering a minimal trace, following it through the transport path, and confirming it appears in the UI/logs/storage. Use when “Phoenix is running” but you need evidence that traces are flowing.
---

# Phoenix Ingestion Smoke Test

Use this skill after setup or before debugging deeper issues.

## Workflow

1. Confirm the Phoenix server/UI is reachable.
2. Identify the collector endpoint the app should hit.
3. Trigger a fresh trace from the app or a minimal repro.
4. Confirm the request is actually sent.
5. Confirm the trace is actually ingested.

## Acceptable evidence

- trace visible in Phoenix UI
- collector logs show successful ingestion
- backing store/DB reflects the new trace

## Not enough evidence

- “server started”
- opening the Phoenix homepage only
- seeing old traces only

## Output

- endpoint used
- action used to trigger trace
- proof of ingestion
- remaining caveats
