#!/usr/bin/env bash
set -euo pipefail
name=${1:-backup-$(date +%Y%m%d-%H%M%S)}
if git rev-parse -q --verify "refs/tags/$name" >/dev/null; then
  echo "[ERR] Tag existe déjà" >&2; exit 1; fi
git tag "$name"
echo "[DONE] Tag $name créé sur $(git rev-parse --short HEAD)" >&2
