-- Migration: Ensure public_slug exists and indexes (Dev)
-- Run this in Supabase SQL Editor for the dev project (tpqhtalqrnmyoykpomrz)

BEGIN;

-- 1) Add public_slug column if missing
ALTER TABLE IF EXISTS public.portfolios
ADD COLUMN IF NOT EXISTS public_slug TEXT;

-- 2) If there is a legacy slug column, copy values
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='slug') THEN
    UPDATE public.portfolios
    SET public_slug = slug
    WHERE public_slug IS NULL AND slug IS NOT NULL;
  END IF;
END $$;

-- 3) Create case-insensitive unique index for public_slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_public_slug_unique_dev
  ON public.portfolios (LOWER(public_slug))
  WHERE public_slug IS NOT NULL;

-- 4) Simple index to speed lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_public_slug_dev
  ON public.portfolios (public_slug);

COMMIT;

-- Notes:
-- After running, test /api/portfolio/check-slug and publishing flow in dev.
-- If constraint creation fails due to duplicates, run a query to list duplicates and resolve manually:
-- SELECT LOWER(public_slug) AS slug, count(*) FROM public.portfolios WHERE public_slug IS NOT NULL GROUP BY LOWER(public_slug) HAVING count(*) > 1;
