# Pull Request

## 📋 Checklist

- [ ] Feature branch'ten preview'a merge ediliyor mu?
- [ ] Preview'da test edildi mi? (`portfolyoplatform-git-preview-...vercel.app`)
- [ ] Tüm testler geçti mi?
- [ ] Breaking change var mı?

## 🔄 Workflow

```bash
# ✅ Doğru Akış
feature/yeni-ozellik → preview → main

# ❌ Yanlış Akış (YAPMA!)
feature/yeni-ozellik → main (direkt)
```

## 📝 Değişiklikler

### Ne değişti?

<!-- Kısa açıklama -->

### Neden değişti?

<!-- Problem ve çözüm -->

### Nasıl test edildi?

- [ ] Localhost: `npm run dev`
- [ ] Preview: https://portfolyoplatform-git-preview-berkezaps-projects.vercel.app
- [ ] Production: https://portfolyo.tech (sadece main merge'den sonra)

## 🎯 Preview Test Sonuçları

- [ ] GitHub OAuth çalışıyor
- [ ] Portfolio CRUD işlemleri OK
- [ ] UI/UX düzgün
- [ ] Console'da error yok

## 📸 Screenshots (opsiyonel)

<!-- Preview ve production karşılaştırması -->
