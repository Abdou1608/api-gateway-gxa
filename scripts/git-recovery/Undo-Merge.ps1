<#!
.SYNOPSIS
  Annule le dernier merge.
.DESCRIPTION
  Utilise git merge --abort si merge conflict en cours sinon reset vers commit parent.
#>
param(
  [switch]$DryRun
)

. "$PSScriptRoot/_helpers.ps1"
try { Assert-CleanWorktree } catch { exit 1 }

# Merge en cours ?
if (Test-Path .git\MERGE_HEAD) {
  Write-Host "[INFO] Merge en cours -> abort" -ForegroundColor Yellow
  if ($DryRun) { Write-Host "[DRYRUN] git merge --abort"; exit }
  git merge --abort
  exit
}

$lastCommit=$(git rev-parse HEAD)
$parents=(git rev-list --parents -n 1 HEAD)
$parts=$parents.Split(' ')
if ($parts.Length -gt 2) {
  $firstParent=$parts[1]
  Write-Host "[INFO] Dernier commit est un merge. HEAD=$lastCommit parent=$firstParent" -ForegroundColor Cyan
  if ($DryRun) { Write-Host "[DRYRUN] git reset --hard $firstParent"; exit }
  Read-Host "Confirmer reset HARD vers parent ($firstParent)? (Enter pour continuer)" | Out-Null
  git reset --hard $firstParent
  Write-Host "[DONE] Merge annulé." -ForegroundColor Green
} else {
  Write-Host "[INFO] Dernier commit n'est pas un merge (parents=$($parts.Length-1)). Rien à faire." -ForegroundColor Yellow
}
