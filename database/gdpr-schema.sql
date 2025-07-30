-- GDPR Compliance Database Schema
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Consents table - Kullanıcı consent'lerini saklar
CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    analytics_consent BOOLEAN DEFAULT false,
    feedback_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    third_party_consent BOOLEAN DEFAULT false,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR Data Requests table - Kullanıcı GDPR taleplerini saklar
CREATE TABLE IF NOT EXISTS gdpr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    request_type TEXT NOT NULL, -- 'access', 'rectification', 'erasure', 'portability', 'restrict', 'object'
    request_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
    request_data JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Retention Log table - Veri saklama sürelerini takip eder
CREATE TABLE IF NOT EXISTS data_retention_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    user_id TEXT,
    retention_period_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deletion_reason TEXT -- 'retention_expired', 'user_request', 'gdpr_compliance'
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_user_id ON gdpr_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_status ON gdpr_requests(request_status);
CREATE INDEX IF NOT EXISTS idx_data_retention_log_user_id ON data_retention_log(user_id);
CREATE INDEX IF NOT EXISTS idx_data_retention_log_expires_at ON data_retention_log(expires_at);

-- Updated_at trigger function (eğer yoksa)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_user_consents_updated_at 
    BEFORE UPDATE ON user_consents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gdpr_requests_updated_at 
    BEFORE UPDATE ON gdpr_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Kullanıcılar sadece kendi verilerini görebilir
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_log ENABLE ROW LEVEL SECURITY;

-- User Consents Policies
CREATE POLICY "Users can view own consents" ON user_consents
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

CREATE POLICY "Users can insert own consents" ON user_consents
    FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id = auth.email());

CREATE POLICY "Users can update own consents" ON user_consents
    FOR UPDATE USING (user_id = auth.uid()::text OR user_id = auth.email());

-- GDPR Requests Policies
CREATE POLICY "Users can view own gdpr requests" ON gdpr_requests
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

CREATE POLICY "Users can insert own gdpr requests" ON gdpr_requests
    FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id = auth.email());

-- Data Retention Log Policies (Admin only for viewing)
CREATE POLICY "Users can view own retention logs" ON data_retention_log
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

-- GDPR Compliance Functions

-- Kullanıcı consent'ini kontrol et
CREATE OR REPLACE FUNCTION check_user_consent(
    p_user_id TEXT,
    p_consent_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    has_consent BOOLEAN := false;
BEGIN
    SELECT 
        CASE p_consent_type
            WHEN 'analytics' THEN analytics_consent
            WHEN 'feedback' THEN feedback_consent
            WHEN 'marketing' THEN marketing_consent
            WHEN 'third_party' THEN third_party_consent
            ELSE false
        END INTO has_consent
    FROM user_consents
    WHERE user_id = p_user_id
    ORDER BY consent_date DESC
    LIMIT 1;
    
    RETURN COALESCE(has_consent, false);
END;
$$ LANGUAGE plpgsql;

-- Eski verileri temizle (Retention policy)
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    retention_periods RECORD;
BEGIN
    -- GDPR retention periods (gün cinsinden)
    FOR retention_periods IN 
        SELECT 
            'portfolios' as table_name, 730 as days
        UNION ALL SELECT 'analytics_events', 90
        UNION ALL SELECT 'user_feedback', 180
        UNION ALL SELECT 'user_sessions', 30
    LOOP
        EXECUTE format('
            DELETE FROM %I 
            WHERE created_at < NOW() - INTERVAL ''%s days''
        ', retention_periods.table_name, retention_periods.days);
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE 'Deleted % records from %', deleted_count, retention_periods.table_name;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- GDPR request oluştur
CREATE OR REPLACE FUNCTION create_gdpr_request(
    p_user_id TEXT,
    p_request_type TEXT,
    p_request_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    request_id UUID;
BEGIN
    INSERT INTO gdpr_requests (user_id, request_type, request_data)
    VALUES (p_user_id, p_request_type, p_request_data)
    RETURNING id INTO request_id;
    
    RETURN request_id;
END;
$$ LANGUAGE plpgsql;

-- GDPR request durumunu güncelle
CREATE OR REPLACE FUNCTION update_gdpr_request_status(
    p_request_id UUID,
    p_status TEXT,
    p_processed_data JSONB DEFAULT '{}'::jsonb
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE gdpr_requests 
    SET 
        request_status = p_status,
        request_data = request_data || p_processed_data,
        processed_at = CASE WHEN p_status = 'completed' THEN NOW() ELSE processed_at END,
        updated_at = NOW()
    WHERE id = p_request_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Veri saklama log'una kayıt ekle
CREATE OR REPLACE FUNCTION log_data_retention(
    p_table_name TEXT,
    p_record_id UUID,
    p_user_id TEXT,
    p_retention_days INTEGER
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO data_retention_log (
        table_name, 
        record_id, 
        user_id, 
        retention_period_days, 
        expires_at
    )
    VALUES (
        p_table_name,
        p_record_id,
        p_user_id,
        p_retention_days,
        NOW() + (p_retention_days || ' days')::INTERVAL
    );
END;
$$ LANGUAGE plpgsql; 