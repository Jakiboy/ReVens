#!/bin/bash

echo "============================================"
echo "ReVens Tauri - Setup Verification"
echo "============================================"
echo ""

SUCCESS_COUNT=0
TOTAL_CHECKS=8

# Check 1: Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    echo "✅ Found ($(node --version))"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found"
fi

# Check 2: npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    echo "✅ Found ($(npm --version))"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found"
fi

# Check 3: Rust
echo -n "Checking Rust... "
if command -v rustc &> /dev/null; then
    echo "✅ Found ($(rustc --version))"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found - Install from https://rustup.rs/"
fi

# Check 4: Cargo
echo -n "Checking Cargo... "
if command -v cargo &> /dev/null; then
    echo "✅ Found ($(cargo --version))"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found"
fi

# Check 5: src-tauri directory
echo -n "Checking src-tauri directory... "
if [ -d "src-tauri" ]; then
    echo "✅ Found"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found"
fi

# Check 6: Cargo.toml
echo -n "Checking Cargo.toml... "
if [ -f "src-tauri/Cargo.toml" ]; then
    echo "✅ Found"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found"
fi

# Check 7: tauri.conf.json
echo -n "Checking tauri.conf.json... "
if [ -f "src-tauri/tauri.conf.json" ]; then
    echo "✅ Found"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found"
fi

# Check 8: Node modules in src
echo -n "Checking node_modules... "
if [ -d "src/node_modules" ]; then
    echo "✅ Found"
    ((SUCCESS_COUNT++))
else
    echo "❌ Not found - Run: cd src && npm install"
fi

echo ""
echo "============================================"
echo "Results: $SUCCESS_COUNT/$TOTAL_CHECKS checks passed"
echo "============================================"
echo ""

if [ $SUCCESS_COUNT -eq $TOTAL_CHECKS ]; then
    echo "🎉 All checks passed! You're ready to go!"
    echo ""
    echo "Next steps:"
    echo "  ./dev.sh          - Start development"
    echo "  ./build-tauri.sh  - Build for production"
else
    echo "⚠️  Some checks failed. Please resolve the issues above."
    echo ""
    if [ $SUCCESS_COUNT -lt 4 ]; then
        echo "Run: ./quick-start.sh"
    fi
fi
echo ""
