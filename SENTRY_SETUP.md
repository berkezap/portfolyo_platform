# 📊 Sentry Error Tracking Kurulumu

## 📋 Sentry Nedir?

Sentry, uygulamanızdaki hataları gerçek zamanlı olarak izleyen ve raporlayan bir error tracking platformudur. PortfolYO platformunda kullanıcı deneyimini iyileştirmek için kritik öneme sahiptir.

### 🎯 **Faydaları:**
- ✅ Gerçek zamanlı hata izleme
- ✅ Performance monitoring
- ✅ User experience tracking
- ✅ Production debugging
- ✅ Error analytics

## 🔥 **ADIM 1: Sentry Projesi Oluşturma**

1. **Sentry'e gidin**: https://sentry.io
2. **"Sign up"** veya **"Log in"** yapın
3. **"Create Project"** butonuna tıklayın
4. **Platform**: `Next.js` seçin
5. **Project name**: `portfolyo-platform` yazın
6. **"Create Project"** butonuna tıklayın

## 🔥 **ADIM 2: DSN (Data Source Name) Alma**

1. **Proje oluşturulduktan sonra**:
   - **DSN** değerini kopyalayın
   - Format: `https://your-dsn@sentry.io/project-id`

2. **`.env.local` dosyasını güncelleyin**:
   ```env
   # Sentry Error Tracking
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

## 🔥 **ADIM 3: Platform'u Yeniden Başlatma**

```bash
npm run dev
```

## 🔥 **ADIM 4: Test Etme**

1. **Platform'da bir hata oluşturun** (örn: yanlış URL)
2. **Sentry Dashboard'da** hatanın göründüğünü kontrol edin
3. **Error details** ve **stack trace**'i inceleyin

## ⚙️ **OPTİMİZASYON AYARLARI**

### 🎯 **Development vs Production**

**Development:**
- Tüm eventler gönderilir
- Debug mode aktif
- TracesSampleRate: 1.0 (100%)

**Production:**
- Sadece error ve warning'ler gönderilir
- Debug mode kapalı
- TracesSampleRate: 0.1 (10%)

### 🔧 **Konfigürasyon Detayları**

```typescript
// src/instrumentation.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  environment: process.env.NODE_ENV || 'development',
  debug: process.env.NODE_ENV === 'development',
  beforeSend(event) {
    // Production'da gereksiz eventleri filtrele
    if (process.env.NODE_ENV === 'production') {
      if (event.level === 'info' || event.level === 'debug') {
        return null;
      }
    }
    return event;
  },
});
```

## 📊 **SENTRY DASHBOARD ÖZELLİKLERİ**

### 📈 **Performance Monitoring**
- Page load times
- API response times
- Database query performance
- User interaction tracking

### 🐛 **Error Tracking**
- Real-time error alerts
- Stack trace analysis
- Error grouping
- Release tracking

### 👥 **User Experience**
- User journey tracking
- Session replay
- Performance metrics
- Error impact analysis

## 🔧 **SORUN GİDERME**

### ❌ "Sentry DSN not found" Hatası

**Çözüm:**
1. Environment variables'ların doğru olduğunu kontrol edin
2. Platform'u yeniden başlatın

### ❌ "No events in Sentry" Sorunu

**Çözüm:**
1. DSN'in doğru olduğunu kontrol edin
2. Network connectivity'yi kontrol edin
3. Test hatası oluşturun

### ❌ "Too many events" Sorunu

**Çözüm:**
1. `beforeSend` filter'ını kontrol edin
2. `tracesSampleRate`'i düşürün
3. Environment'ı kontrol edin

## 📋 **KONTROL LİSTESİ**

- [ ] Sentry projesi oluşturuldu
- [ ] DSN kopyalandı
- [ ] Environment variables güncellendi
- [ ] Platform yeniden başlatıldı
- [ ] Test hatası oluşturuldu
- [ ] Sentry Dashboard'da hata görüldü

## 🎯 **PRODUCTION İÇİN**

Production'a geçerken:

1. **Environment**: `production` olarak ayarlayın
2. **TracesSampleRate**: 0.1 (10%) olarak ayarlayın
3. **Debug mode**: Kapalı
4. **Error filtering**: Aktif
5. **Performance monitoring**: Aktif

## 🔒 **GÜVENLİK NOTLARI**

- ✅ DSN'i public repository'de paylaşmayın
- ✅ Production'da güçlü filtering kullanın
- ✅ PII (Personal Identifiable Information) filtreleyin
- ✅ Rate limiting ayarlayın

---

**Not**: Sentry kurulumu tamamlandıktan sonra platform'daki tüm hatalar gerçek zamanlı olarak izlenecek ve raporlanacak. 