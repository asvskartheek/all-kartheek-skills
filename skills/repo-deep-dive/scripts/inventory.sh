#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"

echo "== ROOT =="
realpath "$ROOT"

echo
printf '== TOP LEVEL ==\n'
find "$ROOT" -mindepth 1 -maxdepth 1 | sed 's#^'$ROOT'/##' | sort

echo
printf '== DOCS ==\n'
find "$ROOT" -maxdepth 3 \( -iname 'README.md' -o -iname 'QUICK_START.md' -o -iname 'CLAUDE.md' -o -iname 'AGENTS.md' \) | sort

echo
printf '== CONFIGS ==\n'
find "$ROOT" -maxdepth 3 \( -name 'package.json' -o -name 'pyproject.toml' -o -name 'Cargo.toml' -o -name 'go.mod' -o -name 'docker-compose.yml' -o -name 'docker-compose.yaml' -o -name 'Dockerfile' -o -name 'tsconfig.json' -o -name 'vite.config.ts' -o -name 'vite.config.js' -o -name 'next.config.js' -o -name 'next.config.ts' \) | sort

echo
printf '== CANDIDATE ENTRYPOINTS ==\n'
find "$ROOT" -maxdepth 4 \( -name 'main.py' -o -name 'main.ts' -o -name 'main.js' -o -name 'app.py' -o -name 'app.ts' -o -name 'app.js' -o -name 'server.py' -o -name 'server.ts' -o -name 'server.js' -o -name 'index.ts' -o -name 'index.js' -o -name 'index.html' \) | sort
