#!/bin/bash

echo "============================================"
echo "ReVens Tauri Quick Start Setup"
echo "============================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18 or higher."
    exit 1
else
    echo "✅ Node.js found: $(node --version)"
fi

# Check for Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust not found. Please install Rust from https://rustup.rs/"
    exit 1
else
    echo "✅ Rust found: $(rustc --version)"
fi

# Check for Cargo
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo not found. Please install Rust toolchain."
    exit 1
else
    echo "✅ Cargo found: $(cargo --version)"
fi

echo ""
echo "Prerequisites check passed!"
echo ""

# Setup icons
echo "Setting up icons..."
bash setup-icons.sh

echo ""
echo "Installing Node dependencies..."
cd src

if [ -f "package-lock.json" ]; then
    echo "Removing old package-lock.json..."
    rm package-lock.json
fi

if [ -d "node_modules" ]; then
    echo "Removing old node_modules..."
    rm -rf node_modules
fi

npm install

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "To start development:"
echo "  cd src && npm run dev"
echo ""
echo "To build for production:"
echo "  cd src && npm run build"
echo ""
echo "Or use the provided scripts:"
echo "  ./dev.sh        - Start development mode"
echo "  ./build-tauri.sh - Build production app"
echo ""
