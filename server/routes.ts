import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertContactSchema, 
  insertBrandSchema, 
  insertMVPSchema,
  insertQuizTemplateSchema,
  insertQuizSessionSchema,
  insertMarketingContentSchema,
  insertFormSubmissionSchema,
  insertSubscriptionSchema
} from "@shared/schema";
import { SubscriptionManager } from "./subscriptionLogic.js";

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
} else {
  console.warn('Warning: STRIPE_SECRET_KEY not provided. Payment functionality will be disabled.');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize subscription manager
  const subscriptionManager = new SubscriptionManager(storage);
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact routes
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const { ownerId, search } = req.query;
      if (search) {
        const contacts = await storage.searchContacts(search as string, ownerId as string);
        res.json(contacts);
      } else if (ownerId) {
        const contacts = await storage.getContactsByOwner(ownerId as string);
        res.json(contacts);
      } else {
        res.status(400).json({ message: "ownerId or search query required" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/contacts/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const contact = await storage.updateContactStatus(req.params.id, status);
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Brand routes
  app.post("/api/brands", async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.json(brand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/brands/user/:userId", async (req, res) => {
    try {
      const brands = await storage.getBrandsByUser(req.params.userId);
      res.json(brands);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/brands/:id", async (req, res) => {
    try {
      const updates = req.body;
      const brand = await storage.updateBrand(req.params.id, updates);
      res.json(brand);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // MVP routes
  app.post("/api/mvps", async (req, res) => {
    try {
      const mvpData = insertMVPSchema.parse(req.body);
      const mvp = await storage.createMVP(mvpData);
      res.json(mvp);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/mvps/user/:userId", async (req, res) => {
    try {
      const mvps = await storage.getMVPsByUser(req.params.userId);
      res.json(mvps);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/mvps/:id", async (req, res) => {
    try {
      const mvp = await storage.getMVP(req.params.id);
      if (!mvp) return res.status(404).json({ message: "MVP not found" });
      res.json(mvp);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Quiz Template routes
  app.post("/api/quiz-templates", async (req, res) => {
    try {
      const templateData = insertQuizTemplateSchema.parse(req.body);
      const template = await storage.createQuizTemplate(templateData);
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/quiz-templates/mvp/:mvpId", async (req, res) => {
    try {
      const templates = await storage.getQuizTemplatesByMVP(req.params.mvpId);
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Quiz Session routes
  app.post("/api/quiz-sessions", async (req, res) => {
    try {
      const sessionData = insertQuizSessionSchema.parse(req.body);
      const session = await storage.createQuizSession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/quiz-sessions/:contactId/:mvpId", async (req, res) => {
    try {
      const session = await storage.getQuizSessionByContact(req.params.contactId, req.params.mvpId);
      if (!session) return res.status(404).json({ message: "Quiz session not found" });
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/quiz-sessions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const session = await storage.updateQuizSession(req.params.id, updates);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Marketing Content routes
  app.post("/api/marketing-content", async (req, res) => {
    try {
      const contentData = insertMarketingContentSchema.parse(req.body);
      const content = await storage.createMarketingContent(contentData);
      res.json(content);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/marketing-content/mvp/:mvpId", async (req, res) => {
    try {
      const content = await storage.getMarketingContentByMVP(req.params.mvpId);
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics/platform-stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment processing is currently unavailable. Stripe secret key not configured." 
        });
      }
      
      const { amount, mvpId, contactId } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          mvpId: mvpId || '',
          contactId: contactId || ''
        }
      });
      
      // Update contact status to customer if successful
      if (contactId) {
        await storage.updateContactStatus(contactId, 'customer');
      }
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Form submission route
  app.post("/api/form-submissions", async (req, res) => {
    try {
      const submissionData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(submissionData);
      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // PDF generation endpoint (placeholder)
  app.get("/api/generate-pdf/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { mvpName, contactName } = req.query;
      
      // In a real implementation, this would generate actual PDFs
      const pdfContent = {
        filename: `${type}-${mvpName}-${Date.now()}.pdf`,
        url: `/api/download-pdf/${type}/${mvpName}`,
        content: `Generated ${type} PDF for ${contactName} - ${mvpName}`
      };
      
      res.json(pdfContent);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Subscription routes
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const { userId, planId } = req.body;
      
      // Create trial subscription
      if (planId === 'trial') {
        const subscription = await subscriptionManager.createTrialSubscription(userId, null);
        res.json(subscription);
      } else {
        // For paid plans, create subscription record
        const subscription = await storage.createSubscription({
          userId,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          status: 'active',
          planId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          trialEnd: null,
          cancelAtPeriodEnd: false
        });
        res.json(subscription);
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/usage/:userId", async (req, res) => {
    try {
      const usage = await subscriptionManager.getUsageStats(req.params.userId);
      if (!usage) return res.status(404).json({ message: "No subscription found" });
      res.json(usage);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/builds", async (req, res) => {
    try {
      const { userId, buildType } = req.body;
      
      // Check if user can perform build
      const canBuild = await subscriptionManager.canPerformBuild(userId, buildType);
      if (!canBuild.allowed) {
        return res.status(403).json({ 
          message: "Build limit exceeded", 
          reason: canBuild.reason,
          usage: canBuild 
        });
      }
      
      // Record the build
      await subscriptionManager.recordBuild(userId, buildType);
      res.json({ success: true, remaining: canBuild.remaining });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
