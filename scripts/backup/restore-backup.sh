#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 2 ]]; then
  echo "Usage: restore-backup.sh <bundle-file(.bundle.gz|.bundle|.zip)> <new-branch-name>" >&2
  exit 1
fi
BUNDLE="$1"
TARGET_BRANCH="$2"
if [[ ! -f "$BUNDLE" ]]; then
  echo "Bundle file not found: $BUNDLE" >&2
  exit 1
fi
WORKDIR=$(mktemp -d)
cp "$BUNDLE" "$WORKDIR/" || true
pushd "$WORKDIR" >/dev/null
NAME=$(basename "$BUNDLE")
if [[ "$NAME" == *.gz ]]; then
  gunzip "$NAME"
  NAME="${NAME%.gz}"
fi
if [[ "$NAME" == *.zip ]]; then
  unzip -q "$NAME"
  NAME="${NAME%.zip}"
fi
if [[ ! -f "$NAME" ]]; then
  echo "Could not extract bundle core file ($NAME)" >&2
  exit 1
fi
git bundle verify "$NAME" || echo "Warning: bundle verify produced warnings"
# Create branch from bundle
REMOTE_REF=$(git ls-remote "$NAME" | head -n1 | cut -f2)
if [[ -z "$REMOTE_REF" ]]; then
  echo "No refs found inside bundle." >&2
  exit 1
fi
git fetch "$NAME" "$REMOTE_REF":"refs/heads/${TARGET_BRANCH}" || {
  echo "Fetch from bundle failed" >&2; exit 1; }
popd >/dev/null
git checkout "$TARGET_BRANCH"
echo "Restored branch $TARGET_BRANCH from $BUNDLE"
