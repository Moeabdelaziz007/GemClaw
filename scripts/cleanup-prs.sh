#!/bin/bash
# 🧬 Gemclaw PR Cleanup & CI Push Script
# Usage: ./scripts/cleanup-prs.sh YOUR_GITHUB_TOKEN

TOKEN="$1"

if [ -z "$TOKEN" ]; then
  echo "❌ Usage: ./scripts/cleanup-prs.sh ghp_YOUR_TOKEN_HERE"
  echo "   Get a token at: https://github.com/settings/tokens/new"
  echo "   Required scope: repo"
  exit 1
fi

REPO="Moeabdelaziz007/GemClaw"

echo "🧬 Setting up authenticated remote..."
git remote set-url origin "https://${TOKEN}@github.com/${REPO}.git"

# Step 1: Push code-health branch
echo ""
echo "📤 Pushing code-health/ci-stabilization branch..."
git push origin code-health/ci-stabilization

# Step 2: Delete all stale PR branches
echo ""
echo "🗑️  Deleting 15 stale remote branches..."

BRANCHES=(
  "fix-i18n-build-error-1934620222083551105"
  "fix-i18n-missing-key-4162426105636678975"
  "fix-clawhub-missing-translation-13862341469406210141"
  "fix-i18n-missing-key-9967303021143462803"
  "fix/build-translation-errors-16607391508481559034"
  "fix/missing-translations-build-error-9845307640848186522"
  "fix/nextjs-build-firebase-errors-3733394321693609270"
  "fix/frontend-build-bugs-3120676946213520061"
  "fix/frontend-build-issues-11634689635419795738"
  "fix/frontend-build-issues-9071544910659642321"
  "fix-frontend-build-issues-1917270512923741296"
  "fix-frontend-build-issues-16689520212093971721"
  "fix/build-issues-firebase-ssg-14460011419915760266"
  "fix/frontend-build-bugs-12046426073455646431"
  "fix/firebase-deployment-security-issues-14757755253926193175"
)

for branch in "${BRANCHES[@]}"; do
  echo "  ❌ Deleting: $branch"
  git push origin --delete "$branch" 2>/dev/null || echo "    (already deleted or not found)"
done

# Step 3: Remove token from remote URL (security)
echo ""
echo "🔒 Removing token from remote URL..."
git remote set-url origin "https://github.com/${REPO}.git"

echo ""
echo "✅ Done! Summary:"
echo "   - code-health/ci-stabilization branch pushed"
echo "   - 15 stale branches deleted"
echo "   - Remote URL cleaned (token removed)"
echo ""
echo "📋 Next: Create a PR from code-health/ci-stabilization -> main on GitHub"
