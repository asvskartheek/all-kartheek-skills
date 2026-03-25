---
name: pi-package-bootstrap
description: Install and verify Pi packages, skills, extensions, prompts, or themes from local paths, git repositories, or npm. Use when asked to set up Pi tooling from a repo, install shared skills globally, or wire custom resources into Pi.
---

# Pi Package Bootstrap

Use this skill when the task is “set this repo up in Pi”.

## Step 1: inspect before installing

Read the relevant Pi docs first, then inspect the target repo:
- `package.json`
- `README.md`
- any `AGENTS.md` / setup notes
- look for `skills/`, `extensions/`, `prompts/`, `themes/`
- look for a `pi` manifest in `package.json`

## Prefer the simplest install path

### If the repo is a valid Pi package
Use:

```bash
pi install <source>
```

Where `<source>` can be:
- local path
- git URL
- npm spec

### If it is not a package but has usable resources
Use Pi settings to add explicit local paths.

## Scope decisions

Choose the install scope based on the request:
- **global** → `~/.pi/agent/settings.json`
- **project-local** → `.pi/settings.json`

If the user says “globally”, use global scope.

## Verification checklist

After installation, verify:
- package appears in Pi package list or settings
- expected skills/extensions/prompts/themes are discoverable
- any requested theme is set separately if needed
- user knows they may need `/reload` or a restart

## Strong rules

- Prefer `pi install` over manual file copying when possible.
- Read the repo/package manifest before trusting it.
- Be explicit about what changed in settings.
- If the package contains themes or prompts, verify those too — not just skills.
- If a repo is already published on npm, prefer the published package unless the user specifically wants git HEAD.

## Final response should include

- install source used
- scope used
- files/settings changed
- discovered resources summary
- whether `/reload` or restart is needed

See [the install checklist](references/checklist.md).
