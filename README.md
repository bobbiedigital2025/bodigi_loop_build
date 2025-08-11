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

```
# .env

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_postgres_connection_string

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
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
    3.  **`STRIPE_PUBLISHABLE_KEY`**: Also in `Developers` > `API keys`. Use the "Publishable key".

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
    npx drizzle-kit push
    ```
    Alternatively, you can run the SQL from `supabase-migration.sql` directly in the Supabase SQL editor.

## Available Scripts

-   **`npm run dev`**: Starts the development server for both the client and the server. The client will be available at `http://localhost:5173` and the server at `http://localhost:3000`.
-   **`npm run build`**: Builds the frontend and backend for production. The output will be in the `dist` directory.
-   **`npm run start`**: Starts the production server. Make sure you have run `npm run build` first.
-   **`npm run check`**: Runs the TypeScript compiler to check for type errors.
-   **`npm run db:push`**: Pushes your Drizzle schema changes to the database.

## Deployment

To deploy this application, you will need a platform that can host a Node.js backend and a static frontend. Examples include Vercel, Netlify, or a traditional VPS.

### Example Deployment to Vercel:

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).
2.  **Import your project into Vercel.**
3.  **Configure the build settings:**
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
    -   **Install Command**: `npm install`
4.  **Add your environment variables** in the Vercel project settings.
5.  **Deploy!** Vercel will automatically build and deploy your application. You will need to configure rewrite rules to point API calls to your server.

For a more seamless deployment, you can configure Vercel to serve the static files from the `dist/client` directory and run the server from `dist/server`. You may need to adjust your server code to handle serving the client's `index.html` for all non-api routes.

