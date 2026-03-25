#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
find "$ROOT" -type f \( -iname '*.csv' -o -iname '*.tsv' \) | sort
