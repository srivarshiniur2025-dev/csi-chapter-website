# Save all changes and push to GitHub (works even if `git` is not on PATH).
# Usage: .\scripts\git-push.ps1 -Message "Describe your change"

param(
  [Parameter(Mandatory = $true)]
  [string]$Message
)

$gitDir = "C:\Program Files\Git\bin"
$git = Join-Path $gitDir "git.exe"
$env:Path = "$gitDir;$env:Path"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

if (-not (Test-Path (Join-Path $root ".git"))) {
  Write-Error "Not a git repo. This script must run from csi-student-web-master."
  exit 1
}

& $git add -A
& $git -c user.name="Srivarshini UR" -c user.email="srivarshiniur2025-dev@users.noreply.github.com" commit -m $Message
if ($LASTEXITCODE -ne 0) {
  Write-Host "Nothing to commit, or commit failed."
  exit $LASTEXITCODE
}

& $git push origin main
if ($LASTEXITCODE -eq 0) {
  Write-Host "Pushed to GitHub. Vercel should redeploy in 1-2 minutes."
}
