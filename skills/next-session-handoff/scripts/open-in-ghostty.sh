#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <working-directory> <prompt-file>" >&2
  exit 1
fi

workdir="$1"
prompt_file="$2"

if [[ ! -d "$workdir" ]]; then
  echo "Working directory does not exist: $workdir" >&2
  exit 1
fi

if [[ ! -f "$prompt_file" ]]; then
  echo "Prompt file does not exist: $prompt_file" >&2
  exit 1
fi

if ! command -v pi >/dev/null 2>&1; then
  echo "pi is not on PATH" >&2
  exit 1
fi

if [[ ! -d /Applications/Ghostty.app ]]; then
  echo "Ghostty.app is not installed in /Applications" >&2
  exit 1
fi

shell_cmd="cd $(printf '%q' "$workdir") && clear && pi @$(printf '%q' "$prompt_file")"

ghostty_running="$(osascript -e 'tell application "System Events" to (name of processes) contains "Ghostty"')"

if [[ "$ghostty_running" == "true" ]]; then
  osascript - "$shell_cmd" <<'APPLESCRIPT'
on run argv
  set shellCmd to item 1 of argv
  tell application "Ghostty" to activate
  tell application "System Events"
    keystroke "t" using command down
    keystroke shellCmd
    key code 36
  end tell
end run
APPLESCRIPT
else
  open -a Ghostty --args --working-directory="$workdir" --command="$shell_cmd"
fi

echo "Launched pi in Ghostty for: $prompt_file"
