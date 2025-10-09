#!/bin/bash

# ====================================
# Vercel Environment Variables Güncelleme Script'i
# ====================================
# Mevcut production secret'larını günceller

set -e

echo "🔄 Vercel Production Environment Variables Güncelleme"
echo "====================================================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  Bu script mevcut environment variables'ları güncelleyecek${NC}"
echo -e "${YELLOW}   Devam etmek istiyor musun? (y/N)${NC}"
read -p "> " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ İptal edildi"
    exit 1
fi

echo ""
echo -e "${BLUE}Mevcut environment variables listesi:${NC}"
vercel env ls

echo ""
echo -e "${YELLOW}Silmek istediğin variable'ların adlarını yaz (boş bırak = hepsini güncelle):${NC}"
read -p "Variable names (boşlukla ayır): " vars_to_remove

if [ ! -z "$vars_to_remove" ]; then
    for var in $vars_to_remove; do
        echo -e "${RED}Siliniyor: $var${NC}"
        vercel env rm "$var" production --yes || true
    done
fi

echo ""
echo -e "${GREEN}✅ Temizlik tamamlandı${NC}"
echo ""
echo "Şimdi yeni değerleri eklemek için:"
echo "  ./scripts/setup-vercel-env.sh"
echo ""
echo "veya Dashboard'dan manuel güncelle:"
echo "  https://vercel.com/berkezaps-projects/portfolyo-platform/settings/environment-variables"
