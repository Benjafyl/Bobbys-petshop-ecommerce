import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";

export async function GET() {
  if (!dbConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  try {
    await db().query("select 1");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
