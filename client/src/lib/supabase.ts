import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'bodigi-learn-earn-platform'
    }
  }
})

// Database types (generated from Supabase CLI or manually defined)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          avatar_url: string | null
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          owner_id: string
          name: string
          email: string
          phone: string | null
          source: string | null
          entry_type: 'organic' | 'paid' | 'referral' | 'direct' | null
          tags: string[] | null
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          email: string
          phone?: string | null
          source?: string | null
          entry_type?: 'organic' | 'paid' | 'referral' | 'direct' | null
          tags?: string[] | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          email?: string
          phone?: string | null
          source?: string | null
          entry_type?: 'organic' | 'paid' | 'referral' | 'direct' | null
          tags?: string[] | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      quiz_templates: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          questions: any // JSONB
          settings: any // JSONB
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          questions: any
          settings?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          questions?: any
          settings?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      loop_outcomes: {
        Row: {
          id: string
          contact_id: string
          quiz_template_id: string
          answers: any // JSONB
          score: number | null
          rewards_earned: string[] | null
          mvp_offers_shown: string[] | null
          completed_at: string
          session_data: any // JSONB
        }
        Insert: {
          id?: string
          contact_id: string
          quiz_template_id: string
          answers: any
          score?: number | null
          rewards_earned?: string[] | null
          mvp_offers_shown?: string[] | null
          completed_at?: string
          session_data?: any
        }
        Update: {
          id?: string
          contact_id?: string
          quiz_template_id?: string
          answers?: any
          score?: number | null
          rewards_earned?: string[] | null
          mvp_offers_shown?: string[] | null
          completed_at?: string
          session_data?: any
        }
      }
      form_submissions: {
        Row: {
          id: string
          owner_id: string
          contact_id: string | null
          form_type: string
          submission_data: any // JSONB
          source_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          contact_id?: string | null
          form_type: string
          submission_data: any
          source_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          contact_id?: string | null
          form_type?: string
          submission_data?: any
          source_url?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          status: string
          tier: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          status: string
          tier: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          status?: string
          tier?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper functions for common operations
export const supabaseAuth = {
  // Sign up new user
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Helper functions for database operations
export const supabaseDb = {
  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Create or update user profile
  async upsertUserProfile(profile: Database['public']['Tables']['user_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profile)
      .select()
      .single()
    return { data, error }
  },

  // Get contacts for user
  async getContacts(ownerId: string, filters?: { entry_type?: string }) {
    let query = supabase
      .from('contacts')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (filters?.entry_type) {
      query = query.eq('entry_type', filters.entry_type)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Create contact
  async createContact(contact: Database['public']['Tables']['contacts']['Insert']) {
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single()
    return { data, error }
  },

  // Create loop outcome
  async createLoopOutcome(outcome: Database['public']['Tables']['loop_outcomes']['Insert']) {
    const { data, error } = await supabase
      .from('loop_outcomes')
      .insert(outcome)
      .select()
      .single()
    return { data, error }
  },

  // Get quiz templates for user
  async getQuizTemplates(ownerId: string) {
    const { data, error } = await supabase
      .from('quiz_templates')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

export default supabase
