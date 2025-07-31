# 📝 PortfolYO Platform - Genel Teknik TODO Listesi

Bu dosya; projeye eklenmesi, düzeltilmesi veya iyileştirilmesi gereken teknik ve ürün odaklı başlıkları içerir. Mevcut `TODO_LIST.md` dosyasından bağımsız, sade ve güncel bir yol haritası sunar.

---

## 1. Kod Kalitesi
 - [x] Tüm dosyalarda TypeScript tip güvenliği artırıldı, kritik `any` tipleri kaldırıldı. Sadece özel/dinamik durumlarda `unknown` veya union tipler var. Kodun tamamı type-safe.
      - Kodun tamamında `any` tipinden kaçınıldı, utility ve kritik fonksiyonlar explicit tiplendirildi.
 [x] Fonksiyon ve komponentler için JSDoc açıklamaları eklendi ve zorunlu hale getirildi.
      - Ana sayfa, dashboard, consent, portfolio, error boundary, utility fonksiyonlar ve hooks dosyalarında JSDoc açıklamaları tamamlandı.
      - Her yeni fonksiyon ve component için JSDoc zorunlu. Public API ve reusable component'ler öncelikli olarak belgelendi.
 [x] Magic string ve sabitler merkezi bir dosyada toplandı.
      - Tüm tekrar eden sabitler ve string ifadeler `src/constants/appConstants.ts` ve ilgili dosyalara taşındı. Kodda doğrudan string kullanımı kaldırıldı, import ile erişiliyor.
- [ ] Prettier ve code style guide entegrasyonu yap.
      - Kodun otomatik formatlanması ve tutarlı stil için Prettier ve bir style guide (örn. Airbnb) eklenmeli.
- [ ] Pre-commit hook (lint, test) ekle.
      - Commit öncesi otomatik lint ve test çalıştırmak için husky veya benzeri bir araç entegre edilmeli.

## 2. Güvenlik
- [ ] API endpoint’lerinde input validation ve rate limit uygula.
- [ ] Dosya yükleme işlemlerinde MIME ve boyut kontrolü ekle.
- [ ] XSS ve injection korumasını tüm kullanıcı girdilerinde sağla.
- [ ] Audit log ve gelişmiş hata yönetimi ekle.
- [ ] Otomatik backup ve restore stratejisi oluştur.

## 3. Performans
- [ ] Service Worker ve PWA desteğini tamamla.
- [ ] Critical CSS extraction ve resource hints uygula.
- [ ] API response caching ve memoization ekle.
- [ ] CDN ve edge caching entegrasyonu yap.
- [ ] Gerçek kullanıcı performans metriklerini izlemeye başla.

## 4. UX/UI
- [ ] Erişilebilirlik (WCAG) kontrollerini uygula.
- [ ] Dark mode desteği ekle.
- [ ] Logo ve brand asset yönetimini güncelle.
- [ ] Content style guide ve voice/tone guideline oluştur.
- [ ] Micro-interactions ve animasyon sistemi ekle.

## 5. Özellikler
- [ ] Yeni portfolio template’leri ve preview sistemi ekle.
- [ ] Onboarding flow ve portfolio sharing özelliklerini geliştir.
- [ ] Portfolio analytics dashboard oluştur.
- [ ] Custom domain ve team collaboration desteği ekle.

## 6. Test & Quality Assurance
- [ ] Unit test altyapısını (Jest/Vitest) kur ve coverage oranını artır.
- [ ] E2E testleri (Playwright/Cypress) tamamla.
- [ ] CI/CD pipeline’da otomatik test entegrasyonu yap.
- [ ] Test checklist ve senaryolarını güncelle.

## 7. Dokümantasyon
- [ ] Developer onboarding guide hazırla.
- [ ] API ve component JSDoc’larını tamamla.
- [ ] Sık güncellenen dokümanlar için versiyonlama uygula.
- [ ] Swagger veya benzeri API dokümantasyon aracı ekle.

---

> Son güncelleme: 2025-07-31
> Hazırlayan: GitHub Copilot
