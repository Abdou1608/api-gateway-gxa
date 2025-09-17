<#!
.SYNOPSIS
  Annule un push récent (local et/ou distant).
.DESCRIPTION
  - Reset local sur reflog
  - Force-push optionnel pour réécrire distant
#>
param(
  [string]$LocalRef = "HEAD@{1}",
  [switch]$ForceRemote,
  [string]$Branch = $(git rev-parse --abbrev-ref HEAD),
  [switch]$DryRun
)

. "$PSScriptRoot/_helpers.ps1"
try { Assert-CleanWorktree } catch { exit 1 }

Write-Host "[INFO] Reflog récent:" -ForegroundColor Cyan
git reflog -n 8
Write-Host "[INFO] Restauration locale vers $LocalRef" -ForegroundColor Yellow
if ($DryRun) { Write-Host "[DRYRUN] git reset --hard $LocalRef"; if ($ForceRemote){ Write-Host "[DRYRUN] git push --force-with-lease origin $Branch"}; exit }

Read-Host "Confirmer reset HARD local vers $LocalRef ? (Enter)" | Out-Null
git reset --hard $LocalRef

if ($ForceRemote) {
  Read-Host "Confirmer réécriture distante (--force-with-lease) ? (Enter)" | Out-Null
  git push --force-with-lease origin $Branch
  Write-Host "[DONE] Push distant réécrit." -ForegroundColor Green
} else {
  Write-Host "[INFO] Distant intact (utiliser -ForceRemote pour réécrire)." -ForegroundColor Cyan
}
