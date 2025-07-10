#!/bin/bash

echo "🔍 Testing Admin Dashboard Endpoints on localhost:8081"
echo "=================================================="

# Test main application
echo "1. Testing main application..."
if curl -s http://localhost:8081 | grep -q "glass-celebration-hub"; then
    echo "✅ Main app: ACCESSIBLE"
else
    echo "❌ Main app: FAILED"
fi

# Test admin dashboard route
echo "2. Testing admin dashboard route..."
if curl -s "http://localhost:8081/admin/dashboard" | grep -q "glass-celebration-hub"; then
    echo "✅ Admin dashboard: ACCESSIBLE"
else
    echo "❌ Admin dashboard: FAILED"
fi

# Test auth endpoint
echo "3. Testing auth route..."
if curl -s "http://localhost:8081/auth" | grep -q "glass-celebration-hub"; then
    echo "✅ Auth route: ACCESSIBLE"
else
    echo "❌ Auth route: FAILED"
fi

# Check if Supabase environment is loaded
echo "4. Testing environment configuration..."
if [ -f ".env" ] && grep -q "VITE_SUPABASE_URL" .env; then
    SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d'=' -f2)
    echo "✅ Supabase URL configured: $SUPABASE_URL"
else
    echo "❌ Supabase configuration: NOT FOUND"
fi

# Test if development server is running properly
echo "5. Testing development server..."
SERVER_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:8081 -o /dev/null)
if [ "$SERVER_RESPONSE" -eq 200 ]; then
    echo "✅ Development server: RUNNING (HTTP $SERVER_RESPONSE)"
else
    echo "❌ Development server: ISSUE (HTTP $SERVER_RESPONSE)"
fi

echo ""
echo "🎯 Ready for Manual Admin Testing!"
echo "=================================="
echo "Next steps:"
echo "1. Open browser to: http://localhost:8081/admin/dashboard"
echo "2. Test admin login modal"
echo "3. Use credentials: admin@wedding.local / admin123"
echo "4. Systematically test each admin section"
echo ""
echo "📝 Document findings in: ADMIN_TESTING_RESULTS.md"