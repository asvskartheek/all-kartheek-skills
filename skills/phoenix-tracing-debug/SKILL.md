---
name: phoenix-tracing-debug
description: Add, validate, or debug Arize Phoenix and OpenTelemetry tracing for agent apps, web apps, or local demos. Use when traces are missing, collector endpoints are wrong, Phoenix returns errors, or you need verified observability instead of assumed tracing.
---

# Phoenix Tracing Debug

This skill comes from repeated sessions adding and troubleshooting Phoenix observability.

## What to inspect first

Search for:
- `phoenix`
- `arize`
- `openinference`
- `opentelemetry`
- `otel`
- `otlp`
- `grpc`
- `v1/traces`
- `collector`

Read the files that define:
- exporter setup
- env vars
- dev proxies (`vite.config.*`, Next proxy setup, reverse proxies)
- Phoenix launch scripts
- README tracing instructions

## Debug workflow

1. **Verify Phoenix is actually running**
   - confirm UI is reachable
   - confirm the collector endpoint/port you expect is live

2. **Identify the runtime**
   - browser web app
   - Node server
   - Python app
   - mixed frontend/backend

3. **Identify exporter protocol**
   - OTLP HTTP JSON
   - OTLP HTTP protobuf
   - gRPC
   - OpenInference wrappers

4. **Compare exporter vs collector expectations**
   A recurring failure pattern is:
   - exporter sends one content type/protocol
   - Phoenix expects another
   - result: `415 Unsupported Media Type` or “no traces” despite requests being sent

5. **Verify the transport path end-to-end**
   - exporter URL
   - proxy rewrite
   - collector URL
   - request headers/content type
   - whether the trace appears in Phoenix UI or backing store

6. **Trigger a real trace and inspect evidence**
   Do not stop at “server is running”. Confirm a fresh trace is ingested.

## Common failure modes

- Phoenix server running but app points to wrong port/path
- frontend proxy rewrites `/phoenix` incorrectly
- browser exporter uses unsupported OTLP encoding
- gRPC/HTTP confusion
- traces batched but not flushed before app exits
- env var documented one way but code uses another

## Required deliverable

When done, report:
- root cause
- changed files
- exact endpoint/protocol now used
- how you verified ingestion
- any remaining caveats

See [common failures](references/common-failures.md).
