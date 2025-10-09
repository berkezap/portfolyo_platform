# 🔧 DEV DATABASE DÜZELTMESİ

## 1️⃣ ÖNCE DURUM KONTROLÜ

Supabase SQL Editor'da şunu çalıştır:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name='portfolios'
ORDER BY column_name;
```

**Bu çıktıyı bana gönder** - hangi sütunlar var görelim.

---

## 2️⃣ BASIT DÜZELTMELERİ UYGULAk

Şunu tek seferde çalıştır:

```sql
-- Sütun ekle (yoksa)
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS public_slug TEXT;

-- Basit index ekle
CREATE INDEX IF NOT EXISTS idx_portfolios_public_slug_simple
ON public.portfolios (public_slug);
```

**Bu hata verirse, hata mesajını bana gönder.**

---

## 3️⃣ TEST ET

Dev sunucuyu başlat:

```bash
npm run dev
```

Portfolio oluşturmayı dene. Hala "Portfolio bulunamadı" hatası alırsan:

1. **Tarayıcı Console** aç (F12)
2. **Network** sekmesine git
3. Portfolio oluştur
4. `/api/portfolio/generate` isteğinin **yanıtını** bana gönder

---

## 🎯 ÖZET

1. İlk SQL'i çalıştır → sonucu gönder
2. İkinci SQL'i çalıştır → hata varsa gönder
3. npm run dev → test et
4. Hala hata varsa Network yanıtını gönder

**Hangi adımda takıldığını söyle, o adıma özel yardım vereyim!**
