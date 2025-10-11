# 🌍 Translation Guide - Çeviri Rehberi

## 📋 Çevrilmesi Gereken Dosyalar

Yapı hazır! Şimdi sadece **İngilizce çevirileri** yapman gerekiyor.

### 1️⃣ Privacy Policy (Gizlilik Politikası)

**Kaynak Dosya:** `src/content/privacy-policy-tr.tsx`  
**Hedef Dosya:** `src/content/privacy-policy-en.tsx`

### 2️⃣ Terms of Service (Kullanım Şartları)

**Kaynak Dosya:** `src/app/[locale]/terms-of-service/page.tsx` (15-326 satırlar arası)  
**Hedef Dosya:** `src/content/terms-of-service-en.tsx` (oluşturulacak)

### 3️⃣ GDPR Settings (Veri Koruma Ayarları)

**Kaynak Dosya:** `src/app/[locale]/gdpr-settings/page.tsx`  
**Hedef Dosya:** `src/content/gdpr-settings-en.tsx` (oluşturulacak)

---

## 🤖 AI ile Çeviri Nasıl Yapılır?

### Adım 1: Dosyayı Aç

```bash
# Örnek: Privacy Policy TR dosyasını aç
cat src/content/privacy-policy-tr.tsx
```

### Adım 2: ChatGPT'ye Yapıştır

```
Lütfen bu React component'indeki TÜM Türkçe metinleri İngilizce'ye çevir.
HTML yapısını AYNEN koru, sadece metinleri çevir.

[BURAYA DOSYA İÇERİĞİNİ YAPIŞTIR]
```

### Adım 3: Çıktıyı Kaydet

ChatGPT'nin çevirdiği içeriği ilgili `-en.tsx` dosyasına kaydet.

---

## ✅ Örnek: privacy-policy-en.tsx

```tsx
export default function PrivacyPolicyEN() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🛡️ PortfolYO Privacy Policy</h1>
        <p className="text-lg text-gray-600">Last Updated: December 20, 2024 | Version: 1.0</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📋 Overview</h2>
          <p className="text-gray-700 mb-4">
            PortfolYO ("we", "our", "platform") is committed to protecting the privacy of our users.
            This Privacy Policy explains how your personal data is collected, used, and protected.
          </p>
          {/* ... devamı */}
        </div>
      </div>
    </>
  );
}
```

---

## 📝 Kontrol Listesi

- [x] **Privacy Policy**: ✅ Yapı tamam! Sadece İngilizce çeviri kaldı
  - [x] `privacy-policy-tr.tsx` oluşturuldu
  - [x] Ana sayfa locale'e göre düzenlendi
  - [ ] 🔴 `privacy-policy-en.tsx` çevirisi yapılacak (SEN YAPACAKSIN)
- [x] **Terms of Service**: ✅ Placeholder hazır
  - [ ] 🟡 İçerik eklenecek (Şimdilik görev listesinde)
- [x] **GDPR Settings**: ✅ Tamamen hazır!
  - [x] Locale desteği eklendi
  - [x] TR/EN metinler dahili olarak yönetiliyor

---

## 🎯 Sonuç

**Yapı tamam!** Şimdi sen:

1. ChatGPT'ye git
2. TR dosyasını kopyala
3. "Bunu İngilizce'ye çevir" de
4. Çıktıyı EN dosyasına yapıştır

**Tüm yapı hazır, sadece çeviri kaldı!** 🚀
