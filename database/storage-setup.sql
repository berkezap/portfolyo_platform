-- PortfolYO Storage Setup
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- CV dosyaları için storage bucket oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Storage policy: Kullanıcılar sadece kendi CV dosyalarını yükleyebilir
CREATE POLICY "Users can upload own CV files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cvs' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.email() = (storage.foldername(name))[1])
  );

-- Storage policy: Kullanıcılar sadece kendi CV dosyalarını okuyabilir
CREATE POLICY "Users can view own CV files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cvs' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.email() = (storage.foldername(name))[1])
  );

-- Storage policy: Kullanıcılar sadece kendi CV dosyalarını güncelleyebilir
CREATE POLICY "Users can update own CV files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cvs' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.email() = (storage.foldername(name))[1])
  );

-- Storage policy: Kullanıcılar sadece kendi CV dosyalarını silebilir
CREATE POLICY "Users can delete own CV files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cvs' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.email() = (storage.foldername(name))[1])
  ); 