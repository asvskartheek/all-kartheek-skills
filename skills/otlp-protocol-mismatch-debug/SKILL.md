---
name: otlp-protocol-mismatch-debug
description: Diagnose and fix OpenTelemetry export failures caused by protocol, content-type, or endpoint mismatches between exporters and collectors (HTTP JSON, HTTP protobuf, gRPC). Use when traces are sent but rejected, Phoenix returns 415 errors, or HTTP/gRPC expectations are confused.
---

# OTLP Protocol Mismatch Debug

This skill is specifically for transport-format mismatches.

## Workflow

1. Identify the exporter package/runtime.
2. Identify the exact collector endpoint and expected protocol.
3. Inspect request path, headers, and content type.
4. Compare actual exporter behavior vs collector expectations.
5. Fix the mismatch and retest with a fresh trace.

## Common outcomes

- swap HTTP JSON exporter for protobuf exporter
- change endpoint path/port
- stop sending browser traffic to a gRPC-only target
- adjust dev proxy rewrites

## Deliverable

State clearly:
- old exporter/protocol
- collector expectation
- mismatch observed
- exact fix
- proof that new traces ingest successfully
