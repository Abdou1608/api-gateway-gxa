#!/usr/bin/env bash
set -euo pipefail
# Ajoute des alias git undo-* basés sur les scripts bash
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

add_alias() {
  local name=$1; shift
  local target=$1; shift
  git config --global alias."$name" "!bash $SCRIPT_DIR/$target"
  echo "[OK] git $name" >&2
}

add_alias undo-fetch undo-fetch.sh
add_alias undo-pull undo-pull.sh
add_alias undo-merge undo-merge.sh
add_alias undo-rebase undo-rebase.sh
add_alias undo-push undo-push.sh
add_alias recovery-menu recovery-menu.sh

echo "Alias installés. Exemple: git undo-pull" >&2
