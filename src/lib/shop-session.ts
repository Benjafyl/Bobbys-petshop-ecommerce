import { headers } from "next/headers";
import { shopAuth } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";

export async function currentShopSession() {
  if (!dbConfigured() || !process.env.BETTER_AUTH_SECRET) return null;
  try {
    return await shopAuth().api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

export async function currentShopAdmin() {
  const session = await currentShopSession();
  if (!session || session.user.email.toLowerCase() !== "antonelarodil@gmail.com") return null;
  const result = await db().query(
    `select 1 from shop_admin_accounts where user_id = $1 and lower(email) = $2 limit 1`,
    [session.user.id, "antonelarodil@gmail.com"],
  );
  return result.rowCount ? session : null;
}

export async function requireShopAdmin() {
  const session = await currentShopAdmin();
  if (!session) throw new Error("No autorizado");
  return session;
}
