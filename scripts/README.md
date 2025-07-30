# 🔧 PortfolYO Scripts

Bu klasör, PortfolYO platformunun test ve utility script'lerini içerir.

## 📁 Klasör Yapısı

```
scripts/
├── README.md                   # Bu dosya
├── tests/                      # Test script'leri
│   ├── api-test-suite.js      # API test suite
│   ├── api-contract-tests.js  # API contract testleri
│   ├── chaos-test-suite.js    # Chaos engineering testleri
│   ├── real-api-test.js       # Gerçek API testleri
│   └── simple-api-test.js     # Basit API testleri
└── performance/               # Performance script'leri
    └── quick-performance-test.sh  # Hızlı performance testi
```

## 🧪 Test Script'leri

### **API Test Suite**
```bash
# Tüm API testlerini çalıştır
node scripts/tests/api-test-suite.js

# Belirli bir test dosyasını çalıştır
node scripts/tests/simple-api-test.js
```

### **API Contract Tests**
```bash
# API contract testlerini çalıştır
node scripts/tests/api-contract-tests.js
```

### **Chaos Engineering**
```bash
# Chaos engineering testlerini çalıştır
node scripts/tests/chaos-test-suite.js
```

### **Real API Tests**
```bash
# Gerçek API testlerini çalıştır
node scripts/tests/real-api-test.js
```

## ⚡ Performance Script'leri

### **Quick Performance Test**
```bash
# Hızlı performance testi
bash scripts/performance/quick-performance-test.sh
```

## 📊 Test Sonuçları

Test sonuçları `docs/testing/` klasöründe saklanır:
- [API Test Report](../docs/testing/API_TEST_REPORT.md)
- [API Test Results](../docs/testing/API_TEST_RESULTS.md)
- [Real API Test Results](../docs/testing/REAL_API_TEST_RESULTS.md)
- [Test Raporu](../docs/testing/TEST_RAPORU.md)

## 🚀 Kullanım

### **Development Ortamında**
```bash
# Development server'ı başlat
npm run dev

# Test script'lerini çalıştır
node scripts/tests/api-test-suite.js
```

### **Production Ortamında**
```bash
# Production build
npm run build

# Performance testleri
bash scripts/performance/quick-performance-test.sh
```

## 📋 Test Kategorileri

### **Unit Tests**
- API endpoint testleri
- Component testleri
- Utility function testleri

### **Integration Tests**
- Database bağlantı testleri
- GitHub OAuth testleri
- Portfolio generation testleri

### **Performance Tests**
- Load testing
- Stress testing
- Memory usage testing

### **Chaos Engineering**
- Network failure simulation
- Database failure simulation
- Service degradation testing

## 🔧 Konfigürasyon

Test script'leri için gerekli environment variables:
```bash
# API testleri için
DATABASE_URL=your_database_url
GITHUB_TOKEN=your_github_token

# Performance testleri için
BASE_URL=http://localhost:3000
```

## 📞 İletişim

Script'ler ile ilgili sorularınız için:
- **Test Script'leri**: `tests/` klasörü
- **Performance Script'leri**: `performance/` klasörü
- **Test Sonuçları**: `docs/testing/` klasörü

---

*Bu script'ler, PortfolYO platformunun kalitesini ve performansını sağlamak için oluşturulmuştur.* 