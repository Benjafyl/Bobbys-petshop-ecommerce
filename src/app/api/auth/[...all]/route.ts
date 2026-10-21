import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { shopAuth } from "@/lib/auth";

const configured = () => Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);
export const GET = (request: Request) => configured() ? toNextJsHandler(shopAuth()).GET(request) : NextResponse.json({ error: "Accounts unavailable" }, { status: 503 });
export const POST = (request: Request) => configured() ? toNextJsHandler(shopAuth()).POST(request) : NextResponse.json({ error: "Accounts unavailable" }, { status: 503 });
