# LearnMD Scripts

This directory contains scripts for security scanning and code quality checks.

## Available Scripts

### security-scan.ps1 (Windows) / security-scan.sh (Linux/Mac)

Comprehensive security and quality scan for the LearnMD project.

#### Windows

```powershell
.\scripts\security-scan.ps1
```

#### Linux/Mac

```bash
./scripts/security-scan.sh
```

#### Options

- `-Fix` / `--fix`: Apply automatic fixes where possible
- `-Verbose` / `--verbose`: Show detailed output
- `-CI` / `--ci`: Exit with appropriate code (for CI/CD)

#### Examples

```powershell
# Run full scan with verbose output
.\scripts\security-scan.ps1 -Verbose

# Auto-fix issues
.\scripts\security-scan.ps1 -Fix

# CI mode
.\scripts\security-scan.ps1 -CI
```

## SonarQube Setup

### Option 1: Docker (Recommended)

```powershell
# Start SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# Wait for startup (about 1-2 minutes)
# Then visit http://localhost:9000
# Default credentials: admin/admin

# Generate token at http://localhost:9000/account/security/
```

### Option 2: SonarCloud (For GitHub repos)

1. Go to https://sonarcloud.io
2. Import your GitHub repository
3. Add `SONAR_TOKEN` to GitHub secrets
4. Workflow `.github/workflows/quality.yml` runs automatically

## Integration with CI/CD

The security scan is integrated into GitHub Actions:

- `.github/workflows/ci.yml` - Runs lint, tests, and security audit
- `.github/workflows/quality.yml` - Runs SonarCloud analysis

## Manual Commands

### ESLint

```bash
pnpm lint
pnpm lint:security  # Security rules only
```

### Dependency Audit

```bash
pnpm audit           # Check vulnerabilities
pnpm audit:fix       # Auto-fix vulnerabilities
```

### Full Scan

```bash
pnpm scan            # lint + audit + test
```
