#!/bin/bash

# LearnMD SonarQube Scanner Script
# Usage: ./scripts/sonar-scan.sh [token] [host]

set -e

SONAR_TOKEN="${1:-}"
SONAR_HOST="${2:-http://localhost:9000}"

if [ -z "$SONAR_TOKEN" ]; then
    echo "Usage: ./scripts/sonar-scan.sh <token> [host]"
    echo ""
    echo "To get a token:"
    echo "1. Go to $SONAR_HOST"
    echo "2. Login and go to My Account > Security"
    echo "3. Generate a new token"
    exit 1
fi

echo "========================================"
echo "  LearnMD SonarQube Scanner"
echo "========================================"
echo ""
echo "Host: $SONAR_HOST"
echo "Token: ${SONAR_TOKEN:0:10}..."
echo ""

# Build first
echo "[1/3] Building project..."
pnpm build

# Run tests
echo "[2/3] Running tests..."
pnpm test || true

# Run scanner
echo "[3/3] Running SonarQube scanner..."

sonar-scanner \
  -Dsonar.projectKey=learnmd \
  -Dsonar.projectName=LearnMD \
  -Dsonar.host.url=$SONAR_HOST \
  -Dsonar.token=$SONAR_TOKEN \
  -Dsonar.sources=packages/core/src,packages/default-theme/src,packages/cli/src \
  -Dsonar.tests=packages/core/src \
  -Dsonar.test.inclusions=**/*.test.ts \
  -Dsonar.exclusions=**/*.test.ts,**/dist/**,**/node_modules/**,**/*.md,**/node_modules/**/*

echo ""
echo "========================================"
echo "  Analysis complete!"
echo "  View results at: $SONAR_HOST/dashboard?id=learnmd"
echo "========================================"
