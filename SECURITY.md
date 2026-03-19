# LearnMD Security & Code Quality Tools

This document describes the security and code quality tools integrated into LearnMD.

## Available Tools

### 1. ESLint (Code Quality & Security)

ESLint is already configured with security plugins for static code analysis.

```bash
# Run linting
pnpm lint

# Run with security rules
pnpm lint:security
```

### 2. Dependency Audit

Scans for vulnerabilities in npm/pnpm dependencies.

```bash
# Audit dependencies
pnpm audit

# Auto-fix vulnerabilities
pnpm audit:fix
```

### 3. Full Security Scan

Run all security checks at once:

```bash
pnpm scan
```

### 4. SonarQube (Optional - Requires Docker)

SonarQube provides comprehensive code analysis including:

- Code smells
- Bugs
- Security vulnerabilities
- Code coverage
- Duplications

#### Option A: Docker (Recommended)

```bash
# Start SonarQube server
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Generate token at http://localhost:9000

# Run scanner
sonar-scanner \
  -Dsonar.projectKey=learnmd \
  -Dsonar.sources=packages \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_TOKEN
```

#### Option B: SonarCloud (Free for Open Source)

Free for public GitHub/GitLab/Bitbucket repositories:

1. Go to https://sonarcloud.io
2. Import your repository
3. Automatic analysis will begin

#### Option C: SonarScanner CLI

```bash
# Download from https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

sonar-scanner \
  -Dsonar.projectKey=learnmd \
  -Dsonar.sources=packages/core/src,packages/default-theme/src,packages/cli/src \
  -Dsonar.exclusions=**/*.test.ts,**/dist/**
```

### 5. GitHub CodeQL (Free for Public Repos)

Automatically runs on GitHub Actions for security analysis.

## CI/CD Integration

The project includes GitHub Actions workflows with:

- Linting
- Security audit
- Unit tests
- Build verification

See `.github/workflows/ci.yml` for details.

## Best Practices

1. **Run security scans before commits:**

   ```bash
   pnpm scan
   ```

2. **Fix vulnerabilities regularly:**

   ```bash
   pnpm audit:fix
   ```

3. **Use SonarQube locally during development:**

   ```bash
   docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
   ```

4. **Enable GitHub Dependabot** for automatic dependency updates:
   Add to `.github/dependabot.yml`

## Additional Tools to Consider

- **Snyk** - `npm install -g snyk && snyk test`
- **npm audit** - Built-in
- **David** - Dependency monitoring
- **Greenkeeper** - Automated dependency updates

## Security Policy

If you find a security vulnerability, please:

1. DO NOT open a public issue
2. Email the maintainers directly
3. Wait for a fix before disclosure

## Reports

Security scan reports are generated in:

- ESLint: Terminal output
- Audit: `pnpm audit` output
- SonarQube: Web UI at http://localhost:9000
