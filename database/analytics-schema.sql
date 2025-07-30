-- Analytics Database Schema
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Analytics Events table - Kullanıcı davranış verilerini saklar
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    user_id TEXT,
    events JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions table - Oturum bilgilerini saklar
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page_views INTEGER DEFAULT 0,
    total_events INTEGER DEFAULT 0,
    user_agent TEXT,
    referrer TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT
);

-- User Feedback table - Kullanıcı geri bildirimlerini saklar
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    session_id TEXT,
    feedback_type TEXT NOT NULL, -- 'survey', 'usability_test', 'interview', 'general'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    page_url TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usability Tests table - Usability test sonuçlarını saklar
CREATE TABLE IF NOT EXISTS usability_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_name TEXT NOT NULL,
    participant_id TEXT,
    session_id TEXT,
    task_name TEXT NOT NULL,
    task_success BOOLEAN,
    task_duration INTEGER, -- milliseconds
    error_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Journey Steps table - Kullanıcı yolculuğu adımlarını saklar
CREATE TABLE IF NOT EXISTS user_journey_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    session_id TEXT,
    step_name TEXT NOT NULL,
    step_order INTEGER,
    duration INTEGER, -- milliseconds
    success BOOLEAN,
    properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_usability_tests_participant_id ON usability_tests(participant_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_steps_user_id ON user_journey_steps(user_id);

-- Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE usability_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_steps ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_events
CREATE POLICY "Users can view own analytics" ON analytics_events
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

CREATE POLICY "Service can insert analytics" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

CREATE POLICY "Service can insert sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- Policies for user_feedback
CREATE POLICY "Users can view own feedback" ON user_feedback
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

CREATE POLICY "Users can insert feedback" ON user_feedback
    FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id = auth.email());

-- Policies for usability_tests
CREATE POLICY "Users can view own tests" ON usability_tests
    FOR SELECT USING (participant_id = auth.uid()::text OR participant_id = auth.email());

CREATE POLICY "Users can insert tests" ON usability_tests
    FOR INSERT WITH CHECK (participant_id = auth.uid()::text OR participant_id = auth.email());

-- Policies for user_journey_steps
CREATE POLICY "Users can view own journey steps" ON user_journey_steps
    FOR SELECT USING (user_id = auth.uid()::text OR user_id = auth.email());

CREATE POLICY "Service can insert journey steps" ON user_journey_steps
    FOR INSERT WITH CHECK (true);

-- Functions for analytics
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_sessions 
    SET last_activity = NOW(),
        total_events = total_events + 1
    WHERE session_id = NEW.session_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update session activity
CREATE TRIGGER update_session_activity_trigger 
    AFTER INSERT ON analytics_events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_session_activity();

-- Function to get user journey analytics
CREATE OR REPLACE FUNCTION get_user_journey_analytics(user_email TEXT, days INTEGER DEFAULT 7)
RETURNS TABLE (
    step_name TEXT,
    avg_duration INTEGER,
    success_rate DECIMAL,
    total_attempts INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ujs.step_name,
        AVG(ujs.duration)::INTEGER as avg_duration,
        (COUNT(CASE WHEN ujs.success THEN 1 END) * 100.0 / COUNT(*))::DECIMAL(5,2) as success_rate,
        COUNT(*) as total_attempts
    FROM user_journey_steps ujs
    WHERE ujs.user_id = user_email
    AND ujs.created_at >= NOW() - INTERVAL '1 day' * days
    GROUP BY ujs.step_name
    ORDER BY ujs.step_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get usability test results
CREATE OR REPLACE FUNCTION get_usability_test_results(test_name TEXT, days INTEGER DEFAULT 30)
RETURNS TABLE (
    task_name TEXT,
    success_rate DECIMAL,
    avg_duration INTEGER,
    avg_errors DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ut.task_name,
        (COUNT(CASE WHEN ut.task_success THEN 1 END) * 100.0 / COUNT(*))::DECIMAL(5,2) as success_rate,
        AVG(ut.task_duration)::INTEGER as avg_duration,
        AVG(ut.error_count)::DECIMAL(5,2) as avg_errors
    FROM usability_tests ut
    WHERE ut.test_name = get_usability_test_results.test_name
    AND ut.created_at >= NOW() - INTERVAL '1 day' * days
    GROUP BY ut.task_name
    ORDER BY ut.task_name;
END;
$$ LANGUAGE plpgsql; 