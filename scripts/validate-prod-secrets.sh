#!/bin/bash

# ====================================
# Production Secret Validator
# ====================================
# Production'a deploy öncesi secret'ları kontrol eder

set -e

echo "🔒 Production Secret Validator"
echo "=============================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Helper fonksiyonlar
check_env() {
    local var_name=$1
    local should_not_contain=$2
    local env_value="${!var_name}"
    
    if [ -z "$env_value" ]; then
        echo -e "${RED}❌ $var_name eksik${NC}"
        ((ERRORS++))
    elif [ ! -z "$should_not_contain" ] && [[ "$env_value" == *"$should_not_contain"* ]]; then
        echo -e "${RED}❌ $var_name hala placeholder içeriyor${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ $var_name OK${NC}"
    fi
}

check_stripe_mode() {
    if [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
        echo -e "${RED}❌ STRIPE_SECRET_KEY test mode'da! Production'da sk_live_* kullanmalısın${NC}"
        ((ERRORS++))
    elif [[ "$STRIPE_SECRET_KEY" == sk_live_* ]]; then
        echo -e "${GREEN}✅ STRIPE_SECRET_KEY live mode${NC}"
    else
        echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY formatı tanınmadı${NC}"
        ((WARNINGS++))
    fi
}

check_url_https() {
    local var_name=$1
    local url="${!var_name}"
    
    if [[ "$url" != https://* ]]; then
        echo -e "${RED}❌ $var_name HTTPS ile başlamalı (production)${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ $var_name HTTPS kullanıyor${NC}"
    fi
}

# Production environment variables yükle
if [ -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production dosyası VARDIR!${NC}"
    echo "Production secret'ları Vercel'de environment variables olarak tanımlanmalı"
    echo "Bu dosya git'e pushlanmamalı!"
    echo ""
    read -p "Devam etmek istiyor musun? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    source .env.production
else
    echo -e "${GREEN}✅ .env.production dosyası yok (doğru!)${NC}"
    echo "Vercel environment variables kontrol ediliyor..."
    echo ""
fi

echo ""
echo "🔍 Secret Kontrolü"
echo "=================="

# NextAuth
check_env "NEXTAUTH_URL" "localhost"
check_url_https "NEXTAUTH_URL"
check_env "NEXTAUTH_SECRET" "your"

# GitHub
check_env "GITHUB_CLIENT_ID" "your"
check_env "GITHUB_CLIENT_SECRET" "your"

# Supabase
check_env "NEXT_PUBLIC_SUPABASE_URL" "your"
check_url_https "NEXT_PUBLIC_SUPABASE_URL"
check_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "your"
check_env "SUPABASE_SERVICE_ROLE_KEY" "your"

# Stripe
check_env "STRIPE_SECRET_KEY" "your"
check_env "STRIPE_PUBLISHABLE_KEY" "your"
check_stripe_mode

# Redis
check_env "UPSTASH_REDIS_REST_URL" "your"
check_url_https "UPSTASH_REDIS_REST_URL"
check_env "UPSTASH_REDIS_REST_TOKEN" "your"

# Sentry (opsiyonel)
if [ ! -z "$SENTRY_DSN" ]; then
    check_env "SENTRY_DSN" "your"
    check_url_https "SENTRY_DSN"
fi

echo ""
echo "=============================="
echo "📊 Özet"
echo "=============================="
echo -e "Hatalar: ${RED}$ERRORS${NC}"
echo -e "Uyarılar: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Production'a deploy EDİLEMEZ!${NC}"
    echo "Lütfen yukarıdaki hataları düzelt"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Uyarılar var, kontrol et${NC}"
    echo "Devam etmek istediğine emin misin?"
    read -p "Deploy edilsin mi? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✅ Tüm production secret'ları geçerli!${NC}"
echo ""
echo "📝 Sonraki adım:"
echo "  Vercel'de environment variables ayarla:"
echo "  https://vercel.com/berkezaps-projects/portfolyo-platform/settings/environment-variables"
