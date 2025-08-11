import { 
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Brand, type InsertBrand,
  type MVP, type InsertMVP,
  type MVPSuggestion, type InsertMVPSuggestion,
  type QuizTemplate, type InsertQuizTemplate,
  type QuizSession, type InsertQuizSession,
  type MarketingContent, type InsertMarketingContent,
  type FormSubmission, type InsertFormSubmission,
  type Subscription, type InsertSubscription,
  type BuildUsage, type InsertBuildUsage,
  type BonusUnlockUsage, type InsertBonusUnlockUsage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User>;

  // Contacts
  getContact(id: string): Promise<Contact | undefined>;
  getContactsByOwner(ownerId: string): Promise<Contact[]>;
  getContactByEmail(email: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: string, status: string): Promise<Contact>;
  searchContacts(query: string, ownerId?: string): Promise<Contact[]>;
  getContacts(filters: { ownerId?: string; entryType?: string; status?: string }): Promise<Contact[]>;

  // PDR Loop Methods
  createLoopOutcome(outcome: {
    contactEmail: string;
    setNumber: number;
    questionNumber: number;
    answer: string;
    timestamp: string;
    rewardType: string;
    rewardTitle: string;
  }): Promise<any>;
  getQuizTemplatesByOwner(ownerId: string): Promise<QuizTemplate[]>;

  // Brands
  getBrand(id: string): Promise<Brand | undefined>;
  getBrandsByUser(userId: string): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand>;

  // MVPs
  getMVP(id: string): Promise<MVP | undefined>;
  getMVPsByUser(userId: string): Promise<MVP[]>;
  createMVP(mvp: InsertMVP): Promise<MVP>;
  updateMVP(id: string, updates: Partial<InsertMVP>): Promise<MVP>;

  // MVP Suggestions
  getMVPSuggestion(id: string): Promise<MVPSuggestion | undefined>;
  getMVPSuggestionsBySession(sessionId: string): Promise<MVPSuggestion[]>;
  createMVPSuggestion(suggestion: InsertMVPSuggestion): Promise<MVPSuggestion>;
  updateMVPSuggestion(id: string, updates: Partial<MVPSuggestion>): Promise<MVPSuggestion>;

  // Quiz Templates
  getQuizTemplate(id: string): Promise<QuizTemplate | undefined>;
  getQuizTemplatesByMVP(mvpId: string): Promise<QuizTemplate[]>;
  createQuizTemplate(template: InsertQuizTemplate): Promise<QuizTemplate>;

  // Quiz Sessions
  getQuizSession(id: string): Promise<QuizSession | undefined>;
  getQuizSessionByContact(contactId: string, mvpId: string): Promise<QuizSession | undefined>;
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
  updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession>;

  // Marketing Content
  getMarketingContent(id: string): Promise<MarketingContent | undefined>;
  getMarketingContentByMVP(mvpId: string): Promise<MarketingContent[]>;
  createMarketingContent(content: InsertMarketingContent): Promise<MarketingContent>;

  // Form Submissions
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;

  // Subscriptions
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription>;
  
  // Build Usage Tracking
  recordBuildUsage(userId: string, buildType: string): Promise<BuildUsage>;
  getBuildCountSince(userId: string, since: Date): Promise<number>;
  
  // Bonus Unlock Usage Tracking
  recordBonusUnlock(userId: string, mvpId: string | null, feature: string): Promise<BonusUnlockUsage>;
  getBonusUnlocksCountSince(userId: string, since: Date): Promise<number>;

  // Analytics
  getPlatformStats(): Promise<{
    totalUsers: number;
    totalContacts: number;
    customers: number;
    revenue: number;
    activeMVPs: number;
    quizCompletions: number;
    conversionRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private brands: Map<string, Brand> = new Map();
  private mvps: Map<string, MVP> = new Map();
  private mvpSuggestions: Map<string, MVPSuggestion> = new Map();
  private quizTemplates: Map<string, QuizTemplate> = new Map();
  private quizSessions: Map<string, QuizSession> = new Map();
  private marketingContent: Map<string, MarketingContent> = new Map();
  private formSubmissions: Map<string, FormSubmission> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private buildUsage: Map<string, BuildUsage> = new Map();
  private bonusUnlockUsage: Map<string, BonusUnlockUsage> = new Map();

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || user.stripeSubscriptionId
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Contacts
  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContactsByOwner(ownerId: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.ownerId === ownerId);
  }

  async getContactByEmail(email: string): Promise<Contact | undefined> {
    return Array.from(this.contacts.values()).find(contact => contact.email === email);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      id,
      name: insertContact.name,
      email: insertContact.email,
      ownerId: insertContact.ownerId || null,
      entryType: insertContact.entryType || 'direct',
      mvpId: insertContact.mvpId || null,
      purchaseTier: insertContact.purchaseTier || null,
      status: insertContact.status || 'lead',
      tags: insertContact.tags || [],
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContactStatus(id: string, status: string): Promise<Contact> {
    const contact = this.contacts.get(id);
    if (!contact) throw new Error("Contact not found");
    
    const updatedContact = { ...contact, status };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async searchContacts(query: string, ownerId?: string): Promise<Contact[]> {
    const contacts = Array.from(this.contacts.values());
    const filtered = ownerId ? contacts.filter(c => c.ownerId === ownerId) : contacts;
    
    if (!query) return filtered;
    
    const searchTerm = query.toLowerCase();
    return filtered.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm)
    );
  }

  // PDR: Get contacts with filters for CRM
  async getContacts(filters: { ownerId?: string; entryType?: string; status?: string }): Promise<Contact[]> {
    let contacts = Array.from(this.contacts.values());
    
    if (filters.ownerId) {
      contacts = contacts.filter(c => c.ownerId === filters.ownerId);
    }
    if (filters.entryType) {
      contacts = contacts.filter(c => c.entryType === filters.entryType);
    }
    if (filters.status) {
      contacts = contacts.filter(c => c.status === filters.status);
    }
    
    return contacts;
  }

  // PDR: Loop Outcome tracking (would be in loop_outcomes table)
  private loopOutcomes: Map<string, any> = new Map();

  async createLoopOutcome(outcome: {
    contactEmail: string;
    setNumber: number;
    questionNumber: number;
    answer: string;
    timestamp: string;
    rewardType: string;
    rewardTitle: string;
  }): Promise<any> {
    const id = randomUUID();
    const outcomeRecord = { id, ...outcome };
    this.loopOutcomes.set(id, outcomeRecord);
    return outcomeRecord;
  }

  // PDR: Get quiz templates by owner
  async getQuizTemplatesByOwner(ownerId: string): Promise<QuizTemplate[]> {
    return Array.from(this.quizTemplates.values()).filter(template => template.mvpId.includes(ownerId));
  }

  // Brands
  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getBrandsByUser(userId: string): Promise<Brand[]> {
    return Array.from(this.brands.values()).filter(brand => brand.userId === userId);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const brand: Brand = { 
      id,
      name: insertBrand.name,
      userId: insertBrand.userId,
      niche: insertBrand.niche,
      keywords: insertBrand.keywords || null,
      personality: insertBrand.personality || [],
      slogan: insertBrand.slogan || null,
      colorPalette: insertBrand.colorPalette || {},
      logoUrl: insertBrand.logoUrl || null,
      createdAt: new Date() 
    };
    this.brands.set(id, brand);
    return brand;
  }

  async updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand> {
    const brand = this.brands.get(id);
    if (!brand) throw new Error("Brand not found");
    
    const updatedBrand = { ...brand, ...updates };
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }

  // MVPs
  async getMVP(id: string): Promise<MVP | undefined> {
    return this.mvps.get(id);
  }

  async getMVPsByUser(userId: string): Promise<MVP[]> {
    return Array.from(this.mvps.values()).filter(mvp => mvp.userId === userId);
  }

  async createMVP(insertMVP: InsertMVP): Promise<MVP> {
    const id = randomUUID();
    const mvp: MVP = { 
      id,
      name: insertMVP.name,
      type: insertMVP.type,
      userId: insertMVP.userId,
      brandId: insertMVP.brandId || null,
      problem: insertMVP.problem,
      features: insertMVP.features || [],
      pricing: insertMVP.pricing || {},
      totalValue: insertMVP.totalValue || null,
      isActive: insertMVP.isActive || null,
      howItWorks: insertMVP.howItWorks || null,
      setupInstructions: insertMVP.setupInstructions || null,
      revenueProjection: insertMVP.revenueProjection || {},
      investorTypes: insertMVP.investorTypes || [],
      investorPlatforms: insertMVP.investorPlatforms || [],
      promotionChannels: insertMVP.promotionChannels || [],
      salesPlatforms: insertMVP.salesPlatforms || [],
      isAiGenerated: insertMVP.isAiGenerated || false,
      createdAt: new Date() 
    };
    this.mvps.set(id, mvp);
    return mvp;
  }

  async updateMVP(id: string, updates: Partial<InsertMVP>): Promise<MVP> {
    const mvp = this.mvps.get(id);
    if (!mvp) throw new Error("MVP not found");
    
    const updatedMVP = { ...mvp, ...updates };
    this.mvps.set(id, updatedMVP);
    return updatedMVP;
  }

  // MVP Suggestions
  async getMVPSuggestion(id: string): Promise<MVPSuggestion | undefined> {
    return this.mvpSuggestions.get(id);
  }

  async getMVPSuggestionsBySession(sessionId: string): Promise<MVPSuggestion[]> {
    return Array.from(this.mvpSuggestions.values()).filter(suggestion => suggestion.sessionId === sessionId);
  }

  async createMVPSuggestion(insertSuggestion: InsertMVPSuggestion): Promise<MVPSuggestion> {
    const id = randomUUID();
    const suggestion: MVPSuggestion = { 
      id,
      userId: insertSuggestion.userId,
      brandId: insertSuggestion.brandId,
      sessionId: insertSuggestion.sessionId,
      name: insertSuggestion.name,
      type: insertSuggestion.type,
      description: insertSuggestion.description,
      problem: insertSuggestion.problem,
      features: insertSuggestion.features || [],
      pricing: insertSuggestion.pricing || {},
      howItWorks: insertSuggestion.howItWorks,
      setupInstructions: insertSuggestion.setupInstructions,
      revenueProjection: insertSuggestion.revenueProjection || {},
      investorTypes: insertSuggestion.investorTypes || [],
      investorPlatforms: insertSuggestion.investorPlatforms || [],
      promotionChannels: insertSuggestion.promotionChannels || [],
      salesPlatforms: insertSuggestion.salesPlatforms || [],
      isSelected: insertSuggestion.isSelected || false,
      createdAt: new Date() 
    };
    this.mvpSuggestions.set(id, suggestion);
    return suggestion;
  }

  async updateMVPSuggestion(id: string, updates: Partial<MVPSuggestion>): Promise<MVPSuggestion> {
    const suggestion = this.mvpSuggestions.get(id);
    if (!suggestion) throw new Error("MVP suggestion not found");
    
    const updatedSuggestion = { ...suggestion, ...updates };
    this.mvpSuggestions.set(id, updatedSuggestion);
    return updatedSuggestion;
  }

  // Quiz Templates
  async getQuizTemplate(id: string): Promise<QuizTemplate | undefined> {
    return this.quizTemplates.get(id);
  }

  async getQuizTemplatesByMVP(mvpId: string): Promise<QuizTemplate[]> {
    return Array.from(this.quizTemplates.values())
      .filter(template => template.mvpId === mvpId)
      .sort((a, b) => {
        if (a.setNumber !== b.setNumber) return a.setNumber - b.setNumber;
        return a.questionNumber - b.questionNumber;
      });
  }

  async createQuizTemplate(insertTemplate: InsertQuizTemplate): Promise<QuizTemplate> {
    const id = randomUUID();
    const template: QuizTemplate = { 
      ...insertTemplate, 
      id,
      correctAnswer: insertTemplate.correctAnswer || null,
      rewardData: insertTemplate.rewardData || {},
      createdAt: new Date() 
    };
    this.quizTemplates.set(id, template);
    return template;
  }

  // Quiz Sessions
  async getQuizSession(id: string): Promise<QuizSession | undefined> {
    return this.quizSessions.get(id);
  }

  async getQuizSessionByContact(contactId: string, mvpId: string): Promise<QuizSession | undefined> {
    return Array.from(this.quizSessions.values())
      .find(session => session.contactId === contactId && session.mvpId === mvpId);
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = randomUUID();
    const session: QuizSession = { 
      ...insertSession, 
      id,
      currentSet: insertSession.currentSet || 1,
      currentQuestion: insertSession.currentQuestion || 1,
      answers: insertSession.answers || [],
      completedSets: insertSession.completedSets || [],
      earnedRewards: insertSession.earnedRewards || [],
      isCompleted: insertSession.isCompleted || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.quizSessions.set(id, session);
    return session;
  }

  async updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession> {
    const session = this.quizSessions.get(id);
    if (!session) throw new Error("Quiz session not found");
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    this.quizSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Marketing Content
  async getMarketingContent(id: string): Promise<MarketingContent | undefined> {
    return this.marketingContent.get(id);
  }

  async getMarketingContentByMVP(mvpId: string): Promise<MarketingContent[]> {
    return Array.from(this.marketingContent.values()).filter(content => content.mvpId === mvpId);
  }

  async createMarketingContent(insertContent: InsertMarketingContent): Promise<MarketingContent> {
    const id = randomUUID();
    const content: MarketingContent = { 
      ...insertContent, 
      id,
      headline: insertContent.headline || null,
      valueProposition: insertContent.valueProposition || null,
      callToAction: insertContent.callToAction || null,
      content: insertContent.content || {},
      createdAt: new Date() 
    };
    this.marketingContent.set(id, content);
    return content;
  }

  // Form Submissions
  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const id = randomUUID();
    const submission: FormSubmission = { 
      ...insertSubmission, 
      id,
      contactId: insertSubmission.contactId || null,
      createdAt: new Date() 
    };
    this.formSubmissions.set(id, submission);
    return submission;
  }

  // Subscriptions
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = { 
      id,
      userId: insertSubscription.userId,
      planId: insertSubscription.planId,
      status: insertSubscription.status,
      stripeCustomerId: insertSubscription.stripeCustomerId || null,
      stripeSubscriptionId: insertSubscription.stripeSubscriptionId || null,
      currentPeriodStart: insertSubscription.currentPeriodStart,
      currentPeriodEnd: insertSubscription.currentPeriodEnd,
      trialEnd: insertSubscription.trialEnd || null,
      cancelAtPeriodEnd: insertSubscription.cancelAtPeriodEnd || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId);
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) throw new Error("Subscription not found");
    
    const updatedSubscription = { 
      ...subscription, 
      ...updates,
      updatedAt: new Date()
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Build Usage Tracking
  async recordBuildUsage(userId: string, buildType: string): Promise<BuildUsage> {
    const id = randomUUID();
    const usage: BuildUsage = {
      id,
      userId,
      buildType,
      createdAt: new Date()
    };
    this.buildUsage.set(id, usage);
    return usage;
  }

  async getBuildCountSince(userId: string, since: Date): Promise<number> {
    return Array.from(this.buildUsage.values())
      .filter(usage => usage.userId === userId && usage.createdAt >= since)
      .length;
  }

  // Bonus Unlock Usage Tracking
  async recordBonusUnlock(userId: string, mvpId: string | null, feature: string): Promise<BonusUnlockUsage> {
    const id = randomUUID();
    const unlock: BonusUnlockUsage = {
      id,
      userId,
      mvpId,
      unlockedFeature: feature,
      createdAt: new Date()
    };
    this.bonusUnlockUsage.set(id, unlock);
    return unlock;
  }

  async getBonusUnlocksCountSince(userId: string, since: Date): Promise<number> {
    return Array.from(this.bonusUnlockUsage.values())
      .filter(unlock => unlock.userId === userId && unlock.createdAt >= since)
      .length;
  }

  // Analytics
  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalContacts: number;
    customers: number;
    revenue: number;
    activeMVPs: number;
    quizCompletions: number;
    conversionRate: number;
  }> {
    const totalUsers = this.users.size;
    const totalContacts = this.contacts.size;
    const customers = Array.from(this.contacts.values()).filter(c => c.status === 'customer').length;
    const activeMVPs = Array.from(this.mvps.values()).filter(m => m.isActive).length;
    const quizCompletions = Array.from(this.quizSessions.values()).filter(s => s.isCompleted).length;
    const conversionRate = totalContacts > 0 ? (customers / totalContacts) * 100 : 0;
    
    // Mock revenue calculation - in real app would come from Stripe
    const revenue = customers * 197; // Average subscription price
    
    return {
      totalUsers,
      totalContacts,
      customers,
      revenue,
      activeMVPs,
      quizCompletions,
      conversionRate: Math.round(conversionRate * 10) / 10
    };
  }
}

// Use Supabase storage if Supabase is configured, otherwise fall back to database or in-memory
import { DatabaseStorage } from "./storage-db";
import { SupabaseStorage } from "./storage-supabase";

export const storage = (() => {
  // Check if Supabase is configured
  const hasSupabase = process.env.VITE_SUPABASE_URL && 
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
  
  if (hasSupabase) {
    console.log('🚀 Using Supabase storage with AI capabilities');
    return new SupabaseStorage();
  } else if (process.env.DATABASE_URL) {
    console.log('📊 Using database storage');
    return new DatabaseStorage();
  } else {
    console.log('💾 Using in-memory storage (development mode)');
    return new MemStorage();
  }
})();
