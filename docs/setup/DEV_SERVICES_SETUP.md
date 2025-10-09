# 🎯 Development Servisleri Kurulum Rehberi

Bu dosya `.env.local` dosyasını doldurmak için gereken adımları içerir.

## ✅ Kurulum Durumu

- [x] `.env.local` dosyası oluşturuldu
- [ ] GitHub OAuth Development App oluşturuldu
- [ ] Supabase Development Database oluşturuldu
- [ ] Upstash Redis Development Database oluşturuldu
- [ ] `.env.local` dosyası dolduruldu
- [ ] Development test edildi

---

## 1️⃣ GitHub OAuth Development App (5 dakika)

### Adımlar:

1. **GitHub Developer Settings'e git:**
   - 🔗 https://github.com/settings/developers
2. **"New OAuth App" butonuna tıkla**

3. **Formu doldur:**

   ```
   Application name: PortfolYO Development
   Homepage URL: http://localhost:3000
   Application description: Development environment for PortfolYO
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

4. **"Register application" tıkla**

5. **Client ID'yi kopyala:**
   - Sayfada görünecek
   - `.env.local` dosyasında `GITHUB_CLIENT_ID=` satırına yapıştır

6. **"Generate a new client secret" tıkla:**
   - Secret'ı kopyala (bir daha göremezsin!)
   - `.env.local` dosyasında `GITHUB_CLIENT_SECRET=` satırına yapıştır

### ✅ Sonuç:

```bash
GITHUB_CLIENT_ID=Ov23li...  (senin yeni dev app ID'n)
GITHUB_CLIENT_SECRET=gho_... (senin yeni dev secret'ın)
```

---

## 2️⃣ Supabase Development Database (10 dakika)

### Adımlar:

1. **Supabase Dashboard'a git:**
   - 🔗 https://supabase.com/dashboard
   - GitHub ile login ol

2. **"New project" butonuna tıkla**

3. **Proje ayarlarını yap:**

   ```
   Organization: Mevcut organization'ı seç
   Name: portfolyo-dev
   Database Password: [güçlü bir şifre oluştur ve kaydet!]
   Region: Europe West (en yakın)
   Pricing Plan: Free
   ```

4. **"Create new project" tıkla**
   - ⏱️ 2-3 dakika bekle (database oluşuyor)

5. **API Settings'i al:**
   - Sol menüden: **Settings** → **API**
   - Şunları kopyala:
     - **URL**: `https://xxxxx.supabase.co`
     - **anon public**: `eyJhbGc...` (Project API keys bölümünden)
     - **service_role**: `eyJhbGc...` (Project API keys bölümünden)

6. **`.env.local`'e yapıştır:**

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

7. **Database tablolarını oluştur:**
   - Sol menüden: **SQL Editor**
   - "New query" tıkla
   - `database/schema.sql` dosyasının içeriğini kopyala yapıştır
   - "Run" tıkla

### Schema dosyası nerede?

```bash
# Terminal'de çalıştır:
cat database/schema.sql
```

### ✅ Test et:

```bash
# Table Editor'da şu tabloları görmelisin:
- users
- portfolios
- github_repos
```

---

## 3️⃣ Upstash Redis Development Database (5 dakika)

### Adımlar:

1. **Upstash Console'a git:**
   - 🔗 https://console.upstash.com/
   - GitHub/Google ile login ol

2. **"Create Database" butonuna tıkla**

3. **Database ayarlarını yap:**

   ```
   Name: portfolyo-dev
   Type: Regional
   Region: europe-west1 (veya yakın bir Europe region)
   TLS: Enabled (default)
   Eviction: Enabled (default)
   ```

4. **"Create" butonuna tıkla**

5. **REST API bilgilerini al:**
   - Database açıldığında otomatik "Details" sayfası gelir
   - **REST API** sekmesinde:
     - **UPSTASH_REDIS_REST_URL**: `https://xxxxx.upstash.io`
     - **UPSTASH_REDIS_REST_TOKEN**: `AxxxxYYYY...`

6. **`.env.local`'e yapıştır:**
   ```bash
   UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AxxxxYYYY...
   ```

### ✅ Test et:

- Upstash console'da "Data Browser" → "CLI" sekmesine git
- `PING` yaz → `PONG` dönmeli

---

## 4️⃣ Environment Dosyasını Tamamla ve Test Et

### Kontrol Listesi:

```bash
# Terminal'de çalıştır:
cat .env.local | grep "BURAYA"
```

**Eğer "BURAYA" çıktısı varsa**, henüz doldurmadığın yerler var!

### Tamamlanmış `.env.local` örneği:

```bash
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-ZBdt47OxURN36ZTgln2QBI3BslS-70BZqUgjI4wkvE-DEV
NEXTAUTH_DEBUG=true

GITHUB_CLIENT_ID=Ov23liXXXXXXX       # ✅ Dolduruldu
GITHUB_CLIENT_SECRET=gho_XXXXXXXXX    # ✅ Dolduruldu

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PortfolYO (DEV)
NEXT_PUBLIC_DEMO_MODE=true

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co    # ✅ Dolduruldu
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...               # ✅ Dolduruldu
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...                   # ✅ Dolduruldu

STRIPE_PUBLISHABLE_KEY=pk_test_51RvJzx...              # ✅ Zaten var
STRIPE_SECRET_KEY=sk_test_51RvJzx...                   # ✅ Zaten var
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RvJzx... # ✅ Zaten var

UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io       # ✅ Dolduruldu
UPSTASH_REDIS_REST_TOKEN=AxxxxYYYY...                  # ✅ Dolduruldu
```

---

## 5️⃣ Development'ı Başlat ve Test Et

### Development'ı çalıştır:

```bash
# Terminal'de:
npm run dev
```

### Tarayıcıda test et:

1. **Ana sayfa:** http://localhost:3000
   - ✅ Sayfa yüklenmeli

2. **GitHub login test:**
   - "Sign in with GitHub" tıkla
   - ✅ Yeni dev OAuth app'ine yönlenmeli
   - ✅ Authorize edilince geri dönmeli

3. **Dashboard test:**
   - http://localhost:3000/dashboard
   - ✅ Repo listesi gelmeli (GitHub API çalışıyor)

4. **Database test:**
   - Bir portfolyo oluştur
   - Supabase dashboard → Table Editor → portfolios tablosuna bak
   - ✅ Yeni kayıt eklenmeli

### Hata kontrolü:

```bash
# Terminal'de environment check:
npm run env:check

# Çıktı şöyle olmalı:
NODE_ENV: development
APP_URL: http://localhost:3000
```

---

## 🎯 Özet

### ✅ Başarı Kriterleri:

- [x] `.env.local` dosyası tamamen dolduruldu (BURAYA yok)
- [x] `npm run dev` çalışıyor
- [x] http://localhost:3000 açılıyor
- [x] GitHub login çalışıyor
- [x] Supabase'e veri yazılıyor
- [x] Stripe test mode aktif
- [x] Redis bağlantısı var

### 🎉 Tamamlandı!

Development ortamın hazır! Artık:

- ✅ Production verilerini etkilemeden çalışabilirsin
- ✅ Test verileriyle deneyebilirsin
- ✅ Güvenle yeni özellikler geliştirebilirsin

---

## 🆘 Sorun Giderme

### "Module not found" hatası:

```bash
rm -rf .next node_modules
npm install
npm run dev
```

### "Invalid Supabase URL":

- `.env.local`'de `NEXT_PUBLIC_SUPABASE_URL` doğru mu?
- `https://` ile başlıyor mu?

### "GitHub OAuth redirect_uri_mismatch":

- GitHub OAuth app callback URL: `http://localhost:3000/api/auth/callback/github`
- `.env.local`'de `NEXTAUTH_URL=http://localhost:3000` olmalı

### "Redis connection failed":

- Upstash Redis REST API enabled mi?
- Token doğru kopyalandı mı?

---

## 📚 Sonraki Adımlar

1. **Production'ı ayarla:**
   - `ENVIRONMENT_SETUP_COMPLETE.md` dosyasına bak
   - Vercel'e production secret'ları ekle

2. **Stripe Webhook kurulumu:**
   - Development için: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

3. **Database migration'ları çalıştır:**
   - `database/migrations/` klasöründeki SQL'leri çalıştır

---

**Yardıma ihtiyacın olursa:**

- `docs/setup/QUICK_START_ENV_SETUP.md`
- `docs/setup/ENVIRONMENT_SEPARATION_GUIDE.md`
