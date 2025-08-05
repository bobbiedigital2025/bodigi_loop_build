import { createClient } from '@supabase/supabase-js'
import type { Database } from '../client/src/lib/supabase'
import type { IStorage } from './storage'
import { randomUUID } from 'crypto'
import type {
  User, InsertUser,
  Contact, InsertContact,
  Brand, InsertBrand,
  MVP, InsertMVP,
  QuizTemplate, InsertQuizTemplate,
  QuizSession, InsertQuizSession,
  MarketingContent, InsertMarketingContent,
  FormSubmission, InsertFormSubmission,
  Subscription, InsertSubscription,
  BuildUsage, InsertBuildUsage,
  BonusUnlockUsage, InsertBonusUnlockUsage
} from '../shared/schema'

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase environment variables, falling back to in-memory storage')
}

export class SupabaseStorage implements IStorage {
  private supabase: ReturnType<typeof createClient<Database>>

  constructor() {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    this.supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) return undefined
    return data as User
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('name', username)
      .single()
    
    if (error || !data) return undefined
    return data as User
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !data) return undefined
    return data as User
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = {
      id: randomUUID(),
      email: user.email,
      name: user.username || null,
      avatar_url: null,
      subscription_tier: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('user_profiles')
      .insert(newUser)
      .select()
      .single()

    if (error) throw new Error(`Failed to create user: ${error.message}`)
    return data as User
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update user: ${error.message}`)
    return data as User
  }

  // Contacts
  async getContact(id: string): Promise<Contact | undefined> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) return undefined
    return data as Contact
  }

  async getContactsByOwner(ownerId: string): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    
    if (error) return []
    return data as Contact[]
  }

  async getContactByEmail(email: string): Promise<Contact | undefined> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !data) return undefined
    return data as Contact
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact = {
      id: randomUUID(),
      owner_id: contact.ownerId || null,
      name: contact.name,
      email: contact.email,
      phone: null,
      source: null,
      entry_type: contact.entryType || null,
      tags: contact.tags || null,
      notes: null,
      status: contact.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('contacts')
      .insert(newContact)
      .select()
      .single()

    if (error) throw new Error(`Failed to create contact: ${error.message}`)
    return data as Contact
  }

  async updateContactStatus(id: string, status: string): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update contact: ${error.message}`)
    return data as Contact
  }

  async searchContacts(query: string, ownerId?: string): Promise<Contact[]> {
    let queryBuilder = this.supabase
      .from('contacts')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)

    if (ownerId) {
      queryBuilder = queryBuilder.eq('owner_id', ownerId)
    }

    const { data, error } = await queryBuilder
    if (error) return []
    return data as Contact[]
  }

  async getContacts(filters: { ownerId?: string; entryType?: string; status?: string }): Promise<Contact[]> {
    let queryBuilder = this.supabase.from('contacts').select('*')

    if (filters.ownerId) {
      queryBuilder = queryBuilder.eq('owner_id', filters.ownerId)
    }
    if (filters.entryType) {
      queryBuilder = queryBuilder.eq('entry_type', filters.entryType)
    }
    if (filters.status) {
      queryBuilder = queryBuilder.eq('status', filters.status)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })
    if (error) return []
    return data as Contact[]
  }

  // PDR Loop Methods
  async createLoopOutcome(outcome: {
    contactEmail: string;
    setNumber: number;
    questionNumber: number;
    answer: string;
    timestamp: string;
    rewardType: string;
    rewardTitle: string;
  }): Promise<any> {
    // First, get or create contact
    let contact = await this.getContactByEmail(outcome.contactEmail)
    if (!contact) {
      contact = await this.createContact({
        ownerId: 'system', // For now, use system as owner
        name: outcome.contactEmail.split('@')[0],
        email: outcome.contactEmail,
        entryType: 'quiz',
        status: 'active'
      })
    }

    const loopOutcome = {
      id: randomUUID(),
      contact_id: contact.id,
      quiz_template_id: 'default-pdr-quiz',
      answers: {
        setNumber: outcome.setNumber,
        questionNumber: outcome.questionNumber,
        answer: outcome.answer,
        timestamp: outcome.timestamp
      },
      score: null,
      rewards_earned: [outcome.rewardType],
      mvp_offers_shown: [],
      completed_at: new Date().toISOString(),
      session_data: {
        rewardTitle: outcome.rewardTitle
      }
    }

    const { data, error } = await this.supabase
      .from('loop_outcomes')
      .insert(loopOutcome)
      .select()
      .single()

    if (error) throw new Error(`Failed to create loop outcome: ${error.message}`)
    return data
  }

  async getQuizTemplatesByOwner(ownerId: string): Promise<QuizTemplate[]> {
    const { data, error } = await this.supabase
      .from('quiz_templates')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) return []
    return data as QuizTemplate[]
  }

  // Remaining methods with stub implementations for compatibility
  async getBrand(id: string): Promise<Brand | undefined> { return undefined }
  async getBrandsByUser(userId: string): Promise<Brand[]> { return [] }
  async createBrand(brand: InsertBrand): Promise<Brand> {
    throw new Error('Brands not implemented in Supabase storage yet')
  }
  async updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand> {
    throw new Error('Brands not implemented in Supabase storage yet')
  }

  async getMVP(id: string): Promise<MVP | undefined> { return undefined }
  async getMVPsByBrand(brandId: string): Promise<MVP[]> { return [] }
  async getMVPsByUser(userId: string): Promise<MVP[]> { return [] }
  async createMVP(mvp: InsertMVP): Promise<MVP> {
    throw new Error('MVPs not implemented in Supabase storage yet')
  }
  async updateMVP(id: string, updates: Partial<InsertMVP>): Promise<MVP> {
    throw new Error('MVPs not implemented in Supabase storage yet')
  }

  async getQuizTemplate(id: string): Promise<QuizTemplate | undefined> {
    const { data, error } = await this.supabase
      .from('quiz_templates')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) return undefined
    return data as QuizTemplate
  }

  async createQuizTemplate(template: InsertQuizTemplate): Promise<QuizTemplate> {
    const newTemplate = {
      id: randomUUID(),
      mvp_id: template.mvpId,
      set_number: template.setNumber,
      question_number: template.questionNumber,
      question: template.question,
      options: template.options || {},
      reward_type: template.rewardType,
      correct_answer: template.correctAnswer || null,
      reward_data: template.rewardData || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('quiz_templates')
      .insert(newTemplate)
      .select()
      .single()

    if (error) throw new Error(`Failed to create quiz template: ${error.message}`)
    return data as QuizTemplate
  }

  async getQuizSession(id: string): Promise<QuizSession | undefined> { return undefined }
  async getQuizSessionsByTemplate(templateId: string): Promise<QuizSession[]> { return [] }
  async getQuizTemplatesByMVP(mvpId: string): Promise<QuizTemplate[]> { return [] }
  async getQuizSessionByContact(contactId: string): Promise<QuizSession | undefined> { return undefined }
  async createQuizSession(session: InsertQuizSession): Promise<QuizSession> {
    throw new Error('Quiz sessions not implemented in Supabase storage yet')
  }
  async updateQuizSession(id: string, updates: Partial<InsertQuizSession>): Promise<QuizSession> {
    throw new Error('Quiz sessions not implemented in Supabase storage yet')
  }

  async getMarketingContent(id: string): Promise<MarketingContent | undefined> { return undefined }
  async getMarketingContentByMVP(mvpId: string): Promise<MarketingContent[]> { return [] }
  async createMarketingContent(content: InsertMarketingContent): Promise<MarketingContent> {
    throw new Error('Marketing content not implemented in Supabase storage yet')
  }

  async getFormSubmission(id: string): Promise<FormSubmission | undefined> { return undefined }
  async getFormSubmissionsByOwner(ownerId: string): Promise<FormSubmission[]> { return [] }
  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const newSubmission = {
      id: randomUUID(),
      owner_id: 'system', // Use system since ownerId is not in the schema
      contact_id: submission.contactId || null,
      form_type: submission.formType,
      submission_data: submission.data,
      source_url: null, // sourceUrl not in schema
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('form_submissions')
      .insert(newSubmission)
      .select()
      .single()

    if (error) throw new Error(`Failed to create form submission: ${error.message}`)
    return data as FormSubmission
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) return undefined
    return data as Subscription
  }

  async getSubscriptionByUser(userId: string): Promise<Subscription | undefined> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (error || !data) return undefined
    return data as Subscription
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    return this.getSubscriptionByUser(userId)
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const newSubscription = {
      id: randomUUID(),
      user_id: subscription.userId,
      stripe_subscription_id: subscription.stripeSubscriptionId || null,
      stripe_customer_id: subscription.stripeCustomerId || null,
      status: subscription.status,
      tier: subscription.planId, // Map planId to tier
      current_period_start: subscription.currentPeriodStart?.toISOString() || null,
      current_period_end: subscription.currentPeriodEnd?.toISOString() || null,
      cancel_at_period_end: subscription.cancelAtPeriodEnd || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('subscriptions')
      .insert(newSubscription)
      .select()
      .single()

    if (error) throw new Error(`Failed to create subscription: ${error.message}`)
    return data as Subscription
  }

  async updateSubscription(id: string, updates: Partial<InsertSubscription>): Promise<Subscription> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (updates.status) updateData.status = updates.status
    if (updates.stripeCustomerId) updateData.stripe_customer_id = updates.stripeCustomerId
    if (updates.stripeSubscriptionId) updateData.stripe_subscription_id = updates.stripeSubscriptionId
    if (updates.currentPeriodStart) updateData.current_period_start = updates.currentPeriodStart.toISOString()
    if (updates.currentPeriodEnd) updateData.current_period_end = updates.currentPeriodEnd.toISOString()
    if (updates.cancelAtPeriodEnd !== undefined) updateData.cancel_at_period_end = updates.cancelAtPeriodEnd

    const { data, error } = await this.supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update subscription: ${error.message}`)
    return data as Subscription
  }

  async recordBuildUsage(userId: string, buildType: string): Promise<BuildUsage> {
    throw new Error('Build usage tracking not implemented in Supabase storage yet')
  }

  async getBuildCountSince(userId: string, since: Date): Promise<number> { return 0 }
  
  async recordBonusUnlock(userId: string, mvpId: string | null, feature: string): Promise<BonusUnlockUsage> {
    throw new Error('Bonus unlock tracking not implemented in Supabase storage yet')
  }

  async getBonusUnlocksCountSince(userId: string, since: Date): Promise<number> { return 0 }

  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalContacts: number;
    customers: number;
    revenue: number;
    activeMVPs: number;
    quizCompletions: number;
    conversionRate: number;
  }> {
    // Get basic counts from Supabase
    const [usersResult, contactsResult, subscriptionsResult, outcomesResult] = await Promise.all([
      this.supabase.from('user_profiles').select('id', { count: 'exact' }),
      this.supabase.from('contacts').select('id', { count: 'exact' }),
      this.supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
      this.supabase.from('loop_outcomes').select('id', { count: 'exact' })
    ])

    const totalUsers = usersResult.count || 0
    const totalContacts = contactsResult.count || 0
    const customers = subscriptionsResult.count || 0
    const quizCompletions = outcomesResult.count || 0

    // Simple conversion rate calculation
    const conversionRate = totalContacts > 0 ? (customers / totalContacts) * 100 : 0

    return {
      totalUsers,
      totalContacts,
      customers,
      revenue: customers * 29, // Simplified revenue calculation
      activeMVPs: 0, // MVPs not implemented yet
      quizCompletions,
      conversionRate: Math.round(conversionRate * 10) / 10
    }
  }
}