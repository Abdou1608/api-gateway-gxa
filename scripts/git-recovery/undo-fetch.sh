#!/usr/bin/env bash
set -euo pipefail
branch="${1:-$(git rev-parse --abbrev-ref HEAD)}"
echo "[INFO] git fetch --all --prune" >&2
git fetch --all --prune
echo "[INFO] Fetch n'altère pas HEAD. Rien à annuler localement." >&2
echo "[HINT] Pour annuler côté distant: git push --force-with-lease origin <ancien_commit>:refs/heads/$branch" >&2
echo "--- Derniers commits ($branch) ---" >&2
git log --oneline -n 5 "$branch"
