import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Constructing the pool is lazy: production builds do not need a database connection.
const globalForAuth = globalThis as unknown as { bobbysAuthPool?: Pool };
const authPool = globalForAuth.bobbysAuthPool ?? new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://unused:unused@127.0.0.1:5432/unused",
  max: 10,
});
globalForAuth.bobbysAuthPool = authPool;

function createShopAuth() {
  return betterAuth({
    database: authPool,
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET || "build-only-placeholder-never-use-in-production",
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      autoSignIn: false,
      disableSignUp: process.env.ENABLE_CUSTOMER_SIGNUP !== "true",
    },
    rateLimit: { enabled: true, window: 60, max: 20 },
  });
}

let instance: ReturnType<typeof createShopAuth> | undefined;
export function shopAuth(): ReturnType<typeof createShopAuth> {
  return (instance ??= createShopAuth());
}
