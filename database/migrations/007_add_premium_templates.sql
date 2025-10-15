-- Migration: Add Premium Template Support
-- Description: Adds is_premium_template column to portfolios table for tracking premium template usage
-- Date: 2025-01-11

-- Add premium template flag to portfolios
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_premium_template BOOLEAN DEFAULT false;

-- Add index for faster premium template queries
CREATE INDEX IF NOT EXISTS idx_portfolios_is_premium ON portfolios(is_premium_template);

-- Add comment for documentation
COMMENT ON COLUMN portfolios.is_premium_template IS 'Indicates if the portfolio uses a premium (PRO) template';

