#!/bin/bash

echo "🚀 Pre-deployment Checklist"
echo "=========================="

echo "📋 Backend Environment Variables:"
echo "- CORS_ORIGIN should be: https://thewellnessspot.vercel.app"
echo "- PORT should be: 5000"
echo "- NODE_ENV should be: production"
echo ""

echo "📋 Frontend Environment Variables:"
echo "- NEXT_PUBLIC_API_BASE_URL should be: https://client-work-jyoti-prakash.onrender.com/api/v1"
echo "- NEXT_PUBLIC_SITE_URL should be: https://thewellnessspot.vercel.app"
echo ""

echo "🔍 Testing backend health..."
curl -f https://client-work-jyoti-prakash.onrender.com/api/v1/health || echo "❌ Backend health check failed"

echo ""
echo "✅ Deployment checklist complete!"
echo "If you see errors above, check your environment variables and redeploy."
