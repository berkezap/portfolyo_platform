# 🔧 GitHub OAuth Yapılandırma Rehberi

## 🚨 Mevcut Sorun
GitHub projeleri yüklenmiyor - "GitHub projeleriniz yükleniyor..." mesajı takılı kalıyor.

## 🔍 Root Cause Analizi
1. **API Endpoint Hatası**: `/api/github/repos` 401 Unauthorized dönüyor
2. **Session Sorunu**: Kullanıcı GitHub ile giriş yapmamış veya session geçersiz
3. **OAuth Yapılandırması**: GitHub OAuth app eksik veya hatalı yapılandırılmış

## 🛠️ Çözüm Adımları

### 1. GitHub OAuth App Oluşturma

#### 1.1 GitHub'da OAuth App Oluştur
1. GitHub.com'a git
2. Settings → Developer settings → OAuth Apps → New OAuth App
3. Form'u doldur:
   ```
   Application name: PortfolYO
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```
4. "Register application" butonuna tıkla

#### 1.2 Client ID ve Secret'ı Kopyala
- Client ID'yi kopyala
- "Generate a new client secret" butonuna tıkla
- Client Secret'ı kopyala (sadece bir kez gösterilir!)

### 2. Environment Değişkenlerini Güncelle

#### 2.1 .env.local Dosyasını Düzenle
```bash
# GitHub OAuth - GitHub'dan OAuth App oluşturduktan sonra doldurun
GITHUB_CLIENT_ID=your-actual-github-client-id-here
GITHUB_CLIENT_SECRET=your-actual-github-client-secret-here

# Demo mode'u kapat
NEXT_PUBLIC_DEMO_MODE=false
```

#### 2.2 Diğer Gerekli Değişkenler
```bash
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=portfolyo-super-secret-key-2024-development

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PortfolYO
```

### 3. Uygulamayı Test Et

#### 3.1 Development Server'ı Yeniden Başlat
```bash
npm run dev
```

#### 3.2 GitHub ile Giriş Yap
1. http://localhost:3000'a git
2. "GitHub ile Giriş Yap" butonuna tıkla
3. GitHub'da uygulamaya izin ver
4. Dashboard'a yönlendirileceksin

#### 3.3 Repository'leri Kontrol Et
- Dashboard'da "Projelerinizi Seçin" sayfasına git
- GitHub projelerinin yüklendiğini doğrula
- "GitHub projeleriniz yükleniyor..." mesajının kaybolduğunu kontrol et

## 🔧 Sorun Giderme

### Sorun 1: "Unauthorized - Please sign in again"
**Çözüm**: 
- GitHub OAuth app'in doğru yapılandırıldığından emin ol
- Client ID ve Secret'ın doğru kopyalandığını kontrol et
- Development server'ı yeniden başlat

### Sorun 2: "GitHub API rate limit exceeded"
**Çözüm**:
- GitHub API rate limit'i aşıldı
- Birkaç dakika bekle ve tekrar dene
- Production'da GitHub App kullanmayı düşün

### Sorun 3: "Network error - Please check your connection"
**Çözüm**:
- İnternet bağlantını kontrol et
- GitHub.com'a erişebildiğini doğrula
- Firewall ayarlarını kontrol et

## 🚀 Production Deployment

### Production OAuth App
1. GitHub'da yeni bir OAuth App oluştur
2. Homepage URL: `https://your-domain.com`
3. Authorization callback URL: `https://your-domain.com/api/auth/callback/github`

### Environment Değişkenleri
```bash
NEXTAUTH_URL=https://your-domain.com
GITHUB_CLIENT_ID=your-production-client-id
GITHUB_CLIENT_SECRET=your-production-client-secret
NEXT_PUBLIC_DEMO_MODE=false
```

## 📝 Notlar

### Geçici Çözüm
Şu anda demo mode aktif edildi:
```typescript
// src/app/dashboard/page.tsx
const demoMode = true // Geçici olarak aktif
```

### Kalıcı Çözüm
GitHub OAuth yapılandırması tamamlandıktan sonra:
```typescript
// src/app/dashboard/page.tsx
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
```

## 🔒 Güvenlik Notları

1. **Client Secret'ı Asla Commit Etme**
   - `.env.local` dosyası `.gitignore`'da olmalı
   - Production'da environment variables kullan

2. **OAuth Scope'ları**
   - `read:user`: Kullanıcı bilgilerini oku
   - `user:email`: Email adresini oku
   - `public_repo`: Public repository'leri oku

3. **Session Güvenliği**
   - JWT token'ları güvenli şekilde saklanıyor
   - 24 saat sonra otomatik expire oluyor

---

*Son güncelleme: $(date)*
*Durum: Geçici çözüm aktif, kalıcı çözüm bekliyor* 