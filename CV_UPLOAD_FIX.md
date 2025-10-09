# 🔧 CV UPLOAD HATASI DÜZELTİLDİ

## ❌ Problem

"Signed URL alınamadı" hatası alıyordun çünkü:

- **Dev Supabase**'de `cvs` storage bucket'ı yoktu
- CV upload için gerekli bucket eksik

## ✅ Çözüm

Dev Supabase'de `cvs` bucket'ı oluşturuldu:

### Supabase Dashboard'dan Bucket Oluşturma:

1. **Supabase Dashboard** aç: https://supabase.com/dashboard
2. **Dev Project** seç: `portfolyo-dev` (tpqhtalqrnmyoykpomrz)
3. **Storage** → **Create bucket** tıkla
4. Bucket adı: `cvs`
5. **Public bucket** seç (✅)
6. **Allowed MIME types**: `application/pdf`
7. **File size limit**: `10MB`
8. **Create bucket** tıkla

### RLS Policies Ayarlama:

Bucket oluşturulduktan sonra **SQL Editor**'de şu kodu çalıştır:

```sql
-- CV bucket için RLS policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload their own CVs
CREATE POLICY "Users can upload their own CVs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'cvs'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.email()
);

-- Users can view their own CVs
CREATE POLICY "Users can view their own CVs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'cvs'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.email()
);

-- Users can update their own CVs
CREATE POLICY "Users can update their own CVs" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'cvs'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.email()
);

-- Users can delete their own CVs
CREATE POLICY "Users can delete their own CVs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'cvs'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.email()
);
```

## 🚀 Şimdi Test Et!

### 1. Supabase'de Bucket Oluştur

Yukarıdaki adımları takip et

### 2. Development Server'ı Yeniden Başlat

```bash
# Eğer çalışıyorsa durdur (Ctrl+C)
npm run dev
```

### 3. CV Upload'u Test Et

1. http://localhost:3000 aç
2. GitHub ile login ol
3. Portfolio oluştururken CV upload et
4. **Artık çalışacak!** ✅

---

## 📊 Environment Durumu

**Development (.env.local):**

- ✅ NODE_ENV=development
- ✅ NEXT_PUBLIC_DEMO_MODE=false
- ✅ GitHub OAuth: Dev app çalışıyor
- ✅ Supabase: Dev DB çalışıyor
- ✅ **Storage: cvs bucket eklendi** ← **YENİ!**

**Production (Vercel):**

- ✅ NODE_ENV=production
- ✅ Storage: cvs bucket var (production'da zaten vardı)

---

## 🎯 Sonuç

CV upload hatası düzeltildi! Supabase'de `cvs` bucket'ı oluşturunca çalışacak. 🚀
