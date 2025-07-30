# 📚 PortfolYO Dokümantasyon

Bu klasör, PortfolYO platformunun tüm dokümantasyonunu içerir.

## 📁 Klasör Yapısı

```
docs/
├── README.md                    # Bu dosya
├── TODO_LIST.md                # Geliştirme TODO listesi
├── brand-identity/             # Marka kimliği dokümanları
├── setup/                      # Kurulum kılavuzları
├── testing/                    # Test raporları
└── technical/                  # Teknik dokümanlar
```

## 📚 Dokümantasyon Kategorileri

### **🎯 Brand Identity**
Marka kimliği ve design system dokümanları:
- [Brand Identity](./brand-identity/README.md) - Ana marka kimliği sayfası
- [Brand Identity Guide](./brand-identity/BRAND_IDENTITY.md) - Kapsamlı marka kimliği
- [Brand Audit Report](./brand-identity/BRAND_AUDIT_REPORT.md) - Brand audit raporu
- [Design System](./brand-identity/DESIGN_SYSTEM.md) - Detaylı design system
- [Design System README](./brand-identity/DESIGN_SYSTEM_README.md) - Hızlı başvuru

### **🔧 Setup Guides**
Kurulum ve konfigürasyon kılavuzları:
- [Setup Guide](./setup/SETUP_GUIDE.md) - Genel kurulum kılavuzu
- [GitHub OAuth Setup](./setup/GITHUB_OAUTH_SETUP.md) - GitHub entegrasyonu
- [Supabase Setup](./setup/SUPABASE_SETUP.md) - Database kurulumu
- [Sentry Setup](./setup/SENTRY_SETUP.md) - Monitoring kurulumu

### **🧪 Testing**
Test raporları ve sonuçları:
- [API Test Report](./testing/API_TEST_REPORT.md) - API test raporu
- [API Test Results](./testing/API_TEST_RESULTS.md) - API test sonuçları
- [Real API Test Results](./testing/REAL_API_TEST_RESULTS.md) - Gerçek API testleri
- [Test Raporu](./testing/TEST_RAPORU.md) - Genel test raporu

### **⚙️ Technical**
Teknik dokümanlar ve raporlar:
- [Performance Report](./technical/PERFORMANCE_REPORT.md) - Performance analizi
- [Redis Fix Report](./technical/REDIS_FIX_REPORT.md) - Redis düzeltme raporu

### **📋 Development**
Geliştirme süreçleri:
- [TODO List](./TODO_LIST.md) - Geliştirme TODO listesi

## 🚀 Hızlı Başlangıç

### **Yeni Geliştirici İçin**
1. [Setup Guide](./setup/SETUP_GUIDE.md) - Kurulum yapın
2. [Brand Identity](./brand-identity/README.md) - Marka kimliğini öğrenin
3. [Design System](./brand-identity/DESIGN_SYSTEM.md) - Design system'i inceleyin
4. [TODO List](./TODO_LIST.md) - Mevcut görevleri görün

### **Test Çalıştırma**
```bash
# API testleri
node scripts/tests/api-test-suite.js

# Performance testleri
bash scripts/performance/quick-performance-test.sh
```

### **Brand Compliance Kontrolü**
```tsx
import BrandCompliance from '@/components/ui/BrandCompliance'

<BrandCompliance 
  componentName="MyComponent"
  checks={brandComplianceChecks.colors}
/>
```

## 📞 İletişim

Dokümantasyon ile ilgili sorularınız için:
- **Kurulum**: `setup/` klasörü
- **Marka Kimliği**: `brand-identity/` klasörü
- **Test**: `testing/` klasörü
- **Teknik**: `technical/` klasörü

---

*Bu dokümantasyon, PortfolYO platformunun geliştirilmesi ve kullanımı için oluşturulmuştur.* 