#!/usr/bin/env bash
set -euo pipefail
PREFIX="${1:-backup}"
TS="$(date +%Y%m%d-%H%M)"
BRANCH="${PREFIX}/${TS}"
TAG="${PREFIX}-pre-push-${TS}"

if [[ -n $(git status --porcelain) ]]; then
  echo "Uncommitted changes present. Commit/stash before backup." >&2
  exit 1
fi

echo "Creating branch $BRANCH"
git branch "$BRANCH"

echo "Tagging commit with $TAG"
git tag "$TAG"

echo "Pushing branch and tag"
git push origin "$BRANCH"
git push origin "$TAG"

echo "Backup complete: branch=$BRANCH tag=$TAG"
