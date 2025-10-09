# 🔐 Ortam Ayırma - Acil Uygulama Rehberi

## 🚨 ACIL: Şu Anda Yapılması Gerekenler

### 1. GitHub'a Pushlanmış Secret'ları Kontrol Et

```bash
# Git history'de secret var mı kontrol et
git log --all --full-history --source -- .env.local .env.production

# Eğer varsa, secret'ları değiştirmen ZORUNLU!
```

**Eğer .env dosyaları GitHub'a pushlanmışsa:**

1. ⚠️ **TÜM SECRET'LARI DEĞİŞTİR** (acil öncelik!)
   - GitHub OAuth secret'ı yenile
   - Stripe secret key'i rotate et
   - Supabase service role key'i yenile
   - NextAuth secret değiştir
   - Redis token yenile

2. Git history'den temizle:

```bash
# BFG Repo-Cleaner ile (önerilen)
brew install bfg
bfg --delete-files .env.local
bfg --delete-files .env.production
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (TEHLİKELİ - team ile koordine et!)
git push origin --force --all
```

### 2. Mevcut Dosyaları Güvenli Hale Getir

```bash
cd /Users/berkezap/portfolyo-platform

# Mevcut .env.local'i yedekle (geçici)
cp .env.local .env.local.backup

# Mevcut .env.production'ı yedekle (geçici)
cp .env.production .env.production.backup

# Yeni template'leri kullan
cp .env.development .env.local

# Git'e KESİNLİKLE ekleme
git rm --cached .env.local .env.production 2>/dev/null || true
git rm --cached .env.local.backup .env.production.backup 2>/dev/null || true
```

### 3. Vercel Environment Variables Ayarla

**Vercel Dashboard:**

1. https://vercel.com/berkezaps-projects/portfolyo-platform/settings/environment-variables
2. Tüm production secret'larını buraya ekle
3. Environment: **Production** olarak seç
4. `.env.production.backup` dosyasındaki değerleri kullan

**CLI ile (alternatif):**

```bash
# Vercel CLI kur
npm i -g vercel

# Login ol
vercel login

# Production secrets ekle
vercel env add GITHUB_CLIENT_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... diğer secret'lar için tekrarla
```

## 📋 Ortam Yapılandırması

### Development (Yerel)

```bash
# .env.local oluştur (git'e pushlanmaz)
cp .env.development .env.local

# Gerçek değerleri doldur
nano .env.local
```

**Development için yeni servisler oluştur:**

1. **Supabase**: Yeni proje oluştur → "portfolyo-dev"
2. **GitHub OAuth**: Yeni app oluştur → Callback: `http://localhost:3000/api/auth/callback/github`
3. **Upstash Redis**: Yeni database → "portfolyo-dev"
4. **Stripe**: Mevcut test key'leri kullan (değiştirme)

### Production (Vercel)

```bash
# Vercel'de environment variables ayarla
# .env.production dosyasını SADECE referans olarak kullan
# ASLA git'e pushlama!
```

**Production için:**

1. **Supabase**: Mevcut prod database'i koru
2. **GitHub OAuth**: Yeni production app oluştur → Callback: `https://portfolyo.tech/api/auth/callback/github`
3. **Stripe**: LIVE keys kullan (`sk_live_*`, `pk_live_*`)
4. **Upstash Redis**: Production database ayır

### Staging (Opsiyonel)

```bash
# Vercel'de yeni environment oluştur
# Preview deployments için kullanabilirsin
```

## 🔄 Workflow

### Local Development

```bash
# 1. Branch oluştur
git checkout -b feature/yeni-ozellik

# 2. Development environment kullan
npm run dev
# Otomatik olarak .env.development ve .env.local okunur

# 3. Test et
npm run test

# 4. Commit et (.env dosyaları otomatik ignore edilir)
git add .
git commit -m "feat: yeni özellik"
git push origin feature/yeni-ozellik
```

### Production Deploy

```bash
# 1. PR oluştur
# GitHub'da Pull Request aç

# 2. Vercel otomatik preview deploy yapar
# Preview URL'de test et

# 3. Main'e merge et
git checkout main
git merge feature/yeni-ozellik

# 4. Vercel otomatik production'a deploy eder
# https://portfolyo.tech güncelenir
```

## 🎯 Kontrol Listesi

- [ ] .env.local ve .env.production git'ten kaldırıldı
- [ ] Git history temizlendi (eğer pushlanmışsa)
- [ ] Tüm production secret'ları Vercel'e eklendi
- [ ] Development için ayrı servisler oluşturuldu
- [ ] GitHub'da iki ayrı OAuth app var (dev + prod)
- [ ] Supabase'de iki ayrı proje var (dev + prod)
- [ ] Stripe test/live key ayrımı yapıldı
- [ ] .gitignore güncellendi
- [ ] Team'e bilgi verildi

## 🆘 Sorun Giderme

### "Cannot connect to database"

```bash
# Supabase URL'i kontrol et
echo $NEXT_PUBLIC_SUPABASE_URL

# Doğru environment'ta mısın?
echo $NODE_ENV
```

### "GitHub OAuth redirect_uri_mismatch"

```bash
# Callback URL'i kontrol et
# Development: http://localhost:3000/api/auth/callback/github
# Production: https://portfolyo.tech/api/auth/callback/github
```

### "Stripe API key invalid"

```bash
# Test/Live key karışıklığı
# Development: sk_test_*
# Production: sk_live_*
echo $STRIPE_SECRET_KEY | head -c 10
```

## 📞 İletişim

Sorun yaşarsan:

1. `docs/setup/` klasöründeki detaylı rehberlere bak
2. Vercel logs kontrol et: `vercel logs`
3. Sentry error tracking: https://sentry.io
