#!/usr/bin/env bash
set -euo pipefail
USAGE="Usage: prune-backups.sh [days=30] [prefix=backup] [protectCount=5] [archiveDir=] [maxTotalSizeMB=0]"
DAYS="${1:-30}"
PREFIX="${2:-backup}"
PROTECT="${3:-5}"   # number of most recent branches/tags to always keep
ARCHIVE_DIR="${4:-}"
MAX_SIZE_MB="${5:-0}" # 0 disables size threshold
CUTOFF_SEC=$(date -d "-$DAYS days" +%s)

mkdir -p "$ARCHIVE_DIR" 2>/dev/null || true
INDEX_FILE="$ARCHIVE_DIR/index.json"
INDEX_TMP="$ARCHIVE_DIR/index.tmp"
if [[ -n "$ARCHIVE_DIR" ]]; then
  : > "$INDEX_TMP"
fi

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
      baseName="${ref//\//_}"
      bundlePath="$ARCHIVE_DIR/${baseName}.bundle"
      git bundle create "$bundlePath" "$ref" || true
      if [[ -s "$bundlePath" ]]; then
        # Compress bundle
        gzip -f "$bundlePath"
        bundleGz="${bundlePath}.gz"
        sizeBytes=$(stat -c%s "$bundleGz" 2>/dev/null || echo 0)
        headSha=$(git rev-parse "$ref" 2>/dev/null || echo "")
        createdIso=$(git log -1 --format=%cI "$ref" 2>/dev/null || date -Iseconds)
        echo "{\n  \"type\": \"branch\", \"ref\": \"$ref\", \"sha\": \"$headSha\", \"created\": \"$createdIso\", \"archivedAt\": \"$(date -Iseconds)\", \"file\": \"${bundleGz##$ARCHIVE_DIR/}\", \"sizeBytes\": $sizeBytes\n}" >> "$INDEX_TMP"
      fi
    fi
    git branch -D "$ref" || true
    git push origin ":$ref" || true
  fi
done

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
    if [[ -n "$ARCHIVE_DIR" ]]; then
      baseName="${tag//\//_}"
      # create synthetic bundle of tag commit
      commitSha=$(git rev-list -n 1 "$tag" 2>/dev/null || echo "")
      if [[ -n "$commitSha" ]]; then
        bundlePath="$ARCHIVE_DIR/${baseName}.bundle"
        git bundle create "$bundlePath" "$commitSha" || true
        if [[ -s "$bundlePath" ]]; then
          gzip -f "$bundlePath"
          bundleGz="${bundlePath}.gz"
          sizeBytes=$(stat -c%s "$bundleGz" 2>/dev/null || echo 0)
            createdIso=$(git log -1 --format=%cI "$commitSha" 2>/dev/null || date -Iseconds)
          echo "{\n  \"type\": \"tag\", \"ref\": \"$tag\", \"sha\": \"$commitSha\", \"created\": \"$createdIso\", \"archivedAt\": \"$(date -Iseconds)\", \"file\": \"${bundleGz##$ARCHIVE_DIR/}\", \"sizeBytes\": $sizeBytes\n}" >> "$INDEX_TMP"
        fi
      fi
    fi
    git tag -d "$tag" || true
    git push origin ":refs/tags/$tag" || true
  fi
done

if [[ -n "$ARCHIVE_DIR" ]]; then
  # Build JSON index
  if [[ -s "$INDEX_TMP" ]]; then
    {
      echo "["; sed '$!s/$/,/' "$INDEX_TMP"; echo "]";
    } > "$INDEX_FILE"
  else
    echo "[]" > "$INDEX_FILE"
  fi
  echo "Archive index written to $INDEX_FILE"

  # Enforce max total size if requested
  if [[ "$MAX_SIZE_MB" != "0" ]]; then
    maxBytes=$(( MAX_SIZE_MB * 1024 * 1024 ))
    # Loop while size exceeds threshold
    while :; do
      total=$(find "$ARCHIVE_DIR" -maxdepth 1 -type f -name '*.bundle.gz' -printf '%s\n' 2>/dev/null | awk '{s+=$1} END{print s+0}')
      [[ -z "$total" ]] && total=0
      if (( total <= maxBytes )); then
        break
      fi
      oldest=$(ls -1t "$ARCHIVE_DIR"/*.bundle.gz 2>/dev/null | tail -n 1 || true)
      if [[ -z "$oldest" ]]; then
        break
      fi
      echo "[SIZE] Removing oldest archive $oldest to respect max ${MAX_SIZE_MB}MB"
      rm -f "$oldest"
      # Regenerate index quickly (remove entry referencing file)
      if [[ -f "$INDEX_FILE" ]]; then
        grep -v "$(basename "$oldest")" "$INDEX_FILE" | sed '/^\s*$/d' > "$INDEX_FILE.tmp" || true
        mv "$INDEX_FILE.tmp" "$INDEX_FILE" || true
      fi
    done
  fi
fi

echo "Prune complete."
