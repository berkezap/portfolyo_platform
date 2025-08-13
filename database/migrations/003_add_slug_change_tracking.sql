-- Migration: Add slug change tracking for freemium model
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Add columns for tracking slug changes
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS slug_last_changed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS slug_change_count INTEGER DEFAULT 0;

-- Create index for slug change tracking
CREATE INDEX IF NOT EXISTS idx_portfolios_slug_changed ON portfolios(slug_last_changed_at);

-- Update existing published portfolios to set initial slug change date
UPDATE portfolios 
SET slug_last_changed_at = published_at
WHERE slug IS NOT NULL AND published_at IS NOT NULL AND slug_last_changed_at IS NULL;
