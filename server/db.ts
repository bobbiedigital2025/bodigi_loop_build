import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Use the DATABASE_URL environment variable or construct from Supabase URL
const databaseUrl = process.env.DATABASE_URL || 
  `postgresql://postgres.exwngratmprvuqnibtey:${process.env.SUPABASE_PASSWORD || ''}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

if (!databaseUrl || databaseUrl.includes('[YOUR-PASSWORD]')) {
  console.warn('DATABASE_URL not properly configured. Using in-memory storage.');
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });