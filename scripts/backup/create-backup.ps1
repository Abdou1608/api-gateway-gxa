Param(
  [string]$Prefix = "backup"
)

$ErrorActionPreference = 'Stop'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmm'
$baseBranch = "${Prefix}/$timestamp"
$branch = $baseBranch
$i = 1
while (git rev-parse -q --verify "refs/heads/$branch") {
  $branch = "$baseBranch-$i"
  $i += 1
}

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
$baseTag = "${Prefix}-pre-push-$timestamp"
$tag = $baseTag
$j = 1
while (git rev-parse -q --verify "refs/tags/$tag") {
  $tag = "$baseTag-$j"
  $j += 1
}
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
