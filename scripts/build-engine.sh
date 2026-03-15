#!/bin/bash

# AetherOS Neural Voice Engine Build Orchestrator
# Targets: wasm32-unknown-unknown

echo "🚀 Starting Neural Voice Engine Build..."

# 1. Check for Rust Target
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "📦 Adding wasm32 target..."
    rustup target add wasm32-unknown-unknown
fi

# 2. Compile to WASM
echo "🦀 Compiling Rust to WASM..."
cargo build --release --target wasm32-unknown-unknown

# 3. Optimization (Optional but recommended)
if command -v wasm-opt &> /dev/null; then
    echo "✨ Optimizing WASM binary..."
    wasm-opt -Oz target/wasm32-unknown-unknown/release/neural_voice_engine.wasm -o public/engine.wasm
else
    echo "⚠️ wasm-opt not found. Copying raw binary to public folder."
    cp target/wasm32-unknown-unknown/release/neural_voice_engine.wasm public/engine.wasm
fi

echo "✅ Build Complete. Engine deployed to /public/engine.wasm"
