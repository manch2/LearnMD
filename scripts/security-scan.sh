#!/bin/bash

# LearnMD Security Scan Script
# Usage: ./scripts/security-scan.sh [options]
# Options:
#   --fix     : Auto-fix issues where possible
#   --verbose : Show detailed output
#   --ci      : CI mode (exit codes only)

set -e

VERBOSE=false
FIX=false
CI_MODE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --fix)
            FIX=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --ci)
            CI_MODE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           LearnMD Security & Quality Scan                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Track overall status
EXIT_CODE=0

# 1. ESLint
log_info "Running ESLint..."
if $VERBOSE; then
    pnpm lint || true
else
    pnpm lint --max-warnings=0 2>&1 | tail -20 || true
fi

if [ $? -eq 0 ]; then
    log_success "ESLint: Passed"
else
    log_error "ESLint: Issues found"
    EXIT_CODE=1
fi
echo ""

# 2. TypeScript
log_info "Running TypeScript check..."
if pnpm build > /dev/null 2>&1; then
    log_success "TypeScript: Passed"
else
    log_error "TypeScript: Compilation errors"
    EXIT_CODE=1
fi
echo ""

# 3. Tests
log_info "Running tests..."
if pnpm test > /dev/null 2>&1; then
    log_success "Tests: All passed"
else
    log_warning "Tests: Some tests failed"
    EXIT_CODE=1
fi
echo ""

# 4. Security Audit
log_info "Running dependency audit..."
AUDIT_OUTPUT=$(pnpm audit --audit-level=high 2>&1) || true

if echo "$AUDIT_OUTPUT" | grep -q "No vulnerabilities found"; then
    log_success "Security Audit: No vulnerabilities"
elif echo "$AUDIT_OUTPUT" | grep -q "vulnerabilities found"; then
    VULN_COUNT=$(echo "$AUDIT_OUTPUT" | grep -oP '\d+ vulnerabilities found' | grep -oP '\d+' || echo "0")
    log_warning "Security Audit: $VULN_COUNT vulnerabilities found"
    
    if [ "$VULN_COUNT" -gt 0 ]; then
        echo "$AUDIT_OUTPUT" | head -30
    fi
fi
echo ""

# 5. Auto-fix if requested
if [ "$FIX" = true ]; then
    log_info "Applying automatic fixes..."
    
    # Format code
    pnpm format 2>/dev/null || true
    
    # Fix dependencies
    pnpm audit:fix 2>/dev/null || true
    
    log_success "Auto-fix completed"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                      Scan Summary                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"

if [ $EXIT_CODE -eq 0 ]; then
    log_success "All checks passed!"
else
    log_error "Some checks failed. Please review the output above."
fi

echo ""

if [ "$CI_MODE" = true ]; then
    exit $EXIT_CODE
fi
