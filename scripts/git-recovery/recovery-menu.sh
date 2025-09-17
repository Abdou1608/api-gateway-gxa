#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

menu() {
  cat <<'EOF'
==== Git Recovery Menu ====
1) Undo Fetch (info)
2) Undo Pull
3) Undo Merge
4) Undo Rebase
5) Undo Push
6) Create Backup Tag
q) Quit
EOF
}

while true; do
  menu
  read -rp "Choix: " c
  case $c in
    1) bash "$SCRIPT_DIR/undo-fetch.sh" ;;
    2) bash "$SCRIPT_DIR/undo-pull.sh" ;;
    3) bash "$SCRIPT_DIR/undo-merge.sh" ;;
    4) bash "$SCRIPT_DIR/undo-rebase.sh" ;;
    5) FORCE_REMOTE=false bash "$SCRIPT_DIR/undo-push.sh" ;;
    6) bash "$SCRIPT_DIR/create-backup-tag.sh" ;;
    q|Q) exit 0 ;;
    *) echo "Choix invalide" >&2 ;;
  esac
  echo "---" >&2
done
