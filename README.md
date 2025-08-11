# BoDiGi™ Learn & Earn Engagement App (Full System)
> Built for Replit or GitHub Copilot · Powered by MCP + Supabase · Created by Bobbie Digital™ · CPO: Boltz™

---

## 🧠 What It Builds

This project automatically builds:
- ✅ Branded digital identity
- ✅ Personalized MVP with 5 paid features
- ✅ Marketing strategy + launch materials
- ✅ Central CRM contact hub (all leads from all forms)
- ✅ Gamified Learn & Earn Loop tied to the MVP
- ✅ Checkout path to convert free users into paying customers

---

## 🧾 Core Workflow

1. **Branding Builder** – Name, niche, logo, colors, slogan
2. **MVP Builder** – Digital product + 5 paid features
3. **Marketing Builder** – Content, email, CTA assets
4. **Contact Hub** – Supabase table storing all form and purchase data
5. **Learn & Earn Loop Builder** – Quiz-to-sale conversion experience

---

## 📇 CRM + Contact Hub Features

### 1. Contact Capture at Loop Entry
- User provides name + email before first quiz question
- Stored in `contacts` table with `entry_type: learn_and_earn`

### 2. Automatic Contact Save at MVP Purchase
- When someone buys the MVP, their info is stored with:
  - `status: customer`
  - `entry_type: mvp_checkout`
  - `mvp_id`, `purchase_tier`

### 3. You (Platform Owner) Get Access to All Data
- Each contact is saved with `owner_id` to track which customer it belongs to
- Admin panel or master table view gives you full visibility across BoDiGi platform

---

## 🔁 Learn & Earn Loop Overview

- 5 sets of 3 MVP-specific questions
- Each set rewards:
  - Q1: MVP-based PDF
  - Q2: Another PDF
  - Q3: Bonus feature (from that MVP's 5 paid features)
- After each set, offer to buy MVP to unlock bonus
- Decline → harder set
- Accept → checkout w/ auto-applied bonus

Final set = bonus loss warning + Aura chat assistant.

---

## 🔐 Auth & Data Flow

- MCP Auth (A2A)
- Supabase + secure user/session tagging
- Stripe integrated for checkout + bonus redemption

---

## Environment Variables

You will need to create a `.env` file in the root of the project. This file will store your secret keys and other environment-specific configurations.

```bash
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_postgres_connection_string

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### Where to get the environment variables:

-   **Supabase**:
    1.  Go to your [Supabase Dashboard](https://app.supabase.io).
    2.  Create a new project or go to your existing project's settings.
    3.  **`SUPABASE_URL`** and **`SUPABASE_ANON_KEY`**: Find these in `Project Settings` > `API`.
    4.  **`SUPABASE_SERVICE_ROLE_KEY`**: Also in `Project Settings` > `API`. Keep this key secret.
    5.  **`DATABASE_URL`**: Find this in `Project Settings` > `Database`. Use the URI string for `psql`.

-   **Stripe**:
    1.  Go to your [Stripe Dashboard](https://dashboard.stripe.com/).
    2.  **`STRIPE_SECRET_KEY`**: Find this in `Developers` > `API keys`. Use the "Secret key".
    3.  **`VITE_STRIPE_PUBLIC_KEY`**: Also in `Developers` > `API keys`. Use the "Publishable key".

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the variables as described in the "Environment Variables" section.

4.  **Run database migrations:**
    Apply the database schema to your Supabase instance.
    ```bash
    npm run db:push
    ```
    Alternatively, you can run the SQL from `supabase-migration.sql` directly in the Supabase SQL editor.

## Available Scripts

-   **`npm run dev`**: Starts the development server for both the client and the server.
-   **`npm run build`**: Builds the frontend and backend for production.
-   **`npm run start`**: Starts the production server. Make sure you have run `npm run build` first.
-   **`npm run check`**: Runs the TypeScript compiler to check for type errors.
-   **`npm run db:push`**: Pushes your Drizzle schema changes to the database.

---

© 2025 Bobbie Digital · All rights reserved · License v1.0

