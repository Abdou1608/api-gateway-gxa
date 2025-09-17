# Git Recovery Scripts

Scripts d'aide (PowerShell) pour annuler rapidement des opérations Git courantes.

## Scripts
| Action | Script | Usage rapide |
|--------|--------|-------------|
| Fetch (info) | `Undo-Fetch.ps1` | Ne change rien, affiche état local |
| Pull | `Undo-Pull.ps1` | `./Undo-Pull.ps1` (reset HEAD@{1}) |
| Merge | `Undo-Merge.ps1` | Annule merge en cours ou dernier merge |
| Rebase | `Undo-Rebase.ps1` | Abort si en cours, sinon reset via reflog |
| Push | `Undo-Push.ps1` | Reset local, option force-with-lease |

## Sécurité
- Utilise `git reset --hard` : sauvegardez vos changements (stash) avant.
- Pour réécrire le distant, le script utilise `--force-with-lease` (plus sûr que `--force`).

## Exemples
```powershell
# Annuler un pull (merge fast-forward)
./Undo-Pull.ps1

# Annuler un push et réécrire le distant
./Undo-Push.ps1 -ForceRemote

# Visualiser les entrées rebase et revenir
./Undo-Rebase.ps1

# Dry-run push undo
./Undo-Push.ps1 -DryRun
```

## Astuces
- `git reflog` est votre filet de sécurité.
- Ajustez la cible avec `-LocalRef HEAD@{2}` si nécessaire.

## Version Bash (optionnel futur)
Vous pouvez créer des équivalents `.sh` si besoin pour environnements non Windows.
