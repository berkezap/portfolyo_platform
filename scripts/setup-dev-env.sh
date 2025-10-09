#!/bin/bash

# ====================================
# Environment Setup Script
# ====================================
# Bu script development ortamını hızlıca kurar

set -e

echo "🚀 PortfolYO Development Environment Setup"
echo "=========================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. .env.local dosyası var mı kontrol et
if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local dosyası zaten mevcut${NC}"
    read -p "Üzerine yazmak istiyor musun? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ İptal edildi"
        exit 1
    fi
fi

# 2. .env.development'tan kopyala
echo "📋 .env.development → .env.local kopyalanıyor..."
cp .env.development .env.local

# 3. Güvenlik kontrolü
if git ls-files --error-unmatch .env.local 2>/dev/null; then
    echo -e "${RED}🚨 UYARI: .env.local git'te tracked!${NC}"
    git rm --cached .env.local
    echo -e "${GREEN}✅ Git'ten kaldırıldı${NC}"
fi

# 4. Node modules kontrol
if [ ! -d "node_modules" ]; then
    echo "📦 Dependencies yükleniyor..."
    npm install
else
    echo -e "${GREEN}✅ Dependencies zaten yüklü${NC}"
fi

# 5. Supabase kontrolü
echo ""
echo "🗄️  Supabase Kontrolü"
echo "===================="
if grep -q "your-dev-project" .env.local; then
    echo -e "${YELLOW}⚠️  Supabase URL placeholder içeriyor${NC}"
    echo "Development için ayrı bir Supabase projesi oluşturmalısın:"
    echo "  1. https://supabase.com/dashboard"
    echo "  2. New Project → portfolyo-dev"
    echo "  3. .env.local dosyasını güncelle"
else
    echo -e "${GREEN}✅ Supabase konfigürasyonu mevcut${NC}"
fi

# 6. GitHub OAuth kontrolü
echo ""
echo "🔐 GitHub OAuth Kontrolü"
echo "======================="
if grep -q "your-dev-github-client-id" .env.local; then
    echo -e "${YELLOW}⚠️  GitHub OAuth placeholder içeriyor${NC}"
    echo "Development için GitHub OAuth App oluştur:"
    echo "  1. https://github.com/settings/developers"
    echo "  2. New OAuth App"
    echo "  3. Homepage URL: http://localhost:3000"
    echo "  4. Callback URL: http://localhost:3000/api/auth/callback/github"
    echo "  5. .env.local dosyasını güncelle"
else
    echo -e "${GREEN}✅ GitHub OAuth konfigürasyonu mevcut${NC}"
fi

# 7. Stripe kontrolü
echo ""
echo "💳 Stripe Kontrolü"
echo "================="
if grep -q "pk_test_51RvJzx" .env.local; then
    echo -e "${GREEN}✅ Stripe test keys mevcut${NC}"
else
    echo -e "${YELLOW}⚠️  Stripe keys eksik${NC}"
    echo "Test mode keys alın: https://dashboard.stripe.com/test/apikeys"
fi

# 8. Özet
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Development environment hazır!${NC}"
echo ""
echo "📝 Sonraki Adımlar:"
echo "  1. .env.local dosyasını düzenle: nano .env.local"
echo "  2. Placeholder değerleri gerçek keys ile değiştir"
echo "  3. Development'ı başlat: npm run dev"
echo ""
echo "📚 Detaylı rehber: docs/setup/ENVIRONMENT_SEPARATION_GUIDE.md"
echo "=========================================="
