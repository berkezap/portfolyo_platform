#!/bin/bash

# ====================================
# Vercel Environment Variables Kurulum Script'i
# ====================================
# Bu script production secret'larını Vercel'e ekler

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
    echo -e "${BLUE}Adding: $key${NC}"
    echo "$value" | vercel env add "$key" production
}

echo -e "${YELLOW}Not: Her değişken için Enter tuşuna basın${NC}"
echo ""

# NextAuth
echo "1️⃣  NextAuth Configuration"
add_env "NODE_ENV" "production"
add_env "NEXTAUTH_URL" "https://portfolyoplatform.vercel.app"
add_env "NEXTAUTH_SECRET" "ZBdt47OxURN36ZTgln2QBI3BslS+/70BZqUgjI4wkvE="
add_env "NEXTAUTH_DEBUG" "false"

# GitHub OAuth
echo ""
echo "2️⃣  GitHub OAuth"
add_env "GITHUB_CLIENT_ID" "Ov23lilgi6pmncXFhwhJ"
add_env "GITHUB_CLIENT_SECRET" "a7c19d72ee673b1f2aeef9275c2c714675f07a02"

# App Config
echo ""
echo "3️⃣  App Configuration"
add_env "NEXT_PUBLIC_APP_URL" "https://portfolyoplatform.vercel.app"
add_env "NEXT_PUBLIC_APP_NAME" "PortfolYO"
add_env "NEXT_PUBLIC_DEMO_MODE" "false"
add_env "NEXT_PUBLIC_DEBUG" "false"

# Supabase
echo ""
echo "4️⃣  Supabase Database"
add_env "NEXT_PUBLIC_SUPABASE_URL" "https://srgvpcwbcjsuostcexmn.supabase.co"
add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "your-supabase-anon-key"
add_env "SUPABASE_SERVICE_ROLE_KEY" "your-supabase-service-role-key"

# Redis
echo ""
echo "5️⃣  Upstash Redis"
add_env "UPSTASH_REDIS_REST_URL" "https://devoted-joey-37674.upstash.io"
add_env "UPSTASH_REDIS_REST_TOKEN" "AZMqAAIncDEyN2RjNGE0ODM3YjA0YjJkOTMyOTEyNGRiZGQzYzZmMXAxMzc2NzQ"

# Sentry
echo ""
echo "7️⃣  Sentry Error Tracking"
add_env "SENTRY_DSN" "https://e04cc32d6cd56ec3fb7970efe6a92ef2@o4509645266485248.ingest.de.sentry.io/4509645272449104"
add_env "NEXT_PUBLIC_SENTRY_DSN" "https://e04cc32d6cd56ec3fb7970efe6a92ef2@o4509645266485248.ingest.de.sentry.io/4509645272449104"

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
