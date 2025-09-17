#!/usr/bin/env bash
set -euo pipefail
ref=${1:-HEAD@{1}}
if git reflog -n 10 | grep -q "${ref}"; then
  echo "[INFO] Reset vers $ref" >&2
else
  echo "[WARN] Ref $ref non trouvée dans reflog récent" >&2
  git reflog -n 10 >&2
  exit 1
fi
read -rp "Confirmer reset HARD vers $ref ? (y/N) " ans
[[ ${ans:-} == y || ${ans:-} == Y ]] || exit 1
git reset --hard "$ref"
echo "[DONE] Pull annulé." >&2
