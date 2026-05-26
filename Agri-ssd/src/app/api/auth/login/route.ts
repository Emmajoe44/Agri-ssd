import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    buildSessionCookie,
    signSession,
    verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = loginSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid login data" }, { status: 400 });
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

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
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
}
