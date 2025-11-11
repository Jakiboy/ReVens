#!/bin/bash
R='\033[0;31m'
G='\033[0;32m'
B='\033[0;96m'

NAME='ReVens'
VERSION='2.0.0'
SOURCE='src'

echo -e "${G}Building Tauri application..."
cd "${SOURCE}"

# Build webpack bundle first
echo -e "${G}Building webpack bundle..."
npm run build:webpack

# Build Tauri app
echo -e "${G}Building Tauri application..."
npm run tauri build

cd ..

echo -e "${G}Build complete!"
echo -e "${B}Output can be found in src-tauri/target/release/bundle/"
