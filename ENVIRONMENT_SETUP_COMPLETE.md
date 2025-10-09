# 🎯 Ortam Ayrımı Tamamlandı!

## ✅ Yapılan İşlemler

### 1. Dosya Yapısı Oluşturuldu

```
✅ .env.development              → Development template
✅ .env.production.template      → Production template
✅ .env.staging.template         → Staging template
✅ .env.local                    → Local secrets (git'te YOK)
✅ .env.production               → Production secrets (git'te YOK)
✅ env.example                   → Güncellenmiş example
✅ .gitignore                    → .env dosyaları korunuyor
```

### 2. Scripts Eklendi

```bash
✅ npm run setup:dev           → Development ortamı kur
✅ npm run validate:prod       → Production secret'ları kontrol et
✅ npm run env:check           → Environment değişkenlerini görüntüle
```

### 3. Dokümantasyon Oluşturuldu

```
✅ docs/setup/ENVIRONMENT_SEPARATION_GUIDE.md       → Detaylı rehber
✅ docs/setup/PRODUCTION_DEPLOYMENT_CHECKLIST.md    → Deploy checklist
✅ docs/setup/QUICK_START_ENV_SETUP.md             → Hızlı başlangıç
```

### 4. Güvenlik

```
✅ .env.local ve .env.production git'e eklenmeyecek
✅ Git history temiz (secret'lar yok)
✅ Template dosyaları placeholder içeriyor
```

---

## 🚀 Şimdi Ne Yapmalısın?

### ADIM 1: Acil Güvenlik Kontrolleri (5 dk)

```bash
# 1. .env dosyalarının git'te olmadığını doğrula
git status | grep .env

# 2. Mevcut .env.local'i yedekle
cp .env.local .env.local.backup

# 3. Production secret'larını yedekle
cp .env.production .env.production.backup
```

### ADIM 2: Development Ortamını Kur (10 dk)

```bash
# Otomatik kurulum
npm run setup:dev

# .env.local'i düzenle - AYRI servisler oluştur:
nano .env.local
```

**Yeni oluşturulması gerekenler:**

1. **Supabase Development Projesi**
   - https://supabase.com/dashboard
   - Yeni proje: `portfolyo-dev`
   - URL ve keys'i `.env.local`'e ekle

2. **GitHub OAuth Development App**
   - https://github.com/settings/developers
   - New OAuth App
   - Homepage: `http://localhost:3000`
   - Callback: `http://localhost:3000/api/auth/callback/github`

3. **Upstash Redis Development DB**
   - https://console.upstash.com/
   - New database: `portfolyo-dev`

### ADIM 3: Production Secret'larını Vercel'e Taşı (15 dk)

```bash
# 1. Vercel CLI kur
npm i -g vercel

# 2. Login ol
vercel login

# 3. Projeyi link'le
vercel link

# 4. Secret'ları ekle (.env.production.backup'tan)
vercel env add GITHUB_CLIENT_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel env add NEXTAUTH_SECRET production

# Her secret için tekrarla veya Vercel dashboard kullan:
# https://vercel.com/berkezaps-projects/portfolyo-platform/settings/environment-variables
```

### ADIM 4: Production Servisleri Güncelle (20 dk)

**GitHub OAuth Production App Oluştur:**

1. https://github.com/settings/developers
2. Yeni OAuth App → Production
3. Homepage: `https://portfolyo.tech`
4. Callback: `https://portfolyo.tech/api/auth/callback/github`
5. Client ID ve Secret'ı Vercel'e ekle

**Stripe Live Mode:**

1. https://dashboard.stripe.com/apikeys
2. Live mode'a geç (toggle)
3. API keys'i kopyala (`sk_live_*`, `pk_live_*`)
4. Vercel'e ekle

**Supabase Production:**

- Mevcut production projesini koru
- Service role key'i Vercel'e ekle

**Redis Production:**

- Ayrı production database oluştur
- Token'ı Vercel'e ekle

### ADIM 5: Test Et (10 dk)

```bash
# Development test
npm run dev
# http://localhost:3000 aç ve test et

# Environment check
npm run env:check

# Production validation
npm run validate:prod
```

### ADIM 6: Deployment (5 dk)

```bash
# Değişiklikleri commit et
git add .
git commit -m "chore: separate dev and prod environments"

# Push et (Vercel otomatik deploy eder)
git push origin main

# Production'da test et
# https://portfolyo.tech
```

---

## ⚠️ KRİTİK UYARILAR

### 🔴 HEMEN YAP

1. **Mevcut production secret'ları değiştir** (eğer git'e pushlanmışlarsa)
   - GitHub OAuth secret rotate et
   - Stripe secret key yenile
   - Supabase service role key yenile
   - NextAuth secret değiştir

2. **Aynı secret'ları her yerde kullanma**
   - Dev ve prod FARKLI secret'lar kullanmalı
   - Stripe test/live mode ayrımı şart

3. **Git'e secret pushlama**
   - `.env.local` ve `.env.production` ASLA commit etme
   - Template dosyaları güvenli (placeholder içeriyor)

### 🟡 ÖNEMLI

- Her ortam için ayrı database kullan
- Production'da Stripe live mode kullan
- Vercel environment variables'ı düzenli güncelle
- Deploy öncesi checklist kullan

---

## 📋 Checklist

### Güvenlik

- [ ] .env dosyaları git'te yok
- [ ] Git history temiz
- [ ] Production secret'ları Vercel'de
- [ ] Dev ve prod farklı secret'lar

### Servisler

- [ ] Development Supabase projesi oluşturuldu
- [ ] Development GitHub OAuth app oluşturuldu
- [ ] Development Redis DB oluşturuldu
- [ ] Production GitHub OAuth app oluşturuldu
- [ ] Production Stripe live mode ayarlandı
- [ ] Production Redis ayrıldı

### Vercel

- [ ] Tüm production secret'lar eklendi
- [ ] Environment: Production seçildi
- [ ] Preview deployments çalışıyor

### Test

- [ ] Development çalışıyor (npm run dev)
- [ ] Production deploy edildi
- [ ] Smoke tests geçti
- [ ] Critical flows test edildi

---

## 📚 Dokümantasyon

- **Hızlı Başlangıç:** [`docs/setup/QUICK_START_ENV_SETUP.md`](./docs/setup/QUICK_START_ENV_SETUP.md)
- **Detaylı Rehber:** [`docs/setup/ENVIRONMENT_SEPARATION_GUIDE.md`](./docs/setup/ENVIRONMENT_SEPARATION_GUIDE.md)
- **Production Checklist:** [`docs/setup/PRODUCTION_DEPLOYMENT_CHECKLIST.md`](./docs/setup/PRODUCTION_DEPLOYMENT_CHECKLIST.md)

---

## 🆘 Yardım

Sorun yaşarsan:

1. [`docs/setup/QUICK_START_ENV_SETUP.md`](./docs/setup/QUICK_START_ENV_SETUP.md) - Sorun giderme bölümü
2. Vercel logs: `vercel logs`
3. Environment check: `npm run env:check`

---

**Oluşturulma:** 2025-10-03  
**Durum:** ✅ Hazır - Acil adımları uygula
