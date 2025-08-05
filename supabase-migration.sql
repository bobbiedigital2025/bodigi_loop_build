-- BoDiGi™ Learn & Earn Platform - Supabase Database Schema
-- This migration creates all tables needed for the PDR specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table (PDR compliant)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  entry_type TEXT CHECK (entry_type IN ('quiz', 'subscription', 'support', 'organic', 'paid', 'referral', 'direct')),
  tags TEXT[],
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz templates for Learn & Earn loops
CREATE TABLE IF NOT EXISTS quiz_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loop outcomes (PDR quiz results)
CREATE TABLE IF NOT EXISTS loop_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  quiz_template_id TEXT DEFAULT 'default-pdr-quiz',
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  rewards_earned TEXT[],
  mvp_offers_shown TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_data JSONB DEFAULT '{}'
);

-- Form submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  form_type TEXT NOT NULL,
  submission_data JSONB NOT NULL DEFAULT '{}',
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro', 'enterprise')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can create profile" ON user_profiles FOR INSERT WITH CHECK (true);

-- RLS Policies for contacts
CREATE POLICY "Users can view own contacts" ON contacts FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create contacts" ON contacts FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own contacts" ON contacts FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own contacts" ON contacts FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for quiz_templates
CREATE POLICY "Users can view own quiz templates" ON quiz_templates FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create quiz templates" ON quiz_templates FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own quiz templates" ON quiz_templates FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own quiz templates" ON quiz_templates FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for loop_outcomes (more permissive for public quizzes)
CREATE POLICY "Anyone can create loop outcomes" ON loop_outcomes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view outcomes for their contacts" ON loop_outcomes 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contacts 
      WHERE contacts.id = loop_outcomes.contact_id 
      AND contacts.owner_id = auth.uid()
    )
  );

-- RLS Policies for form_submissions
CREATE POLICY "Users can view own form submissions" ON form_submissions FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create form submissions" ON form_submissions FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions FOR ALL USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_owner_id ON contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_entry_type ON contacts(entry_type);
CREATE INDEX IF NOT EXISTS idx_quiz_templates_owner_id ON quiz_templates(owner_id);
CREATE INDEX IF NOT EXISTS idx_loop_outcomes_contact_id ON loop_outcomes(contact_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_owner_id ON form_submissions(owner_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_templates_updated_at BEFORE UPDATE ON quiz_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default PDR quiz template
INSERT INTO quiz_templates (id, owner_id, title, description, questions, settings) VALUES 
(
  'default-pdr-quiz'::UUID,
  null,
  'BoDiGi™ Learn & Earn MVP Quiz',
  'Interactive quiz to determine the perfect MVP for your business',
  '[
    {
      "setNumber": 1,
      "title": "E-commerce Store",
      "questions": [
        {"id": 1, "text": "Do you have physical or digital products to sell?"},
        {"id": 2, "text": "Do you need online payment processing?"},
        {"id": 3, "text": "Would you benefit from inventory management?"}
      ]
    },
    {
      "setNumber": 2,
      "title": "SaaS Platform",
      "questions": [
        {"id": 1, "text": "Do you offer software as a service?"},
        {"id": 2, "text": "Do you need user subscription management?"},
        {"id": 3, "text": "Would APIs and integrations benefit your users?"}
      ]
    },
    {
      "setNumber": 3,
      "title": "Content Platform",
      "questions": [
        {"id": 1, "text": "Do you create and share content regularly?"},
        {"id": 2, "text": "Do you need audience engagement tools?"},
        {"id": 3, "text": "Would monetization features help your content?"}
      ]
    },
    {
      "setNumber": 4,
      "title": "Service Business",
      "questions": [
        {"id": 1, "text": "Do you provide services to clients?"},
        {"id": 2, "text": "Do you need appointment booking?"},
        {"id": 3, "text": "Would client management tools help you?"}
      ]
    },
    {
      "setNumber": 5,
      "title": "Marketplace",
      "questions": [
        {"id": 1, "text": "Do you connect buyers and sellers?"},
        {"id": 2, "text": "Do you need transaction facilitation?"},
        {"id": 3, "text": "Would vendor management tools benefit you?"}
      ]
    }
  ]'::JSONB,
  '{
    "rewards": {
      "pdf": "MVP Blueprint PDF",
      "bonus": "Exclusive MVP Bonus Features",
      "chat": "AI Consultation with Aura"
    },
    "offers": {
      "basic": {"name": "Basic Plan", "price": "$29/month"},
      "pro": {"name": "Pro Plan", "price": "$79/month"},
      "enterprise": {"name": "Enterprise Plan", "price": "$199/month"}
    }
  }'::JSONB
) ON CONFLICT (id) DO UPDATE SET
  questions = EXCLUDED.questions,
  settings = EXCLUDED.settings,
  updated_at = NOW();

-- Create a function to get quiz statistics
CREATE OR REPLACE FUNCTION get_quiz_stats()
RETURNS TABLE (
  total_completions BIGINT,
  unique_participants BIGINT,
  avg_completion_rate NUMERIC,
  most_popular_mvp TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_completions,
    COUNT(DISTINCT contact_id) as unique_participants,
    ROUND(COUNT(*) * 100.0 / NULLIF(COUNT(DISTINCT contact_id), 0), 2) as avg_completion_rate,
    (
      SELECT 
        COALESCE(
          (answers->>'mvpType')::TEXT, 
          'Unknown'
        ) as mvp_type
      FROM loop_outcomes 
      WHERE answers->>'mvpType' IS NOT NULL
      GROUP BY answers->>'mvpType'
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as most_popular_mvp
  FROM loop_outcomes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
