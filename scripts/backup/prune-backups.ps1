Param(
  [int]$Days = 30,
  [string]$Prefix = "backup",
  [int]$Protect = 5,
  [string]$ArchiveDir = '',
  [int]$MaxTotalSizeMB = 0
)
$ErrorActionPreference = 'Stop'
Write-Host "Scanning for $Prefix branches/tags older than $Days days... (protect last $Protect)"
if ($ArchiveDir) { New-Item -ItemType Directory -Force -Path $ArchiveDir | Out-Null }
$indexFile = if ($ArchiveDir) { Join-Path $ArchiveDir 'index.json' } else { $null }
$indexEntries = @()
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
      try {
        $bundleBase = $name.Replace('/', '_') + '.bundle'
        $bundlePath = Join-Path $ArchiveDir $bundleBase
        git bundle create $bundlePath $name | Out-Null
        if (Test-Path $bundlePath) {
          # Compress bundle
          $gzPath = $bundlePath + '.gz'
          if (Test-Path $gzPath) { Remove-Item $gzPath -Force }
          Compress-Archive -Path $bundlePath -DestinationPath ($bundlePath + '.zip') -Force | Out-Null
          # Use gzip style naming by renaming .zip to .bundle.gz for simplicity
          $zipPath = $bundlePath + '.zip'
          if (Test-Path $zipPath) { Rename-Item $zipPath ($bundlePath + '.gz') -Force }
          Remove-Item $bundlePath -Force
          $final = $bundlePath + '.gz'
          $size = (Get-Item $final).Length
          $sha = (git rev-parse $name) 2>$null
          $createdIso = (git log -1 --format=%cI $name) 2>$null
          $entry = [pscustomobject]@{ type='branch'; ref=$name; sha=$sha; created=$createdIso; archivedAt=(Get-Date).ToString('o'); file=[IO.Path]::GetFileName($final); sizeBytes=$size }
          $indexEntries += $entry
        }
      } catch {}
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
if ($indexFile -and $indexEntries.Count -gt 0) {
  $indexEntries | ConvertTo-Json -Depth 4 | Out-File -FilePath $indexFile -Encoding UTF8
  Write-Host "Archive index written to $indexFile" -ForegroundColor Cyan
}

if ($ArchiveDir -and $MaxTotalSizeMB -gt 0) {
  $maxBytes = $MaxTotalSizeMB * 1024 * 1024
  while ($true) {
    $files = Get-ChildItem $ArchiveDir -Filter *.bundle.gz -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime
    if (-not $files) { break }
    $total = ($files | Measure-Object Length -Sum).Sum
    if ($total -le $maxBytes) { break }
    $oldest = $files[0]
    Write-Host "[SIZE] Removing oldest archive $($oldest.Name) to respect max ${MaxTotalSizeMB}MB" -ForegroundColor Yellow
    Remove-Item $oldest.FullName -Force
    if (Test-Path $indexFile) {
      try {
        $json = Get-Content $indexFile -Raw | ConvertFrom-Json
        $filtered = $json | Where-Object { $_.file -ne $oldest.Name }
        $filtered | ConvertTo-Json -Depth 4 | Out-File -FilePath $indexFile -Encoding UTF8
      } catch {}
    }
  }
}

Write-Host "Prune complete." -ForegroundColor Green
