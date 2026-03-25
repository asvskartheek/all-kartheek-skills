---
name: pi-minimal-session
description: Start or configure a clean-room Pi session with no extensions, skills, prompt templates, themes, or saved session state. Use when the user wants the most minimal Pi possible for debugging, isolation, or reproduction.
---

# Pi Minimal Session

Use this skill when the user wants a bare Pi environment with as little customization as possible.

## Primary command

```bash
pi --no-extensions --no-skills --no-prompt-templates --no-themes
```

## Even more minimal

Use this when the user also wants no saved session state:

```bash
pi --no-extensions --no-skills --no-prompt-templates --no-themes --no-session
```

## Clean-room debugging workflow

1. Start from the minimal command above.
2. If the issue disappears, re-enable one layer at a time:
   - themes
   - prompt templates
   - skills
   - extensions
3. If the issue is project-context related, check:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `.pi/settings.json`
   - project-local `.pi/extensions/`, `.pi/skills/`, `.pi/themes/`, `.pi/prompts/`
4. If the user wants a persistent minimal launcher, write a shell alias or script.

## Helpful aliases

```bash
alias pi-min='pi --no-extensions --no-skills --no-prompt-templates --no-themes'
alias pi-bare='pi --no-extensions --no-skills --no-prompt-templates --no-themes --no-session'
```

## When to inspect config

Look at:
- `~/.pi/agent/settings.json`
- `.pi/settings.json`
- installed packages from `pi list`

## Rule

Do not claim Pi itself is broken until the same problem reproduces in a minimal session.
