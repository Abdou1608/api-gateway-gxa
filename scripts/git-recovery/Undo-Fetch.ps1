<#!
.SYNOPSIS
  Affiche l'état après un git fetch et propose de revenir sur une ref locale précédente.
.DESCRIPTION
  fetch ne modifie pas HEAD mais met à jour les refs distantes. On propose ici:
  - Afficher les branches locales et leur upstream
  - Optionnellement réinitialiser origin/<branch> à un commit précédent (force-push nécessaire)
#>
param(
  [string]$Branch = $(git rev-parse --abbrev-ref HEAD)
)

Write-Host "[INFO] Fetch distant refs..." -ForegroundColor Cyan

git fetch --all --prune

Write-Host "[INFO] Aucune modification HEAD locale par fetch. Rien à annuler côté local." -ForegroundColor Yellow
Write-Host "[HINT] Pour annuler un fetch côté remote, il faut réécrire l'historique distant avec git push --force sur une ref antérieure." -ForegroundColor DarkGray

git log --oneline -n 5 "$Branch"
