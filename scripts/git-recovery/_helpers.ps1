function Show-Reflog {
  param([int]$Count=12)
  git reflog -n $Count | ForEach-Object { $_ }
}

function Assert-CleanWorktree {
  $status = git status --porcelain
  if ($status) {
    Write-Host "[ABORT] Worktree non propre. Commit / stash avant d'annuler." -ForegroundColor Red
    throw "Worktree not clean"
  }
}

Export-ModuleMember -Function Show-Reflog,Assert-CleanWorktree
