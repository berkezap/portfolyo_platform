# 🎯 Ortam Ayırma - Hızlı Başlangıç

## ⚡ 5 Dakikada Kurulum

### 1. Development Environment Kur

```bash
# Otomatik kurulum
npm run setup:dev

# Manuel kurulum (alternatif)
cp .env.development .env.local
nano .env.local  # Gerçek değerlerle doldur
```

### 2. Mevcut .env Dosyalarını Temizle

```bash
# Git'ten kaldır (eğer eklenmişse)
git rm --cached .env.local .env.production

# Yedek al (gerekirse)
cp .env.local .env.local.backup
cp .env.production .env.production.backup

# Artık bu dosyalar otomatik ignore ediliyor
git status  # .env dosyaları görünmemeli
```

### 3. Vercel'e Production Secret'ları Ekle

```bash
# CLI ile (önerilen)
npm i -g vercel
vercel login
vercel link

# Secret'ları ekle
vercel env add GITHUB_CLIENT_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... devamı için .env.production.template'e bak
```

**Veya Vercel Dashboard:**
https://vercel.com/berkezaps-projects/portfolyo-platform/settings/environment-variables

## 📋 Dosya Yapısı

```
portfolyo-platform/
├── .env.development          # Development template (git'e eklenebilir)
├── .env.production.template  # Production template (git'e eklenebilir)
├── .env.staging.template     # Staging template (opsiyonel)
├── .env.local               # Kişisel dev secrets (GIT'E ASLA EKLEME!)
├── .env.production          # Production secrets (GIT'E ASLA EKLEME!)
└── env.example              # Genel template
```

## 🔄 Kullanım

### Development

```bash
# Next.js otomatik olarak .env.development ve .env.local okur
npm run dev

# Environment kontrol
npm run env:check
```

### Production Deploy

```bash
# Secret'ları validate et
npm run validate:prod

# Deploy (Vercel'e push yeterli)
git push origin main
```

## 🚨 Önemli Notlar

### ✅ YAPILMASI GEREKENLER

1. **Her ortam için ayrı servisler:**
   - ✅ Ayrı Supabase projeleri (dev + prod)
   - ✅ Ayrı GitHub OAuth apps
   - ✅ Ayrı Redis database'ler
   - ✅ Stripe test/live mode ayrımı

2. **Secret güvenliği:**
   - ✅ Production secret'ları sadece Vercel'de
   - ✅ `.env.local` ve `.env.production` git'te YOK
   - ✅ Placeholder değerler template dosyalarında

3. **Test & Validation:**
   - ✅ Her deploy öncesi `npm run validate:prod`
   - ✅ Smoke tests production'da
   - ✅ Rollback planı hazır

### ❌ YAPILMAMASI GEREKENLER

- ❌ Production secret'larını git'e pushlama
- ❌ Aynı secret'ları dev ve prod'da kullanma
- ❌ Stripe test key'i production'da kullanma
- ❌ `.env.local` dosyasını commit etme
- ❌ Production DB'yi development'ta kullanma

## 🔐 Secret Hiyerarşisi

Next.js secret'ları bu sırayla yükler (son olan kazanır):

1. `.env` (tüm ortamlar)
2. `.env.local` (local override, git'e eklenmez)
3. `.env.development` / `.env.production` (NODE_ENV'e göre)
4. `.env.development.local` / `.env.production.local` (local override)

**Production'da:** Vercel environment variables her şeyin üstüne geçer.

## 🛠️ Yararlı Komutlar

```bash
# Development kurulumu
npm run setup:dev

# Production secret'ları validate et
npm run validate:prod

# Environment değişkenlerini görüntüle
npm run env:check

# Vercel environment variables listele
vercel env ls

# Vercel environment variable ekle
vercel env add <KEY> <environment>

# Vercel environment variable sil
vercel env rm <KEY> <environment>
```

## 📚 Detaylı Dokümantasyon

- **Kurulum rehberi:** [`docs/setup/ENVIRONMENT_SEPARATION_GUIDE.md`](./ENVIRONMENT_SEPARATION_GUIDE.md)
- **Production checklist:** [`docs/setup/PRODUCTION_DEPLOYMENT_CHECKLIST.md`](./PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- **Setup guide:** [`docs/setup/SETUP_GUIDE.md`](./SETUP_GUIDE.md)

## 🆘 Sorun Giderme

### "Module not found" hatası

```bash
rm -rf .next node_modules
npm install
npm run dev
```

### "Database connection failed"

```bash
# Supabase URL'i kontrol et
echo $NEXT_PUBLIC_SUPABASE_URL

# .env.local dosyasını kontrol et
cat .env.local | grep SUPABASE
```

### "GitHub OAuth redirect_uri_mismatch"

```bash
# Callback URL'leri kontrol et:
# Dev: http://localhost:3000/api/auth/callback/github
# Prod: https://portfolyo.tech/api/auth/callback/github
```

### "Stripe API key invalid"

```bash
# Test/Live mode kontrolü
echo $STRIPE_SECRET_KEY | grep -o '^sk_[^_]*'
# Development'ta: sk_test
# Production'da: sk_live
```

## 📞 Yardım

Sorun yaşarsan:

1. Bu dokümanı oku
2. [`ENVIRONMENT_SEPARATION_GUIDE.md`](./ENVIRONMENT_SEPARATION_GUIDE.md) kontrol et
3. Vercel logs: `vercel logs`
4. Sentry dashboard: https://sentry.io

---

**Son güncelleme:** 2025-10-03
