-- Subscription status table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(20) NOT NULL DEFAULT 'FREE', -- 'FREE' or 'PRO'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  notes TEXT, -- For manual activation tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_email ON user_subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan ON user_subscriptions(plan);

-- Update portfolios table to track premium templates
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_premium_template BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_portfolios_is_premium ON portfolios(is_premium_template);

-- Row Level Security (RLS) policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own subscription
CREATE POLICY "Users can view own subscription" ON user_subscriptions
    FOR SELECT USING (user_email = auth.jwt() ->> 'email');

-- Only service role can insert/update subscriptions
CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Insert test data for development
INSERT INTO user_subscriptions (user_email, plan, status, notes) VALUES 
('ihsanberke.ozsap@std.yeditepe.edu.tr', 'PRO', 'active', 'Developer test account')
ON CONFLICT (user_email) DO UPDATE SET plan = 'PRO', status = 'active';
