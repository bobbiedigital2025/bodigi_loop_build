# BoDiGi™ Learn & Earn Platform - Complete Setup & Features Guide
> 🚀 **Full-Stack AI-Powered Business Automation Platform**  
> Built with React + Node.js + Supabase + Stripe  
> Created by Bobbie Digital™ | Powered by Boltz™ AI Agent

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://bodigi-platform.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/bobbiedigital2025/bodigi_loop_build)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE.md.txt)

---

## 🎯 **Platform Overview**

BoDiGi™ is an intelligent business automation platform that creates complete digital business systems through an AI-powered "Learn & Earn Loop" conversion funnel. The platform automatically generates brands, MVPs, marketing materials, and gamified quiz experiences that convert prospects into paying customers.

### **What BoDiGi™ Builds For You:**
- ✅ **Complete Brand Identity** (logo, colors, messaging)
- ✅ **Production-Ready MVP** with 5 premium features
- ✅ **Marketing Asset Suite** (emails, landing pages, CTAs)
- ✅ **Gamified Learn & Earn Loop** (quiz-to-sale funnel)
- ✅ **Centralized CRM System** (lead tracking & management)
- ✅ **Automated Checkout Flow** (Stripe-powered payments)
- ✅ **AI Chat Assistant** (Aura™ for objection handling)

---

## 🏗️ **Architecture & Tech Stack**

### **Frontend Architecture**
```
┌─ React 18 + TypeScript + Vite
├─ shadcn/ui + Tailwind CSS (Design System)
├─ TanStack Query (State Management)
├─ React Hook Form + Zod (Form Validation)
└─ Lucide React (Icon System)
```

### **Backend Architecture**
```
┌─ Node.js + Express + TypeScript
├─ Drizzle ORM + PostgreSQL (Database)
├─ Supabase (Authentication & Storage)
├─ Stripe API (Payment Processing)
└─ PDF Generation (jsPDF + Custom Templates)
```

### **Integration Stack**
```
┌─ MCP Auth (A2A Authentication)
├─ Supabase RLS (Row Level Security)
├─ Stripe Webhooks (Payment Events)
└─ Vercel/Netlify (Deployment)
```

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ installed
- Supabase account (free tier available)
- Stripe account (live or test keys)
- VS Code with recommended extensions

### **1. Installation**
```bash
# Clone the repository
git clone https://github.com/bobbiedigital2025/bodigi_loop_build.git
cd bodigi_loop_build

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### **2. Environment Configuration**
Create your `.env` file with these required variables:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration (Required)
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
NODE_ENV=development
PORT=5000

# Optional Advanced Features
MCP_API_KEY=your_mcp_api_key
LOOP_INTELLIGENCE_SECRET=your_loop_secret
REPLIT_PROJECT_ID=your_replit_id
```

### **3. Database Setup**
Follow our [Supabase Setup Guide](./docs/SUPABASE_SETUP.md) to:
- Create your Supabase project
- Run database migrations
- Configure Row Level Security
- Set up authentication

### **4. Development Server**
```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **5. Launch Configuration**
Your VS Code launch.json is configured for:
- **F5**: Launch Chrome at localhost:5000
- **Debug Server**: Direct Node.js debugging

---

## 🧱 **Core Modules Deep Dive**

### **1. Branding Builder Module**
**Path**: `/client/src/components/BrandingBuilder.tsx`

**Features:**
- AI-powered brand name generation
- Dynamic logo creation and customization
- Color palette generation with hex codes
- Slogan and messaging optimization
- Brand voice and tone selection
- Export ready-to-use brand assets

**API Endpoints:**
```typescript
POST /api/brands          // Create new brand
GET /api/brands/:id       // Get brand details
PUT /api/brands/:id       // Update brand
DELETE /api/brands/:id    // Delete brand
```

**Database Schema:**
```sql
brands (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  colors JSONB NOT NULL,
  logo_url TEXT,
  slogan TEXT,
  voice_tone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### **2. MVP Builder Module**
**Path**: `/client/src/components/MVPBuilder.tsx`

**Supported MVP Types:**
- 📱 **SaaS Platforms** (dashboards, analytics tools)
- 📚 **Digital Courses** (video series, worksheets)
- 🛒 **E-commerce Stores** (product catalogs, checkout)
- 📖 **E-books & Guides** (PDF generation, templates)
- 🔧 **Business Tools** (calculators, automation)
- 🎯 **Membership Sites** (exclusive content, communities)

**5 Premium Features System:**
Each generated MVP includes exactly 5 premium features:
1. **Advanced Analytics Dashboard**
2. **Priority Support Channel**
3. **White-Glove Onboarding**
4. **Enterprise Scaling Suite**
5. **Lifetime VIP Access**

**Generated Pricing Tiers:**
- **Basic**: $27/month (MVP only)
- **Pro**: $67/month (MVP + 2 features)
- **Enterprise**: $197/month (MVP + all 5 features)

**API Endpoints:**
```typescript
POST /api/mvps            // Generate new MVP
GET /api/mvps/:id         // Get MVP details
POST /api/mvps/demo       // Create live demo
PUT /api/mvps/:id         // Update MVP features
```

### **3. Learn & Earn Loop System**
**Path**: `/client/src/components/LearnEarnLoop.tsx`

**Loop Structure:**
```
┌─ Contact Capture (Name + Email)
├─ Question Set 1: PDF Reward → PDF Reward → Bonus Feature
├─ MVP Offer 1 (Accept = Checkout | Decline = Continue)
├─ Question Set 2: PDF Reward → PDF Reward → Bonus Feature
├─ MVP Offer 2 (Accept = Checkout | Decline = Continue)
├─ Question Set 3: PDF Reward → PDF Reward → Bonus Feature
├─ MVP Offer 3 (Accept = Checkout | Decline = Continue)  
├─ Question Set 4: PDF Reward → PDF Reward → Bonus Feature
├─ MVP Offer 4 (Accept = Checkout | Decline = Continue)
├─ Question Set 5: PDF Reward → PDF Reward → Final Warning
└─ Last Chance Offer + Aura™ AI Chat Assistant
```

**Reward System:**
- **Questions 1 & 2**: Custom PDF based on MVP topic
- **Question 3**: Unlock 1 of 5 premium features as bonus
- **Feature Access**: Only unlocked after MVP purchase

**Quiz Logic:**
```typescript
interface LearnEarnSession {
  contactId: string;
  currentSet: number;        // 1-5
  currentQuestion: number;   // 1-3
  completedSets: number;
  declinedOffers: number;
  rewardsClaimed: string[];
  bonusesUnlocked: string[];
  finalOfferShown: boolean;
  auraEngaged: boolean;
}
```

### **4. Contact Hub (CRM System)**
**Path**: `/client/src/components/ContactHub.tsx`

**Contact Sources:**
- 🎯 **Learn & Earn Loop**: Entry type `learn_and_earn`
- 💳 **MVP Purchases**: Entry type `mvp_checkout`
- 📧 **Newsletter Signups**: Entry type `newsletter`
- 📝 **Form Submissions**: Entry type `form_submission`

**Contact Lifecycle:**
```
Lead → Engaged → Hot → Customer → VIP
```

**CRM Features:**
- Advanced filtering and segmentation
- Contact timeline and interaction history
- Automated tagging and categorization
- Export to CSV/Excel
- Email marketing integration ready
- Revenue attribution tracking

**Database Schema:**
```sql
contacts (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id),
  entry_type TEXT NOT NULL,
  status TEXT DEFAULT 'lead',
  mvp_id UUID,
  purchase_tier TEXT,
  tags JSONB DEFAULT '[]',
  notes TEXT,
  last_activity TIMESTAMP,
  lifetime_value DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### **5. Marketing Builder Module**
**Path**: `/client/src/components/MarketingBuilder.tsx`

**Generated Marketing Assets:**
- 📧 **Email Sequences** (welcome, nurture, sales)
- 🎯 **Landing Pages** (high-converting templates)
- 📱 **Social Media Content** (posts, stories, ads)
- 📝 **Blog Articles** (SEO-optimized content)
- 🎥 **Video Scripts** (explainer videos, demos)
- 📊 **Ad Copy** (Facebook, Google, LinkedIn)

**Content Templates:**
- Welcome email sequence (5 emails)
- Product launch sequence (7 emails)
- Nurture sequence (10 emails)
- Re-engagement sequence (3 emails)

### **6. Admin Dashboard**
**Path**: `/client/src/components/AdminDashboard.tsx`

**Analytics Tracking:**
- Real-time visitor monitoring
- Quiz completion rates by question
- Conversion funnel analysis
- Revenue attribution by source
- Customer lifetime value metrics
- Churn prediction indicators

**Platform Management:**
- User account administration
- Subscription management
- Feature flag controls
- System health monitoring
- Database performance metrics
- API usage analytics

---

## 💳 **Pricing & Monetization**

### **Subscription Tiers**
Based on `/pricing.json`:

#### **🆓 Free Trial** (7 days)
- 4 builds per month
- Basic Learn & Earn access
- No bonus features
- No contact hub access

#### **💼 Basic Plan** ($9.99/month)
- 4 builds per month
- 2 bonus features per build
- Full Learn & Earn access
- Contact hub access
- Email support

#### **🚀 Pro Plan** ($29.99/month)
- 20 builds per month
- 5 bonus features per build
- Marketing builder access
- Priority support
- Advanced analytics

#### **🏢 Enterprise Plan** ($97/month)
- Unlimited builds
- All premium features
- White-label access
- Dedicated specialist
- Custom integrations

### **Revenue Streams**
1. **Monthly Subscriptions**: Recurring SaaS revenue
2. **MVP Sales Commissions**: 10% of generated MVP sales
3. **White-Label Licensing**: Custom enterprise deployments
4. **Training & Consulting**: Implementation services

---

## 🔒 **Security & Authentication**

### **Authentication Flow**
```
┌─ MCP Auth (Primary) - A2A Authentication
├─ Supabase Auth (Fallback) - Email/Password
├─ Social Login (Optional) - Google, GitHub
└─ Magic Links (Passwordless) - Email verification
```

### **Row Level Security (RLS)**
All Supabase tables implement RLS policies:

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own data" ON contacts
FOR SELECT USING (owner_id = auth.uid());

-- Users can only modify their own data
CREATE POLICY "Users can modify own data" ON contacts
FOR ALL USING (owner_id = auth.uid());
```

### **API Security**
- JWT token validation on all protected routes
- Rate limiting (100 requests/minute per IP)
- CORS configured for production domains
- SQL injection prevention via Drizzle ORM
- Input validation using Zod schemas

### **Payment Security**
- PCI DSS compliant Stripe integration
- Webhook signature verification
- Secure customer data handling
- Encrypted payment method storage

---

## 🤖 **AI Integration: Boltz™ Agent**

### **Boltz™ AI Assistant**
**Path**: `/client/src/components/BoltzAgent.tsx`

**Capabilities:**
- Automated business analysis and recommendations
- Real-time platform building assistance
- Integration with Builder.io, Supabase, Netlify
- Natural language MVP generation
- Automated deployment and testing
- Customer support and troubleshooting

**AI Workflow:**
```
User Input → Natural Language Processing → Business Logic Analysis 
→ Automated Code Generation → Integration Setup → Deployment → Testing
```

**Service Integrations:**
- ✅ **Builder.io**: Visual page building
- ✅ **Supabase**: Database management
- ✅ **Netlify**: Automated deployment
- ✅ **Linear**: Project management
- ✅ **Notion**: Documentation sync

---

## 📊 **Database Schema Complete**

### **Core Tables**
```sql
-- User Management
users (id, username, email, password, stripe_customer_id, created_at)
user_profiles (id, name, avatar_url, subscription_tier, updated_at)

-- Business Building
brands (id, user_id, name, industry, colors, logo_url, slogan)
mvps (id, user_id, name, type, features, pricing, demo_url)
marketing_content (id, user_id, type, title, content, status)

-- Learn & Earn System
quiz_templates (id, owner_id, mvp_id, questions, rewards, pricing)
quiz_sessions (id, contact_id, template_id, current_set, session_data)
loop_outcomes (id, contact_id, question_set, question_num, answer, reward)

-- CRM & Sales
contacts (id, name, email, owner_id, entry_type, status, tags)
form_submissions (id, owner_id, contact_id, form_type, submission_data)
subscriptions (id, user_id, stripe_subscription_id, status, tier)

-- Analytics & Usage
build_usage (id, user_id, build_type, features_used, created_at)
bonus_unlock_usage (id, user_id, feature_id, unlock_date, expires_at)
```

### **Database Indexes (Performance)**
```sql
CREATE INDEX idx_contacts_owner_id ON contacts(owner_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_entry_type ON contacts(entry_type);
CREATE INDEX idx_quiz_sessions_contact_id ON quiz_sessions(contact_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_build_usage_user_id ON build_usage(user_id);
```

---

## 🛠️ **API Reference Complete**

### **Authentication Endpoints**
```typescript
POST   /api/auth/login           // User login
POST   /api/auth/register        // User registration  
POST   /api/auth/logout          // User logout
GET    /api/auth/profile         // Get user profile
PUT    /api/auth/profile         // Update user profile
```

### **Business Builder Endpoints**
```typescript
// Branding
POST   /api/brands               // Create brand
GET    /api/brands               // List user brands
GET    /api/brands/:id           // Get brand details
PUT    /api/brands/:id           // Update brand
DELETE /api/brands/:id           // Delete brand

// MVP Building
POST   /api/mvps                 // Generate MVP
GET    /api/mvps                 // List user MVPs
GET    /api/mvps/:id             // Get MVP details
POST   /api/mvps/:id/demo        // Create live demo
PUT    /api/mvps/:id             // Update MVP

// Marketing Assets
POST   /api/marketing            // Generate content
GET    /api/marketing            // List content
GET    /api/marketing/:id        // Get content details
PUT    /api/marketing/:id        // Update content
```

### **Learn & Earn Loop Endpoints**
```typescript
POST   /api/quiz/start           // Start new quiz session
POST   /api/quiz/answer          // Submit quiz answer
GET    /api/quiz/rewards/:type   // Generate PDF reward
POST   /api/quiz/offer           // Present MVP offer
POST   /api/quiz/decline         // Handle offer decline
GET    /api/quiz/status/:id      // Get session status
```

### **CRM & Contact Management**
```typescript
POST   /api/contacts             // Create contact
GET    /api/contacts             // List contacts (with filters)
GET    /api/contacts/:id         // Get contact details
PUT    /api/contacts/:id         // Update contact
DELETE /api/contacts/:id         // Delete contact
PATCH  /api/contacts/:id/status  // Update contact status
POST   /api/contacts/import      // Bulk import contacts
GET    /api/contacts/export      // Export contacts to CSV
```

### **Analytics & Reporting**
```typescript
GET    /api/analytics/dashboard  // Dashboard metrics
GET    /api/analytics/funnel     // Conversion funnel data
GET    /api/analytics/revenue    // Revenue attribution
GET    /api/analytics/quiz       // Quiz performance data
GET    /api/analytics/contacts   // Contact growth metrics
```

### **Subscription & Billing**
```typescript
POST   /api/subscriptions        // Create subscription
GET    /api/subscriptions        // Get user subscription
PUT    /api/subscriptions        // Update subscription
DELETE /api/subscriptions        // Cancel subscription
POST   /api/billing/checkout     // Create checkout session
POST   /api/billing/portal       // Access billing portal
POST   /api/webhooks/stripe      // Stripe webhook handler
```

---

## 🔧 **Development Workflow**

### **Project Structure**
```
bodigi_loop_build/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── BrandingBuilder.tsx
│   │   │   ├── MVPBuilder.tsx
│   │   │   ├── LearnEarnLoop.tsx
│   │   │   ├── ContactHub.tsx
│   │   │   ├── BoltzAgent.tsx
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── pages/             # Route components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities & configs
│   │   └── styles/            # CSS & themes
├── server/                     # Node.js backend
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Database abstraction
│   ├── storage-supabase.ts    # Supabase implementation
│   └── index.ts               # Server entry point
├── shared/                     # Shared types & schemas
│   └── schema.ts              # Database schema
├── docs/                       # Documentation
├── migrations/                 # Database migrations
└── .vscode/                   # VS Code configuration
```

### **Development Commands**
```bash
# Development
npm run dev              # Start dev server with hot reload
npm run check            # TypeScript type checking
npm run build            # Build for production

# Database
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data

# Testing
npm test                 # Run test suite
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Deployment
npm run deploy           # Deploy to production
npm run preview          # Preview production build
```

---

## 📈 **Performance Optimization**

### **Frontend Optimization**
- **Code Splitting**: Dynamic imports for large components
- **Lazy Loading**: Images and non-critical components
- **Caching**: TanStack Query for API response caching
- **Bundle Analysis**: Webpack bundle analyzer
- **CDN**: Serve static assets from CDN

### **Backend Optimization**
- **Database Indexing**: Optimized queries with indexes
- **Connection Pooling**: PostgreSQL connection management
- **Caching**: Redis for session and API caching
- **Rate Limiting**: Prevent API abuse
- **Compression**: Gzip compression for responses

### **Database Optimization**
```sql
-- Query optimization examples
EXPLAIN ANALYZE SELECT * FROM contacts WHERE owner_id = $1;

-- Index usage verification
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename = 'contacts';
```

---

## 🐛 **Troubleshooting Guide**

### **Common Issues**

#### **"Missing Supabase environment variables"**
```bash
# Check your .env file has:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### **Stripe payments not working**
```bash
# Verify Stripe keys are correct:
VITE_STRIPE_PUBLIC_KEY=pk_live_... (starts with pk_live_ or pk_test_)
STRIPE_SECRET_KEY=sk_live_... (starts with sk_live_ or sk_test_)
```

#### **Database connection issues**
```bash
# Test Supabase connection:
npm run db:push
# If this fails, check your Supabase project status
```

#### **Build errors**
```bash
# Clear cache and reinstall:
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🎯 **Success Metrics & KPIs**

### **Platform Metrics**
- **User Acquisition**: New signups per month
- **Activation Rate**: Users who complete first MVP
- **Monthly Recurring Revenue**: Subscription income
- **Churn Rate**: Monthly subscription cancellations
- **Customer Lifetime Value**: Average revenue per user

### **Learn & Earn Loop Metrics**
- **Quiz Completion Rate**: % who finish all 5 sets
- **Conversion Rate**: Quiz completion → MVP purchase
- **Average Revenue Per Loop**: Revenue generated per quiz
- **Engagement Score**: Questions answered / total questions
- **Drop-off Points**: Where users exit the funnel

---

## 📞 **Support & Community**

### **Getting Help**
- 📧 **Email Support**: support@bodigi.app
- 💬 **Discord Community**: [Join BoDiGi Discord](https://discord.gg/bodigi)
- 📚 **Documentation**: [docs.bodigi.app](https://docs.bodigi.app)
- 🎥 **Video Tutorials**: [YouTube Channel](https://youtube.com/@bodigitm)

### **Contributing**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ by the BoDiGi™ Team**

*Empowering entrepreneurs to build, launch, and scale their digital businesses through intelligent automation.*

---

© 2025 Bobbie Digital™ | BoDiGi™ Platform | All Rights Reserved | Version 2.0.1
