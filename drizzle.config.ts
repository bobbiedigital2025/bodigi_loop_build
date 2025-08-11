import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log("DATABASE_URL from env:", process.env.DATABASE_URL); // Add this line for debugging

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
