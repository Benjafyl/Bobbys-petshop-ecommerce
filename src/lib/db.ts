import { Pool } from "pg";

const globalForDb = globalThis as unknown as { bobbysPool?: Pool };

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!globalForDb.bobbysPool) {
    globalForDb.bobbysPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  }
  return globalForDb.bobbysPool;
}
