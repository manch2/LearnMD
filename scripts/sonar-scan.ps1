# LearnMD SonarQube Scanner Script
# Usage: .\scripts\sonar-scan.ps1 -Token "your-token" [-Host "http://localhost:9000"]

param(
    [Parameter(Mandatory=$true)]
    [string]$Token,
    
    [string]$HostUrl = "http://localhost:9000"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LearnMD SonarQube Scanner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Host: $HostUrl"
Write-Host "Token: $($Token.Substring(0, [Math]::Min(10, $Token.Length)))..."
Write-Host ""

# Build first
Write-Host "[1/3] Building project..." -ForegroundColor Yellow
pnpm build

# Run tests
Write-Host "[2/3] Running tests..." -ForegroundColor Yellow
pnpm test 2>$null

# Run scanner
Write-Host "[3/3] Running SonarQube scanner..." -ForegroundColor Yellow

$scannerArgs = @(
    "-Dsonar.projectKey=learnmd",
    "-Dsonar.projectName=LearnMD",
    "-Dsonar.host.url=$HostUrl",
    "-Dsonar.token=$Token",
    "-Dsonar.sources=packages/core/src,packages/default-theme/src,packages/cli/src",
    "-Dsonar.tests=packages/core/src",
    "-Dsonar.test.inclusions=**/*.test.ts",
    "-Dsonar.exclusions=**/*.test.ts,**/dist/**,**/node_modules/**,**/*.md"
)

# Check if sonar-scanner is installed
$scanner = Get-Command sonar-scanner -ErrorAction SilentlyContinue

if (-not $scanner) {
    Write-Host ""
    Write-Host "ERROR: sonar-scanner not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install it from: https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use Docker:" -ForegroundColor Yellow
    Write-Host "  docker run --rm -v `"${PWD}:/usr/src`" sonarsource/sonar-scanner-cli" -ForegroundColor Gray
    exit 1
}

& sonar-scanner $scannerArgs

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Analysis complete!" -ForegroundColor Green
Write-Host "  View results at: $HostUrl/dashboard?id=learnmd" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
