-- PortfolYO Database Schema
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolios table - Ana portfolyo kayıtları tablosu
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- GitHub user ID veya email (NextAuth'dan)
    selected_template TEXT NOT NULL, -- "modern-developer", "creative-portfolio", "professional-tech"
    selected_repos JSONB NOT NULL DEFAULT '[]'::jsonb, -- Seçilen repo isimleri: ["repo1", "repo2"]
    cv_url TEXT, -- CV dosyasının URL'i (S3, Vercel Blob vs.)
    generated_html TEXT, -- Oluşturulan portfolyonun HTML içeriği
    metadata JSONB DEFAULT '{}'::jsonb, -- Ek veriler (user info, stats vs.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolios_template ON portfolios(selected_template);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_portfolios_updated_at 
    BEFORE UPDATE ON portfolios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Waitlist table for Pro features
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    feature TEXT NOT NULL DEFAULT 'pro',
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_waitlist_email_feature ON waitlist(email, feature);

-- Row Level Security (RLS) - Kullanıcılar sadece kendi portfolyolarını görebilir
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Policy: Kullanıcılar sadece kendi portfolyolarını okuyabilir
CREATE POLICY "Users can view own portfolios" ON portfolios
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

-- Policy: Kullanıcılar sadece kendi portfolyolarını oluşturabilir
CREATE POLICY "Users can insert own portfolios" ON portfolios
    FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id = auth.email());

-- Policy: Kullanıcılar sadece kendi portfolyolarını güncelleyebilir
CREATE POLICY "Users can update own portfolios" ON portfolios
    FOR UPDATE USING (user_id = auth.uid()::text OR user_id = auth.email());

-- Policy: Kullanıcılar sadece kendi portfolyolarını silebilir
CREATE POLICY "Users can delete own portfolios" ON portfolios
    FOR DELETE USING (user_id = auth.uid()::text OR user_id = auth.email()); 