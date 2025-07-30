# 🚀 PortfolYO Platform - Tam Kurulum Rehberi

## 📋 ÖNEMLİ: Bu rehberi sırayla takip edin!

PortfolYO platformunu tam olarak çalışır hale getirmek için aşağıdaki adımları **SIRAYLA** takip edin.

## 🔥 **BÖLÜM 1: TEMEL KURULUM**

### ✅ **Adım 1.1: Proje Hazırlığı**
- [x] Proje klonlandı
- [x] Dependencies yüklendi
- [x] Platform çalışıyor (localhost:3000)

### ✅ **Adım 1.2: Environment Variables**
1. **`.env.local` dosyasını oluşturun**:
   ```bash
   cp env.example .env.local
   ```

2. **Temel değişkenleri ayarlayın**:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=portfolyo-super-secret-key-2024-development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=PortfolYO
   NEXT_PUBLIC_DEMO_MODE=false
   ```

## 🔥 **BÖLÜM 2: SUPABASE KURULUMU**

### 📋 **Adım 2.1: Supabase Projesi**
1. **`SUPABASE_SETUP.md`** dosyasını takip edin
2. Supabase projesi oluşturun
3. Environment variables'ları alın

### 📋 **Adım 2.2: Database Schema**
1. **`database/schema.sql`** çalıştırın
2. **`database/storage-setup.sql`** çalıştırın
3. Storage bucket'ı kontrol edin

### 📋 **Adım 2.3: Test Etme**
- [ ] CV upload çalışıyor
- [ ] Database bağlantısı aktif
- [ ] "Signed URL alınamadı" hatası yok

## 🔥 **BÖLÜM 3: GITHUB OAUTH KURULUMU**

### 📋 **Adım 3.1: GitHub OAuth App**
1. **`GITHUB_OAUTH_SETUP.md`** dosyasını takip edin
2. GitHub'da OAuth App oluşturun
3. Client ID ve Secret alın

### 📋 **Adım 3.2: Environment Variables**
```env
GITHUB_CLIENT_ID=your-actual-github-client-id-here
GITHUB_CLIENT_SECRET=your-actual-github-client-secret-here
```

### 📋 **Adım 3.3: Test Etme**
- [ ] GitHub login çalışıyor
- [ ] Repository'ler çekiliyor
- [ ] Dashboard'a yönlendirme çalışıyor

## 🔥 **BÖLÜM 4: SENTRY MONITORING (OPSİYONEL)**

### 📋 **Adım 4.1: Sentry Projesi**
1. **`SENTRY_SETUP.md`** dosyasını takip edin
2. Sentry projesi oluşturun
3. DSN alın

### 📋 **Adım 4.2: Environment Variables**
```env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 📋 **Adım 4.3: Test Etme**
- [ ] Hata oluşturun
- [ ] Sentry Dashboard'da görünüyor
- [ ] Error tracking çalışıyor

## 🔥 **BÖLÜM 5: FİNAL TEST**

### 📋 **Adım 5.1: Platform Testi**
1. **Ana sayfa**: http://localhost:3000
2. **GitHub login**: Çalışıyor mu?
3. **Dashboard**: http://localhost:3000/dashboard
4. **CV upload**: Çalışıyor mu?
5. **Repository selection**: Çalışıyor mu?
6. **Portfolio generation**: Çalışıyor mu?

### 📋 **Adım 5.2: API Testi**
1. **Portfolio list**: `/api/portfolio/list`
2. **CV upload**: `/api/upload/cv`
3. **GitHub repos**: `/api/github/repos`
4. **Portfolio generate**: `/api/portfolio/generate`

## 🎯 **KURULUM TAMAMLANDI!**

### ✅ **Başarılı Kurulum Sonrası:**
- 🚀 Platform tamamen çalışır durumda
- 🔐 GitHub authentication aktif
- 📊 Supabase database bağlı
- 📁 CV upload çalışıyor
- 🎨 Portfolio generation aktif
- 📈 Sentry monitoring (opsiyonel)

### 🎉 **Kullanıma Hazır!**
Platform artık production'a hazır durumda. Kullanıcılar:
- GitHub hesaplarıyla giriş yapabilir
- Repository'lerini seçebilir
- CV yükleyebilir
- Portfolio oluşturabilir

## 🔧 **SORUN GİDERME**

### ❌ **Genel Sorunlar**
1. **Platform çalışmıyor**: `npm run dev`
2. **Dependencies hatası**: `npm install`
3. **Cache sorunu**: `rm -rf .next && npm run dev`

### ❌ **Supabase Sorunları**
1. **`SUPABASE_SETUP.md`** dosyasını kontrol edin
2. Environment variables'ları kontrol edin
3. Storage bucket'ı kontrol edin

### ❌ **GitHub Sorunları**
1. **`GITHUB_OAUTH_SETUP.md`** dosyasını kontrol edin
2. OAuth App ayarlarını kontrol edin
3. Callback URL'yi kontrol edin

### ❌ **Sentry Sorunları**
1. **`SENTRY_SETUP.md`** dosyasını kontrol edin
2. DSN'i kontrol edin
3. Network connectivity'yi kontrol edin

## 📞 **YARDIM**

Herhangi bir sorun yaşarsanız:
1. İlgili setup dosyasını tekrar okuyun
2. Environment variables'ları kontrol edin
3. Platform'u yeniden başlatın
4. Console hatalarını kontrol edin

---

**🎉 Tebrikler! PortfolYO platformu başarıyla kuruldu!** 