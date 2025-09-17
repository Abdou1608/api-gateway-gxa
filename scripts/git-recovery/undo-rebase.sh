#!/usr/bin/env bash
set -euo pipefail
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; then
  echo "[INFO] Rebase en cours -> abort" >&2
  git rebase --abort
  exit 0
fi
rebaseLines=$(git reflog | grep -i rebase | head -5 || true)
if [ -z "$rebaseLines" ]; then
  echo "[WARN] Aucune entrée rebase récente." >&2
  exit 1
fi
echo "$rebaseLines" >&2
read -rp "Entrer l'index reflog (ex: HEAD@{3}) : " choice
[ -z "$choice" ] && { echo "Annulé" >&2; exit 1; }
if ! git reflog | grep -q "$choice"; then
  echo "[ERR] Ref introuvable." >&2; exit 2; fi
read -rp "Confirmer reset HARD vers $choice ? (y/N) " ans
[[ ${ans:-} == y || ${ans:-} == Y ]] || exit 1
git reset --hard "$choice"
echo "[DONE] Rebase annulé." >&2
