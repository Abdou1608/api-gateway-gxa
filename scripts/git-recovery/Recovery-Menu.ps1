<#!
.SYNOPSIS
  Menu interactif PowerShell pour scripts de récupération Git.
#>
function Show-Menu {
  Write-Host "==== Git Recovery Menu (PowerShell) ====" -ForegroundColor Cyan
  Write-Host "1) Undo Fetch (info)"
  Write-Host "2) Undo Pull"
  Write-Host "3) Undo Merge"
  Write-Host "4) Undo Rebase"
  Write-Host "5) Undo Push"
  Write-Host "6) Create Backup Tag"
  Write-Host "Q) Quit"
}

function Invoke-UndoFetch { & "$PSScriptRoot/Undo-Fetch.ps1" }
function Invoke-UndoPull { & "$PSScriptRoot/Undo-Pull.ps1" }
function Invoke-UndoMerge { & "$PSScriptRoot/Undo-Merge.ps1" }
function Invoke-UndoRebase { & "$PSScriptRoot/Undo-Rebase.ps1" }
function Invoke-UndoPush { & "$PSScriptRoot/Undo-Push.ps1" }
function Invoke-BackupTag {
  $tag = "backup-" + (Get-Date -Format 'yyyyMMdd-HHmmss')
  git tag $tag
  Write-Host "[DONE] Tag $tag créé." -ForegroundColor Green
}

while ($true) {
  Show-Menu
  $choice = Read-Host "Choix"
  switch ($choice) {
    '1' { Invoke-UndoFetch }
    '2' { Invoke-UndoPull }
    '3' { Invoke-UndoMerge }
    '4' { Invoke-UndoRebase }
    '5' { Invoke-UndoPush }
    '6' { Invoke-BackupTag }
    'q' { break }
    'Q' { break }
    default { Write-Host "Choix invalide" -ForegroundColor Yellow }
  }
  Write-Host "---" -ForegroundColor DarkGray
}
