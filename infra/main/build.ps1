# Builds a clean copy of the backend (no .env, no tests, production dependencies only).
$ErrorActionPreference = "Stop"
$root  = (Resolve-Path "$PSScriptRoot\..\..").Path
$build = Join-Path $PSScriptRoot "build"
$stage = Join-Path $build "staging"

if (Test-Path $build) { Remove-Item -Recurse -Force $build }
New-Item -ItemType Directory -Force $stage | Out-Null

robocopy "$root\backend" $stage /E /XD node_modules tests /XF ".env" ".env.*" "*.zip" "seedDestinations.js" "test-smtp.js" | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }

Push-Location $stage
try {
  npm ci --omit=dev
  if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
} finally {
  Pop-Location
}

if (Test-Path "$stage\.env") { throw ".env was copied into the build. Stop." }
Write-Host "Build ready: $stage" -ForegroundColor Green
