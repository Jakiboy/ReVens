#!/bin/bash

echo "Setting up Tauri icons..."

# Source icon path
SOURCE_ICON="src/app/assets/img/icon-32.png"

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at $SOURCE_ICON"
    exit 1
fi

# Create icons directory if it doesn't exist
mkdir -p src-tauri/icons

# Copy and rename icon for different sizes
# Note: For production, you should create properly sized icons
# This is a placeholder script

echo "Copying icons..."
cp "$SOURCE_ICON" "src-tauri/icons/32x32.png"
cp "$SOURCE_ICON" "src-tauri/icons/128x128.png"
cp "$SOURCE_ICON" "src-tauri/icons/128x128@2x.png"
cp "$SOURCE_ICON" "src-tauri/icons/icon.png"

echo "Icon setup complete!"
echo "Note: For production builds, create properly sized icons:"
echo "  - 32x32.png, 128x128.png, 128x128@2x.png"
echo "  - icon.ico (Windows) - use online converter or imagemagick"
echo "  - icon.icns (macOS) - use png2icns or similar tool"
