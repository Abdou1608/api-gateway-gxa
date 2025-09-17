#!/usr/bin/env bash
set -euo pipefail
if [ -f .git/MERGE_HEAD ]; then
  echo "[INFO] Merge en cours -> abort" >&2
  git merge --abort
  exit 0
fi
parents=$(git rev-list --parents -n 1 HEAD)
set -- $parents
commit=$1
shift
if [ $# -gt 1 ]; then
  firstParent=$1
  echo "[INFO] Dernier commit est un merge. HEAD=$commit parent=$firstParent" >&2
  read -rp "Confirmer reset HARD vers parent ? (y/N) " ans
  [[ ${ans:-} == y || ${ans:-} == Y ]] || exit 1
  git reset --hard "$firstParent"
  echo "[DONE] Merge annulé." >&2
else
  echo "[INFO] Dernier commit n'est pas un merge. Rien à faire." >&2
fi
