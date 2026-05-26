import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    buildSessionCookie,
    hashPassword,
    signSession,
} from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = registerSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid registration data", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const { email, fullName, password, role } = parsed.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { error: "Email is already registered" },
                { status: 409 },
            );
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                fullName,
                passwordHash,
                role,
            },
        });

        const token = await signSession({
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        });

        const response = NextResponse.json({
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });

        response.headers.append("Set-Cookie", buildSessionCookie(token));
        return response;
    } catch {
        return NextResponse.json({ error: "Failed to register" }, { status: 500 });
    }
}
