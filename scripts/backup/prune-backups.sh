#!/usr/bin/env bash
set -euo pipefail
DAYS="${1:-30}"
PREFIX="${2:-backup}"
CUTOFF_SEC=$(date -d "-$DAYS days" +%s)

echo "Scanning for $PREFIX branches/tags older than $DAYS days..."

# Branches
while read -r ref date; do
  [[ -z "$ref" ]] && continue
  created_sec=$(date -d "$date" +%s || echo 0)
  if [[ $created_sec -lt $CUTOFF_SEC ]]; then
    echo "Deleting branch $ref (created $date)"
    git branch -D "$ref" || true
    git push origin ":$ref" || true
  fi
done < <(git for-each-ref --format='%(refname:short) %(creatordate:iso8601)' "refs/heads/$PREFIX/")

# Tags
while read -r tag date; do
  [[ -z "$tag" ]] && continue
  created_sec=$(date -d "$date" +%s || echo 0)
  if [[ $created_sec -lt $CUTOFF_SEC ]]; then
    echo "Deleting tag $tag (created $date)"
    git tag -d "$tag" || true
    git push origin ":refs/tags/$tag" || true
  fi
done < <(git for-each-ref --format='%(refname:short) %(creatordate:iso8601)' "refs/tags/${PREFIX}-pre-push-")

echo "Prune complete."
