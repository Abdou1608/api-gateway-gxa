# Git Recovery Scripts

Scripts d'aide (PowerShell) pour annuler rapidement des opérations Git courantes.

## Scripts PowerShell
| Action | Script | Usage rapide |
|--------|--------|-------------|
| Fetch (info) | `Undo-Fetch.ps1` | Ne change rien, affiche état local |
| Pull | `Undo-Pull.ps1` | `./Undo-Pull.ps1` (reset HEAD@{1}) |
| Merge | `Undo-Merge.ps1` | Annule merge en cours ou dernier merge |
| Rebase | `Undo-Rebase.ps1` | Abort si en cours, sinon reset via reflog |
| Push | `Undo-Push.ps1` | Reset local, option force-with-lease |

## Scripts Bash
| Action | Script | Usage rapide |
|--------|--------|-------------|
| Fetch (info) | `undo-fetch.sh` | `bash undo-fetch.sh` |
| Pull | `undo-pull.sh` | `bash undo-pull.sh` |
| Merge | `undo-merge.sh` | `bash undo-merge.sh` |
| Rebase | `undo-rebase.sh` | `bash undo-rebase.sh` |
| Push | `undo-push.sh` | `FORCE_REMOTE=true bash undo-push.sh` |
| Backup Tag | `create-backup-tag.sh` | `bash create-backup-tag.sh` |
| Menu interactif | `recovery-menu.sh` | `bash recovery-menu.sh` |

## Menu Interactif
```bash
bash scripts/git-recovery/recovery-menu.sh
```
Permet de lancer les actions sans mémoriser les commandes.

## Alias Git (Bash)
Installation:
```bash
bash scripts/git-recovery/add-git-undo-aliases.sh
```
Exemples ensuite:
```bash
git undo-pull
git undo-push
git recovery-menu
```

## Tag de sauvegarde avant reset
Les scripts `undo-push.sh` proposent la création d'un tag automatique. Sinon:
```bash
bash scripts/git-recovery/create-backup-tag.sh
```

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

Version Bash:
```bash
./scripts/git-recovery/undo-pull.sh
FORCE_REMOTE=true ./scripts/git-recovery/undo-push.sh
```

## Astuces
- `git reflog` est votre filet de sécurité.
- Ajustez la cible avec `-LocalRef HEAD@{2}` si nécessaire.

## Version Bash (optionnel futur)
Vous pouvez créer des équivalents `.sh` si besoin pour environnements non Windows.
