# Push local commits to your GitHub repository.
# Usage: .\scripts\push-to-github.ps1 -RepoUrl "https://github.com/YOUR_USER/YOUR_REPO.git"

param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl
)

$git = "C:\Program Files\Git\bin\git.exe"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root

& $git remote remove origin 2>$null
& $git remote add origin $RepoUrl
& $git branch -M main
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
  Write-Host "Pushed to $RepoUrl"
} else {
  Write-Host "Push failed. Run: gh auth login   (or sign in when Git prompts for credentials)"
}
