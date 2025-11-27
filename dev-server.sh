#!/bin/bash

# NRRWA Hugo Development Server with Pagefind Indexing
# This script builds the site, indexes it with Pagefind, then starts the dev server

echo "🚀 Starting NRRWA development workflow..."
echo ""

# Step 1: Build the Hugo site
echo "📦 Building Hugo site..."
hugo --minify

if [ $? -ne 0 ]; then
    echo "❌ Hugo build failed!"
    exit 1
fi

echo "✅ Hugo build complete"
echo ""

# Step 2: Run Pagefind indexing
echo "🔍 Indexing site with Pagefind..."
npx -y pagefind --site public

if [ $? -ne 0 ]; then
    echo "⚠️  Pagefind indexing failed, but continuing..."
else
    echo "✅ Pagefind indexing complete"
fi

echo ""

# Step 3: Start Hugo development server
echo "🌐 Starting Hugo development server..."
echo "📍 Server will be available at http://localhost:1313/"
echo "Press Ctrl+C to stop"
echo ""

hugo server -D
