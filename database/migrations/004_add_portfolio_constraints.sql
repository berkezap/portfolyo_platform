-- Migration: Add portfolio constraints and indexes for data integrity
-- Date: 2025-08-14
-- Purpose: Ensure slug uniqueness and single published portfolio per user

-- 1. Slug benzersizliği (tüm sistemde, case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_public_slug_unique
  ON public.portfolios (LOWER(public_slug))
  WHERE public_slug IS NOT NULL;

-- 2. Kullanıcı başına yalnızca 1 yayın (published)
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_user_single_published
  ON public.portfolios (user_id)
  WHERE is_published = true;

-- 3. Sorgu performansı için ek indeksler
CREATE INDEX IF NOT EXISTS idx_portfolios_user 
  ON public.portfolios(user_id);

CREATE INDEX IF NOT EXISTS idx_portfolios_updated_at 
  ON public.portfolios(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolios_published 
  ON public.portfolios(is_published, visibility)
  WHERE is_published = true;

-- 4. Slug değişim meta verilerini güncelleyen trigger function
CREATE OR REPLACE FUNCTION public.bump_slug_change_meta()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Sadece slug değiştiğinde sayaç ve timestamp güncelle
  IF (TG_OP = 'UPDATE') AND (NEW.public_slug IS DISTINCT FROM OLD.public_slug) THEN
    NEW.slug_change_count := COALESCE(OLD.slug_change_count, 0) + 1;
    NEW.slug_last_changed_at := NOW();
  END IF;
  RETURN NEW;
END; $$;

-- 5. Trigger'ı portfolios tablosuna bağla
DROP TRIGGER IF EXISTS trg_portfolios_slug_change ON public.portfolios;
CREATE TRIGGER trg_portfolios_slug_change
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW 
  EXECUTE FUNCTION public.bump_slug_change_meta();

-- 6. Mevcut portfolios tablosuna gerekli sütunlar (eğer yoksa)
DO $$
BEGIN
  -- slug_change_count sütunu ekle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' 
    AND column_name = 'slug_change_count'
  ) THEN
    ALTER TABLE public.portfolios 
    ADD COLUMN slug_change_count INTEGER DEFAULT 0;
  END IF;

  -- slug_last_changed_at sütunu ekle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' 
    AND column_name = 'slug_last_changed_at'
  ) THEN
    ALTER TABLE public.portfolios 
    ADD COLUMN slug_last_changed_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- 7. Mevcut veriler için slug_change_count'u sıfırla
UPDATE public.portfolios 
SET slug_change_count = 0 
WHERE slug_change_count IS NULL;

-- 8. Constraint'lerin başarıyla oluşturulduğunu doğrula
DO $$
BEGIN
  -- Slug uniqueness kontrolü
  IF EXISTS (
    SELECT LOWER(public_slug), COUNT(*) 
    FROM public.portfolios 
    WHERE public_slug IS NOT NULL 
    GROUP BY LOWER(public_slug) 
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate slugs found! Please resolve conflicts before applying constraints.';
  END IF;

  -- Multiple published portfolios kontrolü
  IF EXISTS (
    SELECT user_id, COUNT(*) 
    FROM public.portfolios 
    WHERE is_published = true 
    GROUP BY user_id 
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Multiple published portfolios per user found! Please resolve before applying constraints.';
  END IF;

  RAISE NOTICE 'Portfolio constraints migration completed successfully!';
END $$;
