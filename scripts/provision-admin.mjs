import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { readFileSync } from "node:fs";

const email = "antonelarodil@gmail.com";
const password = process.env.BOBBYS_ADMIN_INITIAL_PASSWORD || readFileSync(0, "utf8").trim();
if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || !password || password.length < 16) {
  throw new Error("DATABASE_URL, BETTER_AUTH_SECRET and a 16+ character BOBBYS_ADMIN_INITIAL_PASSWORD are required");
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const existing = await pool.query('select id from "user" where lower(email)=$1', [email]);
  if (existing.rowCount) throw new Error("Antonela's account already exists; refusing to alter its credentials");
  const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "https://bobbyspetshop.cl",
    emailAndPassword: { enabled: true, minPasswordLength: 12, autoSignIn: false, disableSignUp: false },
  });
  const created = await auth.api.signUpEmail({ body: { email, password, name: "Antonela Rodil" } });
  if (!created?.user?.id) throw new Error("Unable to create Antonela's account");
  await pool.query('update "user" set "emailVerified"=true where id=$1', [created.user.id]);
  await pool.query("insert into shop_admin_accounts(user_id,email) values($1,$2)", [created.user.id, email]);
  console.log("Antonela's admin account was created. Initial password is not printed or saved by this script.");
} finally {
  await pool.end();
}
