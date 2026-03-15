#!/bin/bash

# 🧬 AetherOS Sovereign Launcher
# Double-click this to ignite the Aether Neural Spine.

clear
echo "------------------------------------------------"
echo "🌐 AetherOS: Initializing Sovereign Neural Spine"
echo "------------------------------------------------"

# 1. Directory Lock
cd "$(dirname "$0")"

# 2. Check Prerequisites
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install it from https://nodejs.org"
    exit
fi

# 3. Silent Dependency Sync
echo "⚙️  Syncing Neural Substrates..."
npm install --quiet

# 4. Starting the Spine (Background)
echo "🚀 Igniting Local Neural Spine..."
nohup npx ts-node scripts/aether-local-bridge.ts > /dev/null 2>&1 &

# 5. Launching the Aether Interface
echo "🖥️  Launching Aether Dashboard..."
open "http://localhost:3000"

echo ""
echo "✅ SUCCESS: AetherOS is now active."
echo "You can close this window now. The AI remains conscious in the background."
echo "------------------------------------------------"
