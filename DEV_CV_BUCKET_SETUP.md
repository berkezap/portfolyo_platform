# 🚀 DEV ENVIRONMENT İÇİN CVS BUCKET OLUŞTURMA

## 📋 ADIM ADIM TALİMATLAR

### 1. Supabase Dashboard Aç

- Git: https://supabase.com/dashboard
- **Dev Project** seç: `portfolyo-dev` (URL: `tpqhtalqrnmyoykpomrz`)

### 2. Storage Bucket Oluştur

1. Sol menüden **"Storage"** tıkla
2. **"Create bucket"** butonuna tıkla
3. Bucket bilgileri:
   - **Name:** `cvs`
   - **Public bucket:** ✅ (işaretle)
   - **Allowed MIME types:** `application/pdf`
   - **File size limit:** `10485760` (10MB)
4. **"Create bucket"** tıkla

### 3. RLS Policies Ayarla

Bucket oluşturulduktan sonra:

1. **"SQL Editor"** sekmesine tıkla
2. Aşağıdaki kodu kopyala ve **"Run"** tıkla:

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

### 4. Bucket'ı Test Et

Policies ayarlandıktan sonra:

1. Bucket listesinde `cvs` göründüğünü kontrol et
2. **"Files"** sekmesine tıklayarak boş olduğunu gör

### 5. Development Server'ı Yeniden Başlat

```bash
# Terminal'de:
npm run dev
```

### 6. CV Upload'u Test Et

1. http://localhost:3000 aç
2. GitHub ile login ol
3. Portfolio oluştururken CV upload et
4. **Artık çalışacak!** ✅

---

## 📊 Environment Durumu (Bucket Oluşturulduktan Sonra)

| Environment     | Supabase URL           | CV Bucket                       | Durum |
| --------------- | ---------------------- | ------------------------------- | ----- |
| **Development** | `tpqhtalqrnmyoykpomrz` | `cvs` (**yeni oluşturuldu** ✅) | ✅    |
| **Production**  | `srgvpcwbcjsuostcexmn` | `cvs` (**zaten vardı** ✅)      | ✅    |

---

## 🎯 Önemli Notlar

### Güvenlik:

- ✅ **RLS Policies** aktif - sadece kendi CV'lerini upload/view edebilirler
- ✅ **Email bazlı klasörleme** - `user@email.com/uuid.pdf`
- ✅ **PDF only** - sadece PDF dosyaları kabul ediliyor
- ✅ **10MB limit** - büyük dosyalar engelleniyor

### Test:

Bucket oluşturduktan sonra development server'ı yeniden başlatmayı unutma!

---

## 🚀 Sonuç

Dev environment için `cvs` bucket'ı oluşturunca CV upload tamamen çalışacak! 📁
