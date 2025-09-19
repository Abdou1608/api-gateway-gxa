Param(
  [string]$Prefix = "backup"
)

$ErrorActionPreference = 'Stop'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmm'
$branch = "${Prefix}/$timestamp"

Write-Host "Creating backup branch $branch"

# Ensure working tree clean
$changes = git status --porcelain
if ($changes) {
  Write-Host "Uncommitted changes detected. Commit or stash before running the backup script." -ForegroundColor Yellow
  exit 1
}

# Create branch from HEAD
git branch $branch
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Create tag (standardized name)
$tag = "${Prefix}-pre-push-$timestamp"
Write-Host "Creating tag $tag"

git tag $tag
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Pushing $branch and tag $tag"
# Push branch & tag (skip hooks intentionally optional via --no-verify flag param later if desired)
try {
  git push origin $branch
  git push origin $tag
}
catch {
  Write-Host "Push failed: $_" -ForegroundColor Red
  exit 1
}

Write-Host "Backup complete: branch=$branch tag=$tag" -ForegroundColor Green
