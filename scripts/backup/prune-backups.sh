#!/usr/bin/env bash
set -euo pipefail
USAGE="Usage: prune-backups.sh [days=30] [prefix=backup] [protectCount=5] [archiveDir=]"
DAYS="${1:-30}"
PREFIX="${2:-backup}"
PROTECT="${3:-5}"   # number of most recent branches/tags to always keep
ARCHIVE_DIR="${4:-}"
CUTOFF_SEC=$(date -d "-$DAYS days" +%s)

mkdir -p "$ARCHIVE_DIR" 2>/dev/null || true

echo "Protecting last $PROTECT backups (branches+tags) regardless of age."

echo "Scanning for $PREFIX branches/tags older than $DAYS days..."

mapfile -t BRANCH_LINES < <(git for-each-ref --format='%(refname:short) %(creatordate:iso8601)' "refs/heads/$PREFIX/" | sort -k2)
TOTAL_BRANCHES=${#BRANCH_LINES[@]}
KEEP_BRANCH_INDEX=$(( TOTAL_BRANCHES - PROTECT ))
[[ $KEEP_BRANCH_INDEX -lt 0 ]] && KEEP_BRANCH_INDEX=0

for idx in "${!BRANCH_LINES[@]}"; do
  line="${BRANCH_LINES[$idx]}"
  [[ -z "$line" ]] && continue
  ref="${line%% *}"
  date="${line#* }"
  created_sec=$(date -d "$date" +%s || echo 0)
  if [[ $idx -lt $KEEP_BRANCH_INDEX && $created_sec -lt $CUTOFF_SEC ]]; then
    echo "Deleting branch $ref (created $date)"
    if [[ -n "$ARCHIVE_DIR" ]]; then
      git show "$ref":README.md >"$ARCHIVE_DIR/${ref//\//_}_README.md" 2>/dev/null || true
      git bundle create "$ARCHIVE_DIR/${ref//\//_}.bundle" "$ref" || true
    fi
    git branch -D "$ref" || true
    git push origin ":$ref" || true
  fi
done

done < <(git for-each-ref --format='%(refname:short) %(creatordate:iso8601)' "refs/tags/${PREFIX}-pre-push-")
mapfile -t TAG_LINES < <(git for-each-ref --format='%(refname:short) %(creatordate:iso8601)' "refs/tags/${PREFIX}-pre-push-" | sort -k2)
TOTAL_TAGS=${#TAG_LINES[@]}
KEEP_TAG_INDEX=$(( TOTAL_TAGS - PROTECT ))
[[ $KEEP_TAG_INDEX -lt 0 ]] && KEEP_TAG_INDEX=0

for idx in "${!TAG_LINES[@]}"; do
  line="${TAG_LINES[$idx]}"
  [[ -z "$line" ]] && continue
  tag="${line%% *}"
  date="${line#* }"
  created_sec=$(date -d "$date" +%s || echo 0)
  if [[ $idx -lt $KEEP_TAG_INDEX && $created_sec -lt $CUTOFF_SEC ]]; then
    echo "Deleting tag $tag (created $date)"
    git tag -d "$tag" || true
    git push origin ":refs/tags/$tag" || true
  fi
done

echo "Prune complete."
