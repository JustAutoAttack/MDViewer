#!/bin/bash

# Exit on any error
set -e

echo "Starting build process..."

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Running Tauri build (This may take a moment)..."
# We pipe the output to show progress, or you can let it run normally
npm run tauri build

echo "Build complete!"
echo "Artifacts located in: src-tauri/target/release/bundle/"

# Optional: List the generated files
ls -lh src-tauri/target/release/bundle/appimage/
ls -lh src-tauri/target/release/bundle/rpm/