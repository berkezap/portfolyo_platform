# 🚀 PortfolYO Platform - Git Workflow

## 📋 Branch Stratejisi

```
main (production) ← portfolyo.tech
  ↑
  └── preview (staging) ← portfolyoplatform-git-preview-...vercel.app
        ↑
        └── feature/* (development) ← localhost:3000
```

---

## ✅ Doğru Workflow (MUTLAKA UYGULA)

### 1️⃣ Yeni Feature Başlat

```bash
# Main'den başla
git checkout main
git pull origin main

# Feature branch oluştur
git checkout -b feature/yeni-ozellik
# veya
git checkout -b bugfix/hata-duzeltme
```

### 2️⃣ Geliştirme Yap

```bash
# Localhost'ta çalış
npm run dev  # http://localhost:3000

# Test et:
# - Portfolio oluştur
# - Edit et
# - Publish et (subdomain OLUŞMAMALI dev'de)

# Commit et
git add .
git commit -m "feat: yeni özellik açıklaması"
```

### 3️⃣ Preview'da Test Et (ZORUNLU)

```bash
# Preview branch'e geç
git checkout preview
git pull origin preview

# Feature'ı merge et
git merge feature/yeni-ozellik

# Preview'a push et
git push origin preview

# 🎯 TEST ET!
# https://portfolyoplatform-git-preview-berkezaps-projects.vercel.app
# - GitHub login çalışıyor mu?
# - Portfolio CRUD OK mi?
# - UI düzgün mü?
# - Console error var mı?
```

### 4️⃣ Production'a Al (TEST SONRASI)

```bash
# Main branch'e geç
git checkout main
git pull origin main

# Preview'dan merge et
git merge preview

# Production'a push et
git push origin main

# 🎉 CANLI!
# https://portfolyo.tech
```

### 5️⃣ Temizlik

```bash
# Feature branch'i sil
git branch -d feature/yeni-ozellik
git push origin --delete feature/yeni-ozellik
```

---

## ❌ YAPMA! (Yaygın Hatalar)

### 🚫 Direkt Main'e Push

```bash
# ❌ YANLIŞ!
git checkout main
git commit -m "fix"
git push origin main  # ← Kullanıcıları etkileyebilir!
```

**Çözüm:** Git pre-push hook bunu engelleyecek!

### 🚫 Preview'ı Atla

```bash
# ❌ YANLIŞ!
feature → main  # Direkt production'a gitmek
```

**Doğrusu:**

```bash
# ✅ DOĞRU!
feature → preview → main
```

---

## 🔧 Git Hooks (Otomatik Koruma)

### Pre-Push Hook Aktif

`.git/hooks/pre-push` dosyası artık aktif:

- ✅ Main'e direkt push'u engeller
- ✅ Doğru workflow'u hatırlatır
- ✅ Preview URL'ini gösterir
- ⚠️ Acil durumlarda: `git push --no-verify`

**Test Et:**

```bash
# Bu hata verecek
git checkout main
git commit --allow-empty -m "test"
git push origin main
# ❌ HATA: Main branch'e direkt push yapılamaz!
```

---

## 📝 Branch İsimlendirme

```bash
# Yeni özellik
git checkout -b feature/portfolio-themes
git checkout -b feature/user-settings

# Hata düzeltme
git checkout -b bugfix/login-error
git checkout -b bugfix/responsive-layout

# Hotfix (acil production düzeltmesi)
git checkout -b hotfix/security-patch
```

---

## 🎯 Hızlı Komutlar

### Mevcut Durumu Gör

```bash
git branch                    # Hangi branch'teyim?
git status                    # Değişiklikler neler?
git log --oneline -5          # Son 5 commit
```

### Branch'ler Arası Geç

```bash
git checkout feature/isim     # Feature'a geç
git checkout preview          # Preview'a geç
git checkout main             # Main'e geç
```

### Merge İşlemleri

```bash
# Feature → Preview
git checkout preview
git merge feature/isim

# Preview → Main
git checkout main
git merge preview
```

### Conflict Çözme

```bash
git status                    # Hangi dosyalarda conflict var?
# Dosyaları düzenle
git add .
git commit -m "fix: merge conflicts resolved"
```

---

## 🌐 Environment URLs

| Ortam                 | Branch      | URL                                 | Kullanım               |
| --------------------- | ----------- | ----------------------------------- | ---------------------- |
| **Development**       | `feature/*` | `localhost:3000`                    | Kod yaz, hızlı test    |
| **Preview (Staging)** | `preview`   | `portfolyoplatform-git-preview-...` | Production öncesi TEST |
| **Production**        | `main`      | `portfolyo.tech`                    | Canlı kullanıcılar     |

---

## 📱 VS Code Extension (İsteğe Bağlı)

Workflow'u VS Code'da kolaylaştırmak için:

1. GitLens extension'ı kur
2. Git Graph extension'ı kur
3. Branch'leri görsel olarak takip et

---

## 🆘 Sorun Giderme

### "Main'e push yapamıyorum!"

✅ **İyi haber!** Hook çalışıyor. Doğru akışı kullan:

```bash
git checkout preview
git merge feature/isim
git push origin preview
# Test et!
git checkout main
git merge preview
git push origin main
```

### "Conflict aldım!"

```bash
git status                    # Hangi dosyalarda?
# Dosyaları düzenle (<<<< ==== >>>> işaretlerini temizle)
git add .
git commit -m "fix: resolve conflicts"
```

### "Preview'da hata var, geri almak istiyorum"

```bash
git checkout preview
git reset --hard HEAD~1       # Son commit'i geri al
git push origin preview --force
```

### "Acil hotfix lazım!"

```bash
# SADECE ACİL DURUMLARDA!
git checkout main
git pull origin main
# ... hızlı düzeltme yap ...
git commit -m "hotfix: critical security fix"
git push --no-verify origin main
```

---

## 📚 Daha Fazla Bilgi

- [Git Branch Strategy](https://nvie.com/posts/a-successful-git-branching-model/)
- [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## ✅ Checklist (Her Feature İçin)

- [ ] Feature branch oluşturdum
- [ ] Localhost'ta test ettim
- [ ] Preview'a merge ettim
- [ ] Preview URL'de test ettim
- [ ] GitHub OAuth çalışıyor
- [ ] UI/UX düzgün
- [ ] Console'da error yok
- [ ] Main'e merge ettim
- [ ] Production'da kontrol ettim
- [ ] Feature branch'i sildim

---

**🎉 Artık profesyonel bir workflow'un var! Unutma:**

> **feature → preview → main**
>
> Test et, sonra canlıya al!
