import { NextResponse } from "next/server";
import { buildClearSessionCookie } from "@/lib/auth";

export async function POST() {
    const response = NextResponse.json({ ok: true });
    response.headers.append("Set-Cookie", buildClearSessionCookie());
    return response;
}
