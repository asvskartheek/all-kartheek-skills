---
name: served-dashboard-upgrade
description: Replace a plain static admin/dashboard page with a served dynamic page that is rendered or hydrated by an actual app/server route. Use when a dashboard should be data-driven, live, or integrated with backend state instead of being just a static file.
---

# Served Dashboard Upgrade

Use this when the user wants a real dashboard, not a dead static page.

## Workflow

1. Inspect the current static page and data sources.
2. Choose the lightest suitable server approach.
3. Create a route/controller that serves the dashboard.
4. Connect real backend data or placeholders with a clear upgrade path.
5. Preserve or improve the existing UI while making it live.

## Typical stacks

- FastAPI + Jinja2
- Flask + templates
- Express + templating
- Next/Vite app served from an app server

## Output should include

- served route path(s)
- where dashboard data comes from
- startup command
- what is now dynamic vs still placeholder
