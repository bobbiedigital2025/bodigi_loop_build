import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertContactSchema, 
  insertBrandSchema, 
  insertMVPSchema,
  insertMVPSuggestionSchema,
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

  // Learn & Earn Loop API routes (PDR Compliant)
  app.post("/api/quiz/answer", async (req, res) => {
    try {
      const { contactEmail, setNumber, questionNumber, answer, reward } = req.body;
      
      // Store the answer in loop_outcomes table (PDR requirement)
      const outcome = await storage.createLoopOutcome({
        contactEmail,
        setNumber,
        questionNumber,
        answer,
        timestamp: new Date().toISOString(),
        rewardType: reward.type,
        rewardTitle: reward.title
      });
      
      // Generate PDF or process bonus feature
      let rewardData = null;
      if (reward.type === 'pdf') {
        rewardData = await generatePDFReward(reward.title, contactEmail);
      } else if (reward.type === 'bonus_feature') {
        rewardData = await processBonusFeature(reward.featureId, contactEmail);
      }
      
      res.json({ outcome, reward: rewardData });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // PDF Reward generation (PDR requirement)
  app.get("/api/rewards/pdf/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { mvpName, contactName } = req.query;
      
      const pdfData = await generatePDFReward(type as string, contactName as string, mvpName as string);
      res.json(pdfData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Form submissions (PDR Table: form_submissions)
  app.post("/api/form-submissions", async (req, res) => {
    try {
      const submissionData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(submissionData);
      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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

  // Automated MVP generation endpoint
  app.post("/api/mvps/generate-suggestions", async (req, res) => {
    try {
      const { userId, brandId } = req.body;
      
      if (!userId || !brandId) {
        return res.status(400).json({ message: "userId and brandId are required" });
      }

      // Get brand information for AI analysis
      const brand = await storage.getBrand(brandId);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }

      // Generate 5 MVP suggestions based on brand profile
      const suggestions = await generateMVPSuggestions(brand, userId, storage);
      
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Select and save MVP from suggestions
  app.post("/api/mvps/select-suggestion", async (req, res) => {
    try {
      const { suggestionId, userId } = req.body;
      
      if (!suggestionId || !userId) {
        return res.status(400).json({ message: "suggestionId and userId are required" });
      }

      // Get the selected suggestion
      const suggestion = await storage.getMVPSuggestion(suggestionId);
      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" });
      }

      // Create MVP from suggestion
      const mvpData = {
        userId: suggestion.userId,
        brandId: suggestion.brandId,
        name: suggestion.name,
        type: suggestion.type,
        problem: suggestion.problem,
        features: suggestion.features,
        pricing: suggestion.pricing,
        howItWorks: suggestion.howItWorks,
        setupInstructions: suggestion.setupInstructions,
        revenueProjection: suggestion.revenueProjection,
        investorTypes: suggestion.investorTypes,
        investorPlatforms: suggestion.investorPlatforms,
        promotionChannels: suggestion.promotionChannels,
        salesPlatforms: suggestion.salesPlatforms,
        isAiGenerated: true,
        totalValue: 0,
        isActive: true
      };

      const mvp = await storage.createMVP(mvpData);
      
      // Mark suggestion as selected
      await storage.updateMVPSuggestion(suggestionId, { isSelected: true });

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

  const server = createServer(app);
  return server;
}

// PDR Helper Functions
async function generatePDFReward(rewardTitle: string, contactEmail: string, mvpName?: string) {
  // In production, this would generate actual PDFs using a library like PDFKit or Puppeteer
  return {
    title: rewardTitle,
    filename: `${rewardTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`,
    downloadUrl: `/api/download/${rewardTitle.toLowerCase().replace(/\s+/g, '-')}`,
    content: `Generated PDF: ${rewardTitle} for ${contactEmail}${mvpName ? ` - ${mvpName}` : ''}`,
    generatedAt: new Date().toISOString()
  };
}

async function processBonusFeature(featureId: string, contactEmail: string) {
  // In production, this would unlock the feature in the user's account
  return {
    featureId,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    contactEmail,
    description: `Bonus feature ${featureId} unlocked for ${contactEmail}`
  };
}

// AI-powered MVP suggestion generator
async function generateMVPSuggestions(brand: any, userId: string, storage: any) {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Define MVP templates based on niche and brand characteristics
  const mvpTemplates = {
    ecommerce: [
      {
        name: "Smart Product Recommendation Engine",
        type: "automation",
        description: "AI-powered product discovery platform that increases sales by 40%",
        problem: "Customers struggle to find relevant products, leading to low conversion rates",
        revenueProjection: { monthly: 2500, yearly: 30000, growth: "20% monthly" },
        investorTypes: ["E-commerce VCs", "Retail Technology Investors", "AI/ML Focused Funds"],
        investorPlatforms: ["AngelList", "Crunchbase", "Seed Invest", "FounderGroups"],
        promotionChannels: ["LinkedIn ads targeting e-commerce", "Industry conferences", "Content marketing on retail blogs"],
        salesPlatforms: ["Shopify App Store", "WooCommerce marketplace", "Direct B2B sales"]
      },
      {
        name: "Automated Inventory Optimization Suite",
        type: "app", 
        description: "Predictive analytics platform that reduces overstock by 60%",
        problem: "Retailers lose money from overstocking and stockouts",
        revenueProjection: { monthly: 5000, yearly: 60000, growth: "15% monthly" },
        investorTypes: ["SaaS Investors", "Supply Chain VCs", "Retail Tech Angels"],
        investorPlatforms: ["TechStars", "Y Combinator", "500 Startups", "Local VC networks"],
        promotionChannels: ["Trade publications", "Retail industry events", "Partner integrations"],
        salesPlatforms: ["Direct enterprise sales", "Partner channel programs", "Online SaaS marketplaces"]
      }
    ],
    saas: [
      {
        name: "Workflow Automation Builder",
        type: "app",
        description: "No-code platform that automates repetitive business processes",
        problem: "Small businesses waste hours on manual, repetitive tasks",
        revenueProjection: { monthly: 8000, yearly: 96000, growth: "25% monthly" },
        investorTypes: ["SaaS VCs", "Productivity Tool Investors", "No-Code Platform VCs"],
        investorPlatforms: ["AngelList", "SeedInvest", "EquityZen", "Republic"],
        promotionChannels: ["Product Hunt launch", "SaaS communities", "LinkedIn thought leadership"],
        salesPlatforms: ["AppSumo", "Direct SaaS sales", "Partner integrations", "Zapier marketplace"]
      },
      {
        name: "Customer Success Prediction Engine",
        type: "automation",
        description: "AI tool that predicts customer churn with 85% accuracy",
        problem: "SaaS companies lose customers without warning signals",
        revenueProjection: { monthly: 12000, yearly: 144000, growth: "30% monthly" },
        investorTypes: ["AI/ML VCs", "SaaS Growth Investors", "Customer Success VCs"],
        investorPlatforms: ["Crunchbase", "Gust", "SeedInvest", "AngelList"],
        promotionChannels: ["SaaS conferences", "Customer success communities", "Case study content"],
        salesPlatforms: ["Direct B2B sales", "SaaS marketplaces", "Integration partnerships"]
      }
    ],
    health: [
      {
        name: "Personalized Wellness Dashboard",
        type: "app",
        description: "AI-driven health tracking that provides personalized recommendations",
        problem: "People struggle to maintain consistent healthy habits",
        revenueProjection: { monthly: 6000, yearly: 72000, growth: "18% monthly" },
        investorTypes: ["HealthTech VCs", "Wellness Investors", "Consumer Health Angels"],
        investorPlatforms: ["HealthTech Angel Network", "AngelList", "Venrock", "GV (Google Ventures)"],
        promotionChannels: ["Health influencer partnerships", "Medical conference exhibitions", "Wellness community content"],
        salesPlatforms: ["App stores", "Direct consumer", "B2B wellness programs", "Healthcare partnerships"]
      },
      {
        name: "Telemedicine Scheduling Platform",
        type: "automation",
        description: "Streamlined booking system that reduces no-shows by 50%",
        problem: "Healthcare providers lose revenue from missed appointments",
        revenueProjection: { monthly: 4000, yearly: 48000, growth: "22% monthly" },
        investorTypes: ["HealthTech VCs", "Medical Technology Investors", "Digital Health Angels"],
        investorPlatforms: ["Rock Health", "Healthtech Capital", "AngelList", "StartUp Health"],
        promotionChannels: ["Medical practice associations", "Healthcare trade shows", "Provider networks"],
        salesPlatforms: ["Direct healthcare sales", "Medical software marketplaces", "EHR integrations"]
      }
    ]
  };

  // Get templates based on brand niche, fallback to saas
  const niche = brand.niche?.toLowerCase() || 'saas';
  const templates = mvpTemplates[niche as keyof typeof mvpTemplates] || mvpTemplates.saas;
  
  // Generate suggestions based on brand characteristics
  const suggestions = [];
  
  for (let i = 0; i < Math.min(5, templates.length); i++) {
    const template = templates[i] || templates[0]; // Reuse first template if not enough
    
    const suggestionData = {
      userId,
      brandId: brand.id,
      sessionId,
      name: `${brand.name} ${template.name}`,
      type: template.type,
      description: template.description,
      problem: template.problem,
      features: generateFeatures(template.type, brand),
      pricing: generatePricing(template.type, template.revenueProjection),
      howItWorks: generateHowItWorks(template, brand),
      setupInstructions: generateSetupInstructions(template, brand),
      revenueProjection: template.revenueProjection,
      investorTypes: template.investorTypes,
      investorPlatforms: template.investorPlatforms,
      promotionChannels: template.promotionChannels.map(channel => 
        channel.replace(/industry|niche/gi, brand.niche || 'your industry')
      ),
      salesPlatforms: template.salesPlatforms,
      isSelected: false
    };
    
    // Save suggestion to storage
    const suggestion = await storage.createMVPSuggestion(suggestionData);
    suggestions.push(suggestion);
  }
  
  // Add variations for remaining suggestions if we need exactly 5
  while (suggestions.length < 5) {
    const baseTemplate = templates[suggestions.length % templates.length];
    const variation = {
      ...baseTemplate,
      name: `${baseTemplate.name} Pro`,
      description: `Enhanced version: ${baseTemplate.description}`,
      revenueProjection: {
        monthly: Math.round(baseTemplate.revenueProjection.monthly * 1.5),
        yearly: Math.round(baseTemplate.revenueProjection.yearly * 1.5),
        growth: baseTemplate.revenueProjection.growth
      }
    };
    
    const suggestionData = {
      userId,
      brandId: brand.id,
      sessionId,
      name: `${brand.name} ${variation.name}`,
      type: variation.type,
      description: variation.description,
      problem: variation.problem,
      features: generateFeatures(variation.type, brand),
      pricing: generatePricing(variation.type, variation.revenueProjection),
      howItWorks: generateHowItWorks(variation, brand),
      setupInstructions: generateSetupInstructions(variation, brand),
      revenueProjection: variation.revenueProjection,
      investorTypes: variation.investorTypes,
      investorPlatforms: variation.investorPlatforms,
      promotionChannels: variation.promotionChannels,
      salesPlatforms: variation.salesPlatforms,
      isSelected: false
    };
    
    // Save suggestion to storage
    const suggestion = await storage.createMVPSuggestion(suggestionData);
    suggestions.push(suggestion);
  }
  
  return suggestions.slice(0, 5); // Ensure exactly 5 suggestions
}

function generateFeatures(type: string, brand: any) {
  const baseFeatures = {
    app: ["User authentication", "Dashboard analytics", "Mobile-responsive design", "API integrations"],
    automation: ["Workflow builder", "Smart triggers", "Custom rules", "Reporting dashboard"],
    tool: ["Real-time calculations", "Export functionality", "Custom templates", "Integration options"],
    ecommerce: ["Product catalog", "Payment processing", "Order management", "Customer portal"]
  };
  
  const features = baseFeatures[type as keyof typeof baseFeatures] || baseFeatures.app;
  return features.map(feature => `${feature} for ${brand.niche || 'your business'}`);
}

function generatePricing(type: string, revenueProjection: any) {
  const monthly = revenueProjection.monthly || 1000;
  return {
    starter: {
      name: "Starter",
      price: Math.round(monthly * 0.1),
      features: ["Basic features", "Email support", "5 users"]
    },
    professional: {
      name: "Professional", 
      price: Math.round(monthly * 0.2),
      features: ["All starter features", "Priority support", "25 users", "Advanced analytics"]
    },
    enterprise: {
      name: "Enterprise",
      price: Math.round(monthly * 0.4),
      features: ["All professional features", "24/7 support", "Unlimited users", "Custom integrations"]
    }
  };
}

function generateHowItWorks(template: any, brand: any) {
  return `${template.name} works by leveraging ${brand.niche || 'industry'}-specific algorithms to analyze user data and provide intelligent recommendations. The system integrates seamlessly with existing workflows and requires minimal setup. Users can access the platform through a web dashboard or mobile app, with real-time updates and notifications keeping them informed of important insights and opportunities.`;
}

function generateSetupInstructions(template: any, brand: any) {
  return `Setup is simple and takes less than 30 minutes:

1. Sign up and complete your ${brand.niche || 'business'} profile
2. Connect your existing tools and data sources via our secure API integrations
3. Configure your preferences and business rules using our intuitive setup wizard
4. Import your existing data or start fresh with our templates
5. Invite team members and set up user permissions
6. Launch your first campaign or workflow within the platform
7. Monitor results through the real-time dashboard and adjust settings as needed

Our support team provides white-glove onboarding for all new customers, ensuring you get maximum value from day one.`;
}
