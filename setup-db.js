// Simple script to run the migration against Supabase
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const databaseUrl = "postgresql://postgres:Jewels4fun1234@db.exwngratmprvuqnibtey.supabase.co:5432/postgres";
const sql = neon(databaseUrl);

async function runMigration() {
  try {
    console.log("Connecting to Supabase database...");
    
    // Read the migration file
    const migrationSQL = readFileSync("./migrations/0000_tidy_shriek.sql", "utf8");
    
    // Split by statement separator and execute each statement
    const statements = migrationSQL.split("--> statement-breakpoint");
    
    for (const statement of statements) {
      const cleanStatement = statement.trim();
      if (cleanStatement) {
        console.log("Executing:", cleanStatement.substring(0, 50) + "...");
        await sql(cleanStatement);
      }
    }
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();