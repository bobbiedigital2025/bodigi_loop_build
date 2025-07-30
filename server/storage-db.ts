import { db } from "./db";
import { 
  users, contacts, brands, mvps, quizTemplates, quizSessions, 
  marketingContent, formSubmissions, subscriptions,
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Brand, type InsertBrand,
  type MVP, type InsertMVP,
  type QuizTemplate, type InsertQuizTemplate,
  type QuizSession, type InsertQuizSession,
  type MarketingContent, type InsertMarketingContent,
  type FormSubmission, type InsertFormSubmission,
  type Subscription, type InsertSubscription
} from "@shared/schema";
import { eq, like, or, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User> {
    const result = await db.update(users)
      .set({ 
        stripeCustomerId: customerId, 
        stripeSubscriptionId: subscriptionId 
      })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Contacts
  async getContact(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }

  async getContactsByOwner(ownerId: string): Promise<Contact[]> {
    return await db.select().from(contacts).where(eq(contacts.ownerId, ownerId));
  }

  async getContactByEmail(email: string): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.email, email)).limit(1);
    return result[0];
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async updateContactStatus(id: string, status: string): Promise<Contact> {
    const result = await db.update(contacts)
      .set({ status })
      .where(eq(contacts.id, id))
      .returning();
    return result[0];
  }

  async searchContacts(query: string, ownerId?: string): Promise<Contact[]> {
    let baseQuery = db.select().from(contacts);
    
    if (ownerId) {
      baseQuery = baseQuery.where(eq(contacts.ownerId, ownerId));
    }
    
    if (query) {
      const searchConditions = or(
        like(contacts.name, `%${query}%`),
        like(contacts.email, `%${query}%`)
      );
      baseQuery = baseQuery.where(searchConditions);
    }
    
    return await baseQuery.orderBy(desc(contacts.createdAt));
  }

  // Brands
  async getBrand(id: string): Promise<Brand | undefined> {
    const result = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    return result[0];
  }

  async getBrandsByUser(userId: string): Promise<Brand[]> {
    return await db.select().from(brands).where(eq(brands.userId, userId));
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const result = await db.insert(brands).values(brand).returning();
    return result[0];
  }

  async updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand> {
    const result = await db.update(brands)
      .set(updates)
      .where(eq(brands.id, id))
      .returning();
    return result[0];
  }

  // MVPs
  async getMVP(id: string): Promise<MVP | undefined> {
    const result = await db.select().from(mvps).where(eq(mvps.id, id)).limit(1);
    return result[0];
  }

  async getMVPsByUser(userId: string): Promise<MVP[]> {
    return await db.select().from(mvps).where(eq(mvps.userId, userId));
  }

  async createMVP(mvp: InsertMVP): Promise<MVP> {
    const result = await db.insert(mvps).values(mvp).returning();
    return result[0];
  }

  async updateMVP(id: string, updates: Partial<InsertMVP>): Promise<MVP> {
    const result = await db.update(mvps)
      .set(updates)
      .where(eq(mvps.id, id))
      .returning();
    return result[0];
  }

  // Quiz Templates
  async getQuizTemplate(id: string): Promise<QuizTemplate | undefined> {
    const result = await db.select().from(quizTemplates).where(eq(quizTemplates.id, id)).limit(1);
    return result[0];
  }

  async getQuizTemplatesByMVP(mvpId: string): Promise<QuizTemplate[]> {
    return await db.select().from(quizTemplates).where(eq(quizTemplates.mvpId, mvpId));
  }

  async createQuizTemplate(template: InsertQuizTemplate): Promise<QuizTemplate> {
    const result = await db.insert(quizTemplates).values(template).returning();
    return result[0];
  }

  // Quiz Sessions
  async getQuizSession(id: string): Promise<QuizSession | undefined> {
    const result = await db.select().from(quizSessions).where(eq(quizSessions.id, id)).limit(1);
    return result[0];
  }

  async getQuizSessionByContact(contactId: string, mvpId: string): Promise<QuizSession | undefined> {
    const result = await db.select().from(quizSessions)
      .where(eq(quizSessions.contactId, contactId))
      .limit(1);
    return result[0];
  }

  async createQuizSession(session: InsertQuizSession): Promise<QuizSession> {
    const result = await db.insert(quizSessions).values(session).returning();
    return result[0];
  }

  async updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession> {
    const result = await db.update(quizSessions)
      .set(updates)
      .where(eq(quizSessions.id, id))
      .returning();
    return result[0];
  }

  // Marketing Content
  async getMarketingContent(id: string): Promise<MarketingContent | undefined> {
    const result = await db.select().from(marketingContent).where(eq(marketingContent.id, id)).limit(1);
    return result[0];
  }

  async getMarketingContentByMVP(mvpId: string): Promise<MarketingContent[]> {
    return await db.select().from(marketingContent).where(eq(marketingContent.mvpId, mvpId));
  }

  async createMarketingContent(content: InsertMarketingContent): Promise<MarketingContent> {
    const result = await db.insert(marketingContent).values(content).returning();
    return result[0];
  }

  // Form Submissions
  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const result = await db.insert(formSubmissions).values(submission).returning();
    return result[0];
  }

  // Subscriptions
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(subscription).returning();
    return result[0];
  }

  async getSubscriptionByContact(contactId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions)
      .where(eq(subscriptions.contactId, contactId))
      .limit(1);
    return result[0];
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
    const [usersCount, contactsCount, customersCount, activeMVPsCount, quizCompletionsCount] = await Promise.all([
      db.select().from(users),
      db.select().from(contacts),
      db.select().from(contacts).where(eq(contacts.status, 'customer')),
      db.select().from(mvps).where(eq(mvps.isActive, true)),
      db.select().from(quizSessions).where(eq(quizSessions.isCompleted, true))
    ]);

    const totalUsers = usersCount.length;
    const totalContacts = contactsCount.length;
    const customers = customersCount.length;
    const activeMVPs = activeMVPsCount.length;
    const quizCompletions = quizCompletionsCount.length;
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