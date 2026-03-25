---
name: active-state-persistence
description: Retrofit persistence for active application state so restarts resume from warm state instead of cold-loading everything again. Use when an app loses useful in-memory state on restart and should recover cached data, last known results, or active session state safely.
---

# Active State Persistence

Use this skill when an app feels stateless after restart but shouldn’t.

## Workflow

1. Identify what “active state” actually matters.
2. Separate durable state from recomputable/transient state.
3. Choose a persistence format/store appropriate to the app.
4. Save state on update/shutdown.
5. Restore state at startup.
6. Define refresh/invalidation rules so stale state does not mislead users.

## Good candidates for persistence

- latest fetched items
- classification/results cache
- queue state
- last refresh timestamps
- lightweight session snapshots

## Rule

Persist the minimum useful state, not every internal object.
