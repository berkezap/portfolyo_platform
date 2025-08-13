-- Migration: Add publish-related columns to portfolios table
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Add new columns for publishing functionality
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status);

-- Update existing portfolios to have draft status
UPDATE portfolios 
SET status = 'draft' 
WHERE status IS NULL;

-- Add constraint to ensure status values are valid
ALTER TABLE portfolios 
ADD CONSTRAINT check_portfolio_status 
CHECK (status IN ('draft', 'published'));
