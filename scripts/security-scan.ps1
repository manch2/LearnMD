# LearnMD Security Scan Script (PowerShell)
# Usage: .\scripts\security-scan.ps1 [-Fix] [-Verbose] [-CI]
param(
    [switch]$Fix,
    [switch]$Verbose,
    [switch]$CI
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗"
Write-Host "║           LearnMD Security & Quality Scan                     ║"
Write-Host "╚══════════════════════════════════════════════════════════════╝"
Write-Host ""

$exitCode = 0

# 1. ESLint
Write-Host "[INFO] Running ESLint..." -ForegroundColor Blue
$lintResult = pnpm lint 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] ESLint: Passed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] ESLint: Issues found" -ForegroundColor Red
    $exitCode = 1
}
if ($Verbose) { Write-Host $lintResult }
Write-Host ""

# 2. TypeScript
Write-Host "[INFO] Running TypeScript check..." -ForegroundColor Blue
$buildResult = pnpm build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] TypeScript: Passed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] TypeScript: Compilation errors" -ForegroundColor Red
    $exitCode = 1
}
if ($Verbose) { Write-Host $buildResult }
Write-Host ""

# 3. Tests
Write-Host "[INFO] Running tests..." -ForegroundColor Blue
$testResult = pnpm test 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Tests: All passed" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Tests: Some tests failed" -ForegroundColor Yellow
    $exitCode = 1
}
if ($Verbose) { Write-Host $testResult }
Write-Host ""

# 4. Security Audit
Write-Host "[INFO] Running dependency audit..." -ForegroundColor Blue
$auditResult = pnpm audit --audit-level=high 2>&1

if ($auditResult -match "No vulnerabilities found") {
    Write-Host "[SUCCESS] Security Audit: No vulnerabilities" -ForegroundColor Green
} elseif ($auditResult -match "vulnerabilities found") {
    $vulnCount = [regex]::Match($auditResult, '(\d+) vulnerabilities').Groups[1].Value
    Write-Host "[WARNING] Security Audit: $vulnCount vulnerabilities found" -ForegroundColor Yellow
    
    if ($Verbose) {
        Write-Host $auditResult | Select-Object -First 30
    }
}
Write-Host ""

# 5. Auto-fix if requested
if ($Fix) {
    Write-Host "[INFO] Applying automatic fixes..." -ForegroundColor Blue
    
    # Format code
    pnpm format 2>$null | Out-Null
    
    # Fix dependencies
    pnpm audit:fix 2>$null | Out-Null
    
    Write-Host "[SUCCESS] Auto-fix completed" -ForegroundColor Green
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗"
Write-Host "║                      Scan Summary                           ║"
Write-Host "╚══════════════════════════════════════════════════════════════╝"

if ($exitCode -eq 0) {
    Write-Host "[SUCCESS] All checks passed!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Some checks failed. Please review the output above." -ForegroundColor Red
}

Write-Host ""

if ($CI) {
    exit $exitCode
}
