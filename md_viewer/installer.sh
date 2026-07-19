#!/usr/bin/env bash

set -e

APP_NAME="md-viewer"
DEB_PATH="src-tauri/target/release/bundle/deb"

echo "Building installer for $APP_NAME..."

# Find deb file
DEB_FILE=$(find "$DEB_PATH" -name "*.deb" | head -n 1)

if [ -z "$DEB_FILE" ]; then
    echo "No .deb found."
    echo "Run: npm run tauri build"
    exit 1
fi

echo "Installing: $DEB_FILE"

sudo apt install -y "./$DEB_FILE"

echo ""
echo "Installation complete."
echo "You can launch '$APP_NAME' from your application menu."