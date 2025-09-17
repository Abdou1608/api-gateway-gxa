<#!
.SYNOPSIS
  Annule un git pull (merge ou rebase) récent.
.DESCRIPTION
  Utilise le reflog pour revenir à l'état avant le pull.
#>
param(
  [string]$TargetRef = "HEAD@{1}",
  [switch]$DryRun
)

. "$PSScriptRoot/_helpers.ps1"
try { Assert-CleanWorktree } catch { exit 1 }

Write-Host "[INFO] Reflog récent:" -ForegroundColor Cyan
git reflog -n 10

Write-Host "[INFO] Cible de restauration: $TargetRef" -ForegroundColor Yellow
if ($DryRun) { Write-Host "[DRYRUN] git reset --hard $TargetRef"; exit }

Read-Host "Confirmer reset HARD vers $TargetRef ? (Ctrl+C pour annuler, Enter pour continuer)" | Out-Null
git reset --hard $TargetRef
Write-Host "[DONE] Pull annulé." -ForegroundColor Green
