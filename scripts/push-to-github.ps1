# Push local commits to your GitHub repository.
# Usage: .\scripts\push-to-github.ps1 -RepoUrl "https://github.com/YOUR_USER/YOUR_REPO.git"

param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl
)

$git = "C:\Program Files\Git\bin\git.exe"
# Repo root is the parent of /scripts (csi-student-web-master)
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

if (-not (Test-Path (Join-Path $root ".git"))) {
  Write-Error "No .git folder here. Run from csi-student-web-master, not the parent 'csi website' folder."
  exit 1
}

& $git remote remove origin 2>$null
& $git remote add origin $RepoUrl
& $git branch -M main
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
  Write-Host "Pushed to $RepoUrl"
} else {
  Write-Host "Push failed. Run: gh auth login   (or sign in when Git prompts for credentials)"
}
