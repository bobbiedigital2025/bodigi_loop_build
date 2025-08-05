# Supabase Configuration for BoDiGi™ Platform

## Overview
This document outlines the Supabase setup for the BoDiGi™ Learn & Earn Platform, replacing the current in-memory storage with a production-ready PostgreSQL database.

## Setup Instructions

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and name project "bodigi-platform"
4. Select region (closest to your users)
5. Generate a strong database password
6. Wait for project provisioning (2-3 minutes)

### 2. Get API Credentials
From your Supabase dashboard:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Key**: Public key for client-side operations
- **Service Role Key**: Server-side key with full access (keep secret!)

### 3. Environment Variables
Add these to your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Database Configuration  
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

## Database Schema

### Tables to Create

Run these SQL commands in the Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Contacts table (CRM)
CREATE TABLE public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  entry_type TEXT CHECK (entry_type IN ('organic', 'paid', 'referral', 'direct')),
  tags TEXT[],
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Templates
CREATE TABLE public.quiz_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loop Outcomes (Quiz Results)
CREATE TABLE public.loop_outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  quiz_template_id UUID REFERENCES public.quiz_templates(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER,
  rewards_earned TEXT[],
  mvp_offers_shown TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_data JSONB DEFAULT '{}'
);

-- Form Submissions
CREATE TABLE public.form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  form_type TEXT NOT NULL,
  submission_data JSONB NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL,
  tier TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_contacts_owner_id ON public.contacts(owner_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_entry_type ON public.contacts(entry_type);
CREATE INDEX idx_loop_outcomes_contact_id ON public.loop_outcomes(contact_id);
CREATE INDEX idx_quiz_templates_owner_id ON public.quiz_templates(owner_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Contacts: Users can only see/edit their own contacts
CREATE POLICY "Users can view own contacts" ON public.contacts
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own contacts" ON public.contacts
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own contacts" ON public.contacts
  FOR UPDATE USING (auth.uid() = owner_id);

-- Quiz Templates: Users can only see/edit their own templates
CREATE POLICY "Users can view own quiz templates" ON public.quiz_templates
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own quiz templates" ON public.quiz_templates
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Loop Outcomes: Users can view outcomes for their contacts
CREATE POLICY "Users can view outcomes for own contacts" ON public.loop_outcomes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contacts 
      WHERE contacts.id = loop_outcomes.contact_id 
      AND contacts.owner_id = auth.uid()
    )
  );

-- Similar policies for other tables...
```

## Authentication Setup

### 1. Configure Auth Providers
In Supabase Dashboard → Authentication → Settings:

- **Email**: Enable email/password auth
- **Magic Links**: Enable for passwordless login
- **Social Providers**: Configure Google, GitHub if needed

### 2. Auth Configuration
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

## Migration from In-Memory Storage

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
npm install --save-dev @types/pg
```

### 2. Update Storage Implementation
Replace `server/storage.ts` with Supabase-based implementation:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { IStorage, Contact, QuizTemplate, LoopOutcome } from './types'

export class SupabaseStorage implements IStorage {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getContacts(ownerId: string, filters?: any): Promise<Contact[]> {
    let query = this.supabase
      .from('contacts')
      .select('*')
      .eq('owner_id', ownerId)

    if (filters?.entry_type) {
      query = query.eq('entry_type', filters.entry_type)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // ... implement other methods
}
```

## Environment Setup

### Development
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Production
Set these in your deployment environment:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- GitHub Pages: Repository Settings → Secrets

## Security Considerations

1. **Never expose Service Role Key** in client-side code
2. **Use RLS policies** to protect data access
3. **Validate all inputs** before database operations
4. **Enable audit logging** in Supabase dashboard
5. **Set up backup policies** for data protection

## Testing

```typescript
// Test Supabase connection
import { supabase } from './lib/supabase'

async function testConnection() {
  const { data, error } = await supabase
    .from('contacts')
    .select('count')
    .limit(1)
  
  if (error) {
    console.error('Supabase connection failed:', error)
  } else {
    console.log('Supabase connected successfully!')
  }
}
```

## Next Steps

1. Create Supabase project and get credentials
2. Run database schema SQL commands
3. Update environment variables
4. Install Supabase dependencies
5. Replace storage implementation
6. Test all functionality
7. Deploy with new configuration

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](./ISSUE_TEMPLATE/bug_report.yml)
