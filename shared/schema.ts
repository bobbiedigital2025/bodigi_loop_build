import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  ownerId: varchar("owner_id").references(() => users.id),
  entryType: text("entry_type").notNull(), // 'learn_and_earn', 'mvp_checkout', 'newsletter'
  status: text("status").notNull().default("lead"), // 'lead', 'customer', 'churned'
  mvpId: varchar("mvp_id"),
  purchaseTier: text("purchase_tier"),
  tags: jsonb("tags").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  niche: text("niche").notNull(),
  keywords: text("keywords"),
  personality: jsonb("personality").default([]),
  slogan: text("slogan"),
  colorPalette: jsonb("color_palette").default({}),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mvps = pgTable("mvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  brandId: varchar("brand_id").references(() => brands.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  problem: text("problem").notNull(),
  features: jsonb("features").default([]),
  pricing: jsonb("pricing").default({}),
  totalValue: integer("total_value").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizTemplates = pgTable("quiz_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mvpId: varchar("mvp_id").references(() => mvps.id).notNull(),
  setNumber: integer("set_number").notNull(),
  questionNumber: integer("question_number").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: text("correct_answer"),
  rewardType: text("reward_type").notNull(), // 'pdf', 'bonus_feature'
  rewardData: jsonb("reward_data").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id).notNull(),
  mvpId: varchar("mvp_id").references(() => mvps.id).notNull(),
  currentSet: integer("current_set").default(1),
  currentQuestion: integer("current_question").default(1),
  answers: jsonb("answers").default([]),
  completedSets: jsonb("completed_sets").default([]),
  earnedRewards: jsonb("earned_rewards").default([]),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketingContent = pgTable("marketing_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mvpId: varchar("mvp_id").references(() => mvps.id).notNull(),
  contentType: text("content_type").notNull(), // 'landing_page', 'email_sequence', 'social_media'
  headline: text("headline"),
  valueProposition: text("value_proposition"),
  callToAction: text("call_to_action"),
  content: jsonb("content").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const formSubmissions = pgTable("form_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id),
  formType: text("form_type").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  status: text("status").notNull(), // active, trialing, canceled, past_due
  planId: text("plan_id").notNull(), // trial, basic, pro, enterprise
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  trialEnd: timestamp("trial_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// New table to track build usage
export const buildUsage = pgTable("build_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  buildType: text("build_type").notNull(), // mvp, branding, marketing
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// New table to track bonus unlock usage
export const bonusUnlockUsage = pgTable("bonus_unlock_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mvpId: varchar("mvp_id"),
  unlockedFeature: text("unlocked_feature").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
});

export const insertMVPSchema = createInsertSchema(mvps).omit({
  id: true,
  createdAt: true,
});

export const insertQuizTemplateSchema = createInsertSchema(quizTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketingContentSchema = createInsertSchema(marketingContent).omit({
  id: true,
  createdAt: true,
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuildUsageSchema = createInsertSchema(buildUsage).omit({
  id: true,
  createdAt: true,
});

export const insertBonusUnlockUsageSchema = createInsertSchema(bonusUnlockUsage).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type MVP = typeof mvps.$inferSelect;
export type InsertMVP = z.infer<typeof insertMVPSchema>;
export type QuizTemplate = typeof quizTemplates.$inferSelect;
export type InsertQuizTemplate = z.infer<typeof insertQuizTemplateSchema>;
export type QuizSession = typeof quizSessions.$inferSelect;
export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type MarketingContent = typeof marketingContent.$inferSelect;
export type InsertMarketingContent = z.infer<typeof insertMarketingContentSchema>;
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type BuildUsage = typeof buildUsage.$inferSelect;
export type InsertBuildUsage = z.infer<typeof insertBuildUsageSchema>;
export type BonusUnlockUsage = typeof bonusUnlockUsage.$inferSelect;
export type InsertBonusUnlockUsage = z.infer<typeof insertBonusUnlockUsageSchema>;
