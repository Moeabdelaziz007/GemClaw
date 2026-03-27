#!/bin/bash
# 🧬 GEMCLAW NEURAL LAUNCHER (V1.0)
# This script bypasses macOS sandbox restrictions by executing in the native shell.

set -e

echo "🚀 [Gemclaw] Initializing Neural Launch Sequence..."

# Clean project state
echo "🧹 [1/4] Purging legacy caches and modules..."
rm -rf node_modules package-lock.json .next

# Fix permissions for the current workspace
echo "🛡️ [2/4] Rectifying filesystem permissions..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # Ensure the user owns the directory to bypass EPERM
  chmod -R 755 .
fi

# Check for .env.local
if [ ! -f .env.local ]; then
  echo "⚠️  [Warning] .env.local is missing. Creating from template..."
  cp .env.template .env.local || echo "Manual creation of .env.local required."
fi

# Install dependencies
echo "📦 [3/4] Synapsing dependencies (Next.js 15 | Zustand 5)..."
npm install --legacy-peer-deps

# Build the application
echo "⚙️  [4/4] Forging production build..."
npm run build

echo "✅ [Success] Neural Link Established. Gemclaw is ready to launch."
