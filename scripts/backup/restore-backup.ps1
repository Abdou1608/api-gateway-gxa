Param(
  [Parameter(Mandatory=$true)][string]$Bundle,
  [Parameter(Mandatory=$true)][string]$NewBranch
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path $Bundle)) { Write-Error "Bundle not found: $Bundle"; exit 1 }
$work = New-Item -ItemType Directory -Path ([System.IO.Path]::GetTempPath()) -Name ("restore_" + [System.Guid]::NewGuid())
Copy-Item $Bundle -Destination $work
Push-Location $work
$name = Split-Path $Bundle -Leaf
if ($name.EndsWith('.gz')) { gunzip $name; $name = $name.Substring(0,$name.Length-3) }
if ($name.EndsWith('.zip')) { Expand-Archive -LiteralPath $name -DestinationPath . -Force; $name = $name.Substring(0,$name.Length-4) }
if (-not (Test-Path $name)) { Write-Error "Bundle core file missing: $name"; exit 1 }
& git bundle verify $name | Out-Null
$remoteRef = (& git ls-remote $name | Select-Object -First 1) -split '\t' | Select-Object -First 1
if (-not $remoteRef) { Write-Error "No refs in bundle"; exit 1 }
& git fetch $name "${remoteRef}:refs/heads/$NewBranch" | Out-Null
Pop-Location
& git checkout $NewBranch
Write-Host "Restored branch $NewBranch from $Bundle" -ForegroundColor Green
