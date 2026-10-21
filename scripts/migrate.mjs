import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: { enabled: true, minPasswordLength: 12, autoSignIn: false, disableSignUp: process.env.ENABLE_CUSTOMER_SIGNUP !== "true" },
    rateLimit: { enabled: true, window: 60, max: 20 },
  });
  const migrations = await getMigrations(auth.options);
  await migrations.runMigrations();
  const sql = await readFile(new URL("../db/shop.sql", import.meta.url), "utf8");
  await pool.query(sql);
  console.log("Bobby's database migrations and inventory seed complete");
} finally {
  await pool.end();
}
