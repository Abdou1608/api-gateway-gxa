Param(
  [int]$Days = 30,
  [string]$Prefix = "backup"
)
$ErrorActionPreference = 'Stop'
Write-Host "Scanning for $Prefix branches/tags older than $Days days..."
$cutoff = (Get-Date).AddDays(-$Days)

# Branches
$branches = git for-each-ref --format="%(refname:short) %(creatordate:iso8601)" refs/heads/$Prefix/
foreach ($line in $branches) {
  if (-not $line) { continue }
  $parts = $line -split ' '
  $name = $parts[0]
  $date = Get-Date $parts[1]
  if ($date -lt $cutoff) {
    Write-Host "Deleting local branch $name (created $date)" -ForegroundColor Yellow
    git branch -D $name | Out-Null
    git push origin :$name | Out-Null
  }
}

# Tags
$tags = git for-each-ref --format="%(refname:short) %(creatordate:iso8601)" refs/tags/$Prefix-pre-push-
foreach ($line in $tags) {
  if (-not $line) { continue }
  $parts = $line -split ' '
  $tname = $parts[0]
  $date = Get-Date $parts[1]
  if ($date -lt $cutoff) {
    Write-Host "Deleting tag $tname (created $date)" -ForegroundColor Yellow
    git tag -d $tname | Out-Null
    git push origin :refs/tags/$tname | Out-Null
  }
}
Write-Host "Prune complete." -ForegroundColor Green
