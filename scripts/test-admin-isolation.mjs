import { randomBytes } from "node:crypto";
import { Pool } from "pg";

if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) throw new Error("Database and auth secret required");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const email = `role-check-${randomBytes(8).toString("hex")}@example.invalid`;
const password = randomBytes(24).toString("hex");
let userId;
try {
  const created = await fetch("http://127.0.0.1:3000/api/auth/sign-up/email", {
    method: "POST",
    headers: { Host: "bobbyspetshop.cl", Origin: "https://bobbyspetshop.cl", "Content-Type": "application/json", "X-Forwarded-Proto": "https" },
    body: JSON.stringify({ email, password, name: "Role check" }),
  });
  if (!created.ok) throw new Error(`Customer registration failed: ${created.status}`);
  userId = (await created.json()).user.id;
  const response = await fetch("http://127.0.0.1:3000/api/auth/sign-in/email", {
    method: "POST",
    headers: { Host: "bobbyspetshop.cl", Origin: "https://bobbyspetshop.cl", "Content-Type": "application/json", "X-Forwarded-Proto": "https" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(`Customer sign-in failed: ${response.status}`);
  const cookie = response.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
  if (!cookie) throw new Error("No customer session cookie");
  const panel = await fetch("http://127.0.0.1:3000/admin", { headers: { Host: "bobbyspetshop.cl", Cookie: cookie, "X-Forwarded-Proto": "https" }, redirect: "manual" });
  if (panel.status !== 404) throw new Error(`Customer reached admin: ${panel.status}`);
  console.log("Customer session denied admin access (404)");
} finally {
  if (userId) await pool.query('delete from "user" where id=$1', [userId]);
  await pool.end();
}
