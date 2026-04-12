#!/bin/bash

# AetherOS Automated Firebase Deployment Protocol
# Part of the Gemini Live Agent Challenge 2026 Submission

echo "🧬 INITIALIZING AETHER DEPLOYMENT SEQUENCE..."

# Check for Firebase CLI
if ! command -v firebase &> /dev/null
then
    echo "❌ Error: Firebase CLI not found. Please run 'npm install -g firebase-tools'"
    exit 1
fi

# Check for environment variables
if [ ! -f .env ]; then
    echo "⚠️ Warning: .env file not found. Ensure your environment variables are set in the Firebase Console."
fi

echo "🔨 BUILDING NEURAL SUBSTRATE (NEXT.JS)..."
NEXT_PUBLIC_FIREBASE_API_KEY=dummy NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=dummy NEXT_PUBLIC_FIREBASE_APP_ID=dummy npm run build

if [ $? -eq 0 ]; then
    echo "✅ BUILD COMPLETE. COMMENCING CLOUD MANIFESTATION..."
    
    # Deploy to Firebase
    firebase deploy --only hosting,firestore,functions
    
    if [ $? -eq 0 ]; then
        echo "🚀 AETHEROS IS NOW LIVE AT THE EDGE."
        echo "🔗 VIEW STATUS IN FIREBASE CONSOLE: https://console.firebase.google.com/"
    else
        echo "❌ DEPLOYMENT FAILED."
        exit 1
    fi
else
    echo "❌ BUILD FAILED. ABORTING DEPLOYMENT."
    exit 1
fi
