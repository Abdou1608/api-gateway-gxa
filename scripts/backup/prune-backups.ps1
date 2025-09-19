Param(
  [int]$Days = 30,
  [string]$Prefix = "backup",
  [int]$Protect = 5,
  [string]$ArchiveDir = ''
)
$ErrorActionPreference = 'Stop'
Write-Host "Scanning for $Prefix branches/tags older than $Days days... (protect last $Protect)"
if ($ArchiveDir) { New-Item -ItemType Directory -Force -Path $ArchiveDir | Out-Null }
$cutoff = (Get-Date).AddDays(-$Days)

# Branches (sorted by date)
$branches = git for-each-ref --format="%(refname:short) %(creatordate:iso8601)" refs/heads/$Prefix/ | Sort-Object { ($_ -split ' ')[1] }
$totalBranches = ($branches | Measure-Object).Count
$keepBranchIndex = $totalBranches - $Protect
if ($keepBranchIndex -lt 0) { $keepBranchIndex = 0 }
$idx = 0
foreach ($line in $branches) {
  if (-not $line) { continue }
  $parts = $line -split ' '
  $name = $parts[0]
  $date = Get-Date $parts[1]
  if ($idx -lt $keepBranchIndex -and $date -lt $cutoff) {
    Write-Host "Deleting local branch $name (created $date)" -ForegroundColor Yellow
    if ($ArchiveDir) {
      try { git bundle create (Join-Path $ArchiveDir ("${name.Replace('/', '_')}.bundle")) $name | Out-Null } catch { }
    }
    git branch -D $name | Out-Null
    git push origin :$name | Out-Null
  }
  $idx++
}

# Tags (sorted by date)
$tags = git for-each-ref --format="%(refname:short) %(creatordate:iso8601)" refs/tags/$Prefix-pre-push- | Sort-Object { ($_ -split ' ')[1] }
$totalTags = ($tags | Measure-Object).Count
$keepTagIndex = $totalTags - $Protect
if ($keepTagIndex -lt 0) { $keepTagIndex = 0 }
$j = 0
foreach ($line in $tags) {
  if (-not $line) { continue }
  $parts = $line -split ' '
  $tname = $parts[0]
  $date = Get-Date $parts[1]
  if ($j -lt $keepTagIndex -and $date -lt $cutoff) {
    Write-Host "Deleting tag $tname (created $date)" -ForegroundColor Yellow
    git tag -d $tname | Out-Null
    git push origin :refs/tags/$tname | Out-Null
  }
  $j++
}
Write-Host "Prune complete." -ForegroundColor Green
