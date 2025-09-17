function Show-Reflog {
  param([int]$Count=12)
  git reflog -n $Count | ForEach-Object { $_ }
}

Export-ModuleMember -Function Show-Reflog
