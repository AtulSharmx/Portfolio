#!/bin/bash
# Atul AI - Pre-Deployment Checklist
# Run this to verify everything is set up correctly

echo "🔍 Atul AI Backend - Verification Checklist"
echo "=========================================="
echo ""

# Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✅ Node.js: $(node --version)"
else
    echo "   ❌ Node.js not found. Install from nodejs.org"
    exit 1
fi

# Check npm
echo ""
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    echo "   ✅ npm: $(npm --version)"
else
    echo "   ❌ npm not found"
    exit 1
fi

# Check project files
echo ""
echo "3️⃣  Checking project files..."

files=(
    "server.js"
    "server/routes/chat.js"
    "server/services/geminiService.js"
    "server/data/knowledge.js"
    "server/data/portfolioData.json"
    "public/chat-handler.js"
    "public/index.html"
    "public/style.css"
    "package.json"
    ".env"
    "README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file - MISSING!"
    fi
done

# Check dependencies
echo ""
echo "4️⃣  Checking node_modules..."
if [ -d "node_modules" ]; then
    echo "   ✅ Dependencies installed"
else
    echo "   ⚠️  node_modules not found. Run: npm install"
fi

# Check .env
echo ""
echo "5️⃣  Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "GEMINI_API_KEY" .env; then
        if grep -q "AIzaSy" .env; then
            echo "   ✅ GEMINI_API_KEY configured"
        else
            echo "   ⚠️  GEMINI_API_KEY appears empty"
        fi
    else
        echo "   ❌ GEMINI_API_KEY not found in .env"
    fi
else
    echo "   ❌ .env file not found"
fi

# Summary
echo ""
echo "=========================================="
echo "✨ Verification Complete!"
echo ""
echo "Next steps:"
echo "1. npm install          (if not done)"
echo "2. npm run dev          (start development server)"
echo "3. npm start            (production mode)"
echo ""
echo "Then:"
echo "- Open browser: http://localhost:5000"
echo "- Click 'Know Me More' button"
echo "- Chat with Atul AI!"
echo ""
echo "📚 Documentation:"
echo "- README.md - Full documentation"
echo "- SETUP.md - Quick start guide"
echo "- PROJECT_SUMMARY.md - Complete overview"
echo ""
