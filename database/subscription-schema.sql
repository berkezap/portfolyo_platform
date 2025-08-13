-- Stripe Subscription Schema
-- Bu dosyayı mevcut schema.sql'den sonra çalıştırın

-- Users table - Kullanıcı subscription bilgileri
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    user_id TEXT UNIQUE, -- NextAuth user ID or GitHub ID
    
    -- Subscription fields
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'canceled', 'past_due', 'incomplete')),
    subscription_id TEXT, -- Stripe subscription ID
    customer_id TEXT, -- Stripe customer ID
    plan_type TEXT DEFAULT 'FREE' CHECK (plan_type IN ('FREE', 'PRO', 'PREMIUM')),
    subscription_current_period_start TIMESTAMP WITH TIME ZONE,
    subscription_current_period_end TIMESTAMP WITH TIME ZONE,
    
    -- Limits based on plan
    max_portfolios INTEGER DEFAULT 1,
    current_portfolios INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);

-- Updated_at trigger for users
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (user_id = auth.uid()::text OR email = auth.email());

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (user_id = auth.uid()::text OR email = auth.email());

-- Service role can insert users (for registration)
CREATE POLICY "Service role can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Update portfolios table to reference users
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS user_uuid UUID REFERENCES users(id);

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_portfolios_user_uuid ON portfolios(user_uuid);

-- Function to check portfolio limits
CREATE OR REPLACE FUNCTION check_portfolio_limit()
RETURNS TRIGGER AS $$
DECLARE
    user_record RECORD;
    current_count INTEGER;
BEGIN
    -- Get user's plan limits
    SELECT max_portfolios INTO user_record
    FROM users 
    WHERE user_id = NEW.user_id;
    
    IF user_record.max_portfolios = -1 THEN
        -- Unlimited portfolios (Premium plan)
        RETURN NEW;
    END IF;
    
    -- Count current portfolios
    SELECT COUNT(*) INTO current_count
    FROM portfolios 
    WHERE user_id = NEW.user_id;
    
    -- Check if user has reached the limit
    IF current_count >= user_record.max_portfolios THEN
        RAISE EXCEPTION 'Portfolio limit reached for your plan. Please upgrade to create more portfolios.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce portfolio limits
CREATE TRIGGER enforce_portfolio_limit
    BEFORE INSERT ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION check_portfolio_limit();

-- Payment history table (optional, for tracking)
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    stripe_payment_intent_id TEXT,
    amount INTEGER, -- in cents
    currency TEXT DEFAULT 'usd',
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payment history
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);
