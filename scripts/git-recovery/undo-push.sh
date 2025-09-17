#!/usr/bin/env bash
set -euo pipefail
ref=${1:-HEAD@{1}}
branch=${2:-$(git rev-parse --abbrev-ref HEAD)}
force=${FORCE_REMOTE:-false}
if ! git reflog | grep -q "$ref"; then
  echo "[ERR] $ref introuvable dans reflog" >&2; exit 1; fi
read -rp "Créer un tag de backup avant reset ? (y/N) " tagc
if [[ ${tagc:-} == y || ${tagc:-} == Y ]]; then
  tagName="backup-before-undo-push-$(date +%Y%m%d-%H%M%S)"
  git tag "$tagName"
  echo "[INFO] Tag $tagName créé." >&2
fi
read -rp "Confirmer reset HARD vers $ref ? (y/N) " ans
[[ ${ans:-} == y || ${ans:-} == Y ]] || exit 1
git reset --hard "$ref"
if $force; then
  read -rp "Confirmer réécriture distante (--force-with-lease) ? (y/N) " fp
  [[ ${fp:-} == y || ${fp:-} == Y ]] || { echo "[INFO] Distant intact." >&2; exit 0; }
  git push --force-with-lease origin "$branch"
  echo "[DONE] Push distant réécrit." >&2
else
  echo "[INFO] Distant intact (export FORCE_REMOTE=true pour réécrire)." >&2
fi
