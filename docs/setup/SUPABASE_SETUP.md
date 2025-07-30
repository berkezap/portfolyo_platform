# 🚀 Supabase Kurulum Talimatları

## 📋 ÖNEMLİ: Bu adımları sırayla takip edin!

PortfolYO platformunun çalışması için Supabase'de aşağıdaki adımları **SIRAYLA** takip edin:

### 🔥 **ADIM 1: Supabase Projesi Oluşturma**

1. **Supabase'e gidin**: https://supabase.com/dashboard
2. **"New Project"** butonuna tıklayın
3. **Proje adı**: `portfolyo-platform` (veya istediğiniz bir isim)
4. **Database Password**: Güçlü bir şifre oluşturun (not alın!)
5. **Region**: Size en yakın bölgeyi seçin
6. **"Create new project"** butonuna tıklayın
7. **Proje oluşturulana kadar bekleyin** (2-3 dakika)

### 🔥 **ADIM 2: Environment Variables Alma**

1. **Proje oluşturulduktan sonra**:
   - **Settings** → **API** sekmesine gidin
   - **Project URL**'yi kopyalayın
   - **anon public** key'i kopyalayın
   - **service_role** key'i kopyalayın

2. **`.env.local` dosyasını oluşturun**:
   ```bash
   cp env.example .env.local
   ```

3. **`.env.local` dosyasını düzenleyin**:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   ```

### 🔥 **ADIM 3: Database Schema Kurulumu**

1. **SQL Editor** sekmesine gidin
2. **`database/schema.sql`** dosyasının içeriğini kopyalayın
3. **SQL Editor'da yapıştırın** ve **"Run"** butonuna tıklayın
4. **Başarılı olduğunu doğrulayın**

### 🔥 **ADIM 4: Storage Bucket Kurulumu**

1. **SQL Editor**'de **`database/storage-setup.sql`** dosyasının içeriğini kopyalayın
2. **Yapıştırın** ve **"Run"** butonuna tıklayın
3. **Başarılı olduğunu doğrulayın**

### 🔥 **ADIM 5: Storage Bucket Manuel Kontrolü**

1. **Storage** sekmesine gidin
2. **`cvs`** adında bir bucket'ın oluştuğunu doğrulayın
3. **Bucket'ın public olduğunu** kontrol edin
4. **Policies** kısmında 4 policy'nin aktif olduğunu doğrulayın:
   - Users can upload own CV files
   - Users can view own CV files
   - Users can update own CV files
   - Users can delete own CV files

### 🔥 **ADIM 6: RLS (Row Level Security) Kontrolü**

1. **Table Editor**'e gidin
2. **`portfolios`** tablosunu seçin
3. **RLS'nin aktif olduğunu** kontrol edin
4. **Gerekirse RLS'yi etkinleştirin**

### 🔥 **ADIM 7: Test Etme**

1. **Platform'u yeniden başlatın**:
   ```bash
   npm run dev
   ```

2. **Dashboard'a gidin**: http://localhost:3000/dashboard

3. **CV upload'u test edin** - "Signed URL alınamadı" hatası almamalısınız

## 🔧 **SORUN GİDERME**

### ❌ "Signed URL alınamadı" Hatası

**Çözüm:**
1. Storage bucket'ın oluştuğunu kontrol edin
2. Policy'lerin doğru kurulduğunu kontrol edin
3. Environment variables'ların doğru olduğunu kontrol edin

### ❌ "Unauthorized" Hatası

**Çözüm:**
1. RLS'nin aktif olduğunu kontrol edin
2. Database schema'nın kurulduğunu kontrol edin

### ❌ "Database connection failed" Hatası

**Çözüm:**
1. Supabase URL'nin doğru olduğunu kontrol edin
2. API key'lerin doğru olduğunu kontrol edin
3. Proje'nin aktif olduğunu kontrol edin

## 📋 **KONTROL LİSTESİ**

- [ ] Supabase projesi oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Database schema kuruldu
- [ ] Storage bucket oluşturuldu
- [ ] Storage policy'ler kuruldu
- [ ] RLS aktif
- [ ] Platform test edildi

## 🎯 **SONUÇ**

Bu adımları tamamladıktan sonra:
- ✅ CV upload çalışacak
- ✅ Database işlemleri çalışacak
- ✅ Platform tamamen fonksiyonel olacak

---

**Not**: Herhangi bir sorun yaşarsanız, yukarıdaki adımları tekrar kontrol edin. Supabase kurulumu kritik öneme sahiptir! 