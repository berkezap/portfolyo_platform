# PortfolYO Platform

GitHub projelerinizi 5 dakikada profesyonel portfolyoya dönüştüren platform.

---

## ⚠️ ÖNEMLİ: GIT WORKFLOW (MUTLAKA OKU!)

**Her commit öncesi hatırla:**

```
feature → preview → main
```

**Doğrudan `main` branch'e push YAPMA!**

👉 **Detaylı kılavuz:** [docs/WORKFLOW.md](./docs/WORKFLOW.md)

---

## Özellikler

- ** Hızlı Oluşturma**: 5 dakikada portfolyo
- ** Profesyonel Şablonlar**: 6 farklı tasarım
- ** GitHub Entegrasyonu**: Otomatik proje yükleme
- ** Responsive Design**: Tüm cihazlarda mükemmel
- ** AI Destekli**: Akıllı içerik önerileri

## 🔄 Git Workflow

**ÖNEMLI:** Production'a gitmeden önce **mutlaka** preview'da test edin!

```bash
# 1️⃣ Feature geliştir
git checkout -b feature/yeni-ozellik
npm run dev  # localhost test

# 2️⃣ Preview'da test et
git checkout preview
git merge feature/yeni-ozellik
git push origin preview
# → Test et: https://portfolyoplatform-git-preview-...vercel.app

# 3️⃣ Production'a al
git checkout main
git merge preview
git push origin main
# → Canlı: https://portfolyo.tech
```

📖 **Detaylı workflow:** [WORKFLOW.md](./docs/WORKFLOW.md)

## 📚 Dokümantasyon

### 🔄 **Development**

- [Git Workflow](./docs/WORKFLOW.md) - **ÖNCE BUNU OKU!**
- [Setup Guides](./docs/setup/) - Kurulum kılavuzları

### 🎨 **Brand Identity**

- [Brand Identity](./docs/brand-identity/README.md) - Marka kimliği ana sayfası

### 🔧 **Technical**

- [Docs Ana Sayfa](./docs/README.md) - Tüm dokümantasyon
- [Testing](./docs/testing/) - Test raporları
- [Technical](./docs/technical/) - Teknik dokümanlar

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**PortfolYO** - GitHub projelerinizi 5 dakikada portfolyoya dönüştürün! 🚀
