<#!
.SYNOPSIS
  Annule un rebase en cours ou terminé.
.DESCRIPTION
  - Si rebase en cours: git rebase --abort
  - Sinon: sélection d'un point reflog avant rebase pour reset
#>
param(
  [switch]$AbortOnly,
  [switch]$DryRun
)

if (Test-Path .git\rebase-merge -or Test-Path .git\rebase-apply) {
  if ($AbortOnly) { git rebase --abort; exit }
  Write-Host "[INFO] Rebase en cours détecté -> abort" -ForegroundColor Yellow
  git rebase --abort
  exit
}

Write-Host "[INFO] Aucun rebase en cours. Liste des entrées reflog suspects (rebase):" -ForegroundColor Cyan
$rebaseEntries = git reflog | Select-String -Pattern 'rebase' | Select-Object -First 5
$rebaseEntries | ForEach-Object { $_.Line }

if (-not $rebaseEntries) { Write-Host "[WARN] Aucune entrée rebase trouvée dans reflog récent." -ForegroundColor Yellow; exit }

$choice = Read-Host "Entrer l'index reflog (ex: HEAD@{3}) pour reset hard"
if ([string]::IsNullOrWhiteSpace($choice)) { Write-Host "Annulé"; exit }

if ($DryRun) { Write-Host "[DRYRUN] git reset --hard $choice"; exit }

git reset --hard $choice
Write-Host "[DONE] Rebase annulé et HEAD restauré." -ForegroundColor Green
