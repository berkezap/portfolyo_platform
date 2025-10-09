#!/bin/bash

# 🚀 Git Hook Setup Script
# Bu script git hooks'ları kurar ve aktif eder

echo "🔧 Git Hooks kuruluyor..."

# Pre-push hook'u kopyala
if [ -f ".git/hooks/pre-push" ]; then
    echo "✅ Pre-push hook zaten mevcut"
else
    echo "❌ Pre-push hook bulunamadı!"
    echo "Manuel kurulum gerekli"
    exit 1
fi

# Execute permission ver
chmod +x .git/hooks/pre-push
echo "✅ Pre-push hook executable yapıldı"

# Test et
echo ""
echo "📋 Kurulum tamamlandı!"
echo ""
echo "🧪 Test etmek için:"
echo "   git checkout main"
echo "   git commit --allow-empty -m 'test'"
echo "   git push origin main"
echo ""
echo "   ❌ Hata verirse başarılı! (main'e direkt push engellenmiş)"
echo ""

exit 0
