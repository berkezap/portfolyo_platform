# 📍 PRODUCTION'DA CV NEREDEN YÜKLENİYOR?

## 🔍 Cevap: Production Supabase Storage'da `cvs` Bucket'ına

### Production Environment Bilgileri:

- **Supabase URL:** `https://srgvpcwbcjsuostcexmn.supabase.co`
- **Storage Bucket:** `cvs` (public bucket)
- **Dosya Format:** PDF only
- **Maksimum Boyut:** 10MB

### CV Upload Akışı:

1. **Kullanıcı** PDF seçer
2. **API** (`/api/upload/cv`) çağrılır
3. **Supabase Storage** signed URL oluşturur
4. **Dosya** production `cvs` bucket'ına yüklenir
5. **Public URL** döner ve portfolio'da kullanılır

### Bucket Yapısı:

```
cvs/
├── user1@example.com/
│   ├── uuid1.pdf
│   └── uuid2.pdf
├── user2@example.com/
│   └── uuid3.pdf
```

### Production'da Bucket Kontrol Etmek İçin:

1. **Supabase Dashboard** aç: https://supabase.com/dashboard
2. **Production Project** seç: `srgvpcwbcjsuostcexmn` (ana proje)
3. **Storage** sekmesine git
4. `cvs` bucket'ının varlığını kontrol et
5. **Files** sekmesinden yüklenen CV'leri görebilirsin

### Önemli Notlar:

- ✅ **Production'da zaten çalışıyor** (bucket var)
- ✅ **Dev/Prod ayrımı tamamlandı**
- ✅ **CV'ler production'da kalıcı** olarak saklanıyor
- ✅ **Public URL'ler** ile portfolio'lardan erişilebilir

---

## 📊 Environment Karşılaştırması

| Özellik           | Development                | Production                 |
| ----------------- | -------------------------- | -------------------------- |
| **Supabase URL**  | `tpqhtalqrnmyoykpomrz`     | `srgvpcwbcjsuostcexmn`     |
| **CV Bucket**     | `cvs` (yeni oluşturulacak) | `cvs` (zaten var) ✅       |
| **Dosya Saklama** | Geçici test                | **Kalıcı** ✅              |
| **Erişim**        | Dev kullanıcılar           | **Gerçek kullanıcılar** ✅ |

---

## 🎯 Sonuç

**Production'da CV'ler `srgvpcwbcjsuostcexmn.supabase.co` storage'daki `cvs` bucket'ına yükleniyor ve kalıcı olarak saklanıyor!** 🚀

Dev environment'ta bucket oluşturunca her şey çalışacak. 📁
