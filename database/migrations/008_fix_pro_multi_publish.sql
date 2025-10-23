-- Fix: PRO kullanıcılar birden fazla portfolio yayınlayabilsin
-- FREE kullanıcılar için constraint uygulama seviyesinde kontrol edilecek

-- Mevcut constraint'i kaldır
DROP INDEX IF EXISTS uniq_published_per_user;

-- PRO plan limits tablosu ekle (opsiyonel - gelecek için)
CREATE TABLE IF NOT EXISTS subscription_limits (
    plan TEXT PRIMARY KEY,
    max_portfolios INTEGER NOT NULL,
    max_published_portfolios INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan limitlerini tanımla
INSERT INTO subscription_limits (plan, max_portfolios, max_published_portfolios) 
VALUES 
    ('FREE', 3, 1),
    ('PRO', 10, 5)
ON CONFLICT (plan) DO UPDATE SET
    max_portfolios = EXCLUDED.max_portfolios,
    max_published_portfolios = EXCLUDED.max_published_portfolios;

-- İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_portfolios_user_published ON portfolios(user_id, is_published);
CREATE INDEX IF NOT EXISTS idx_subscription_limits_plan ON subscription_limits(plan);
