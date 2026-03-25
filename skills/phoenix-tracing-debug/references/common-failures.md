# Common Phoenix Failures

## 415 Unsupported Media Type
Usually means the exporter protocol/content type does not match what Phoenix expects at the collector endpoint.

## Traces sent to the wrong path
Examples:
- app posts to `/v1/traces`
- dev proxy rewrites `/phoenix` incorrectly
- frontend points to UI port but wrong collector path

## Browser vs server mismatch
A browser-safe exporter, proxy, or CORS path may differ from a Node/Python setup.

## “Phoenix is up” but no traces show
Server health alone is not proof. Trigger a fresh trace and confirm ingestion in UI/logs/storage.

## Batched exporter never flushes
Short-lived apps or fast reloads can hide the issue.
