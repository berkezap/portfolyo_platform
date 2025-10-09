#!/bin/bash

# ====================================
# Vercel Environment Variables Kurulum Script'i
# ====================================
# ⚠️  GÜVENLİK: Bu script artık .env.local'den okur
# ⚠️  Asla gerçek secret'ları bu dosyaya yazmayın!

set -e

echo "🚀 Vercel Production Environment Variables Kurulumu"
echo "===================================================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# .env.local kontrolü
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local dosyası bulunamadı!${NC}"
    echo "Lütfen önce .env.local dosyasını oluşturun (env.example'dan kopyalayın)"
    exit 1
fi

# .env.local'i yükle
set -a
source .env.local
set +a

# Vercel CLI kontrolü
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI bulunamadı${NC}"
    echo "Kurulum yapılıyor..."
    npm install -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI hazır${NC}"
echo ""

# Login kontrolü
echo "🔐 Vercel'e login oluyorsunuz..."
vercel login

echo ""
echo "🔗 Projeyi link'liyoruz..."
vercel link

echo ""
echo "📋 Environment Variables Ekleniyor..."
echo "======================================"
echo ""

# Helper function
add_env() {
    local key=$1
    local value=$2
    if [ -z "$value" ]; then
        echo -e "${RED}❌ $key değeri boş!${NC}"
        return 1
    fi
    echo -e "${BLUE}Adding: $key${NC}"
    echo "$value" | vercel env add "$key" production
}

echo -e "${YELLOW}Not: Her değişken için Enter tuşuna basın${NC}"
echo ""

# NextAuth
echo "1️⃣  NextAuth Configuration"
add_env "NODE_ENV" "production"
add_env "NEXTAUTH_URL" "${NEXTAUTH_URL}"
add_env "NEXTAUTH_SECRET" "${NEXTAUTH_SECRET}"
add_env "NEXTAUTH_DEBUG" "false"

# GitHub OAuth
echo ""
echo "2️⃣  GitHub OAuth"
add_env "GITHUB_CLIENT_ID" "${GITHUB_CLIENT_ID}"
add_env "GITHUB_CLIENT_SECRET" "${GITHUB_CLIENT_SECRET}"

# App Config
echo ""
echo "3️⃣  App Configuration"
add_env "NEXT_PUBLIC_APP_URL" "${NEXT_PUBLIC_APP_URL}"
add_env "NEXT_PUBLIC_APP_NAME" "PortfolYO"
add_env "NEXT_PUBLIC_DEMO_MODE" "false"
add_env "NEXT_PUBLIC_DEBUG" "false"

# Supabase
echo ""
echo "4️⃣  Supabase Database"
add_env "NEXT_PUBLIC_SUPABASE_URL" "${NEXT_PUBLIC_SUPABASE_URL}"
add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
add_env "SUPABASE_SERVICE_ROLE_KEY" "${SUPABASE_SERVICE_ROLE_KEY}"

# Redis
echo ""
echo "5️⃣  Upstash Redis"
add_env "UPSTASH_REDIS_REST_URL" "${UPSTASH_REDIS_REST_URL}"
add_env "UPSTASH_REDIS_REST_TOKEN" "${UPSTASH_REDIS_REST_TOKEN}"

# Sentry
echo ""
echo "7️⃣  Sentry Error Tracking"
add_env "SENTRY_DSN" "${SENTRY_DSN}"
add_env "NEXT_PUBLIC_SENTRY_DSN" "${NEXT_PUBLIC_SENTRY_DSN}"

echo ""
echo "===================================================="
echo -e "${GREEN}✅ Tüm environment variables eklendi!${NC}"
echo ""
echo "⚠️  KRİTİK UYARILAR:"
echo "1. Stripe TEST mode production'da! Live mode'a geç:"
echo "   https://dashboard.stripe.com/apikeys"
echo ""
echo "2. GitHub OAuth callback URL kontrol et:"
echo "   https://github.com/settings/developers"
echo "   Callback: https://portfolyoplatform.vercel.app/api/auth/callback/github"
echo ""
echo "3. Vercel dashboard'da kontrol et:"
echo "   https://vercel.com/berkezaps-projects/portfolyo-platform/settings/environment-variables"
echo ""
echo "🚀 Deployment başlatmak için:"
echo "   vercel --prod"
