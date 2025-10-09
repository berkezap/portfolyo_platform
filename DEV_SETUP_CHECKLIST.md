# ✅ Development Kurulum Checklist

Tamamladıkça işaretle!

## 🚀 Hızlı Linkler

| Servis        | Link                                   | Süre  |
| ------------- | -------------------------------------- | ----- |
| GitHub OAuth  | https://github.com/settings/developers | 5 dk  |
| Supabase      | https://supabase.com/dashboard         | 10 dk |
| Upstash Redis | https://console.upstash.com/           | 5 dk  |

---

## 📋 Adım Adım Checklist

### 0️⃣ Hazırlık

- [x] `.env.local` dosyası oluşturuldu
- [x] Production değerleri `.env.local.production-backup`'a yedeklendi
- [ ] `docs/setup/DEV_SERVICES_SETUP.md` dosyasını okudum

### 1️⃣ GitHub OAuth App

- [ ] https://github.com/settings/developers açtım
- [ ] "New OAuth App" tıkladım
- [ ] App name: `PortfolYO Development`
- [ ] Homepage: `http://localhost:3000`
- [ ] Callback: `http://localhost:3000/api/auth/callback/github`
- [ ] Client ID kopyaladım → `.env.local`'e yapıştırdım
- [ ] Client Secret kopyaladım → `.env.local`'e yapıştırdım

### 2️⃣ Supabase Database

- [ ] https://supabase.com/dashboard açtım
- [ ] "New project" tıkladım
- [ ] Name: `portfolyo-dev`
- [ ] Database password kaydettim (önemli!)
- [ ] Region: Europe seçtim
- [ ] Proje oluşturulmasını bekledim (2-3 dk)
- [ ] Settings → API → URL kopyaladım → `.env.local`
- [ ] Settings → API → anon key kopyaladım → `.env.local`
- [ ] Settings → API → service_role key kopyaladım → `.env.local`
- [ ] SQL Editor → `database/schema.sql` içeriğini çalıştırdım
- [ ] Table Editor'da tabloları gördüm (users, portfolios, github_repos)

### 3️⃣ Upstash Redis

- [ ] https://console.upstash.com/ açtım
- [ ] "Create Database" tıkladım
- [ ] Name: `portfolyo-dev`
- [ ] Type: Regional
- [ ] Region: Europe seçtim
- [ ] Database oluşturuldu
- [ ] REST API → URL kopyaladım → `.env.local`
- [ ] REST API → Token kopyaladım → `.env.local`

### 4️⃣ Environment Dosyası Kontrolü

- [ ] `.env.local` dosyasında "BURAYA" kelimesi kalmadı
- [ ] Tüm placeholder'lar gerçek değerlerle değiştirildi
- [ ] Dosyayı kaydettim

### 5️⃣ Test

- [ ] `npm run dev` çalıştırdım
- [ ] http://localhost:3000 açıldı
- [ ] "Sign in with GitHub" tıkladım ve giriş yaptım
- [ ] Dashboard'a eriştim
- [ ] Repo listesi göründü
- [ ] Test portfolyo oluşturdum
- [ ] Supabase'de veri göründü

---

## 🎯 Tamamlanma Durumu

```bash
# Terminal'de çalıştır:
npm run env:check
```

**Beklenen çıktı:**

```
NODE_ENV: development
APP_URL: http://localhost:3000
```

---

## ✅ Tamamlandı mı?

### Evet, her şey çalışıyor! 🎉

Sonraki adım: **Production ayarları**

1. Production secret'larını Vercel'e taşı
2. Production için ayrı GitHub OAuth app oluştur
3. Stripe Live Mode'a geç

Detaylar: `ENVIRONMENT_SETUP_COMPLETE.md`

### Hayır, sorun var 😕

Sorun giderme: `docs/setup/DEV_SERVICES_SETUP.md` → "Sorun Giderme" bölümü

---

**Son güncelleme:** 2025-10-03
