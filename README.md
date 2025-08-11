# Bodigi Loop Build

This project is a full-stack application using the following technologies:

- **Frontend**: React with Vite
- **Backend**: Express.js server
- **Database**: Supabase (Postgres)
- **ORM**: Drizzle ORM
- **Payments**: Stripe

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) for database migrations.

## Environment Variables

You will need to create a `.env` file in the root of the project. This file will store your secret keys and other environment-specific configurations.

.env

## Supabase

```

### Where to get the environment variables

- **Supabase**:
    1. Go to your [Supabase Dashboard](https://app.supabase.io).
    2. Create a new project or go to your existing project's settings.
    3. **`SUPABASE_URL`** and **`SUPABASE_ANON_KEY`**: Find these in `Project Settings` > `API`.
    4. **`SUPABASE_SERVICE_ROLE_KEY`**: Also in `Project Settings` > `API`. Keep this key secret.
    5. **`DATABASE_URL`**: Find this in `Project Settings` > `Database`. Use the URI string for `psql`.

- **Stripe**:
    1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/).
    2. **`STRIPE_SECRET_KEY`**: Find this in `Developers` > `API keys`. Use the "Secret key".
    3. **`STRIPE_PUBLISHABLE_KEY`**: Also in `Developers` > `API keys`. Use the "Publishable key".

## Installation and Setup

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the variables as described in the "Environment Variables" section.

4. **Run database migrations:**
    Apply the database schema to your Supabase instance.

    ```bash
    npx drizzle-kit push
    ```

    Alternatively, you can run the SQL from `supabase-migration.sql` directly in the Supabase SQL editor.

## Available Scripts

- **`npm run dev`**: Starts the development server for both the client and the server. The client will be available at `http://localhost:5173` and the server at `http://localhost:3000`.
- **`npm run build`**: Builds the frontend and backend for production. The output will be in the `dist` directory.
- **`npm run start`**: Starts the production server. Make sure you have run `npm run build` first.
- **`npm run check`**: Runs the TypeScript compiler to check for type errors.
- **`npm run db:push`**: Pushes your Drizzle schema changes to the database.

## Deployment

To deploy this application, you will need a platform that can host a Node.js backend and a static frontend. Examples include Vercel, Netlify, or a traditional VPS.

### Example Deployment to Vercel

1. **Push your code to a Git repository** (e.g., GitHub, GitLab).
2. **Import your project into Vercel.**
3. **Configure the build settings:**
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
    - **Install Command**: `npm install`
4. **Add your environment variables** in the Vercel project settings.
5. **Deploy!** Vercel will automatically build and deploy your application. You will need to configure rewrite rules to point API calls to your server.

For a more seamless deployment, you can configure Vercel to serve the static files from the `dist/client` directory and run the server from `dist/server`. You may need to adjust your server code to handle serving the client's `index.html` for all non-api routes.

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

## .env Needed

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=
```

---

© 2025 Bobbie Digital · All rights reserved · License v1.0
