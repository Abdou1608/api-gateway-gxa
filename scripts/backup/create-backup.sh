#!/usr/bin/env bash
set -euo pipefail
PREFIX="${1:-backup}"
TS="$(date +%Y%m%d-%H%M)"
BASE_BRANCH="${PREFIX}/${TS}"
BRANCH="$BASE_BRANCH"
i=1
while git rev-parse --verify "$BRANCH" >/dev/null 2>&1; do
  BRANCH="${BASE_BRANCH}-${i}"; i=$((i+1));
done
BASE_TAG="${PREFIX}-pre-push-${TS}"
TAG="$BASE_TAG"
j=1
while git rev-parse -q --verify "refs/tags/$TAG" >/dev/null 2>&1; do
  TAG="${BASE_TAG}-${j}"; j=$((j+1));
done

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
