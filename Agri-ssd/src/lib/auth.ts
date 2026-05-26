import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE_NAME = "agri_session";

export type SessionUser = {
    userId: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "FARMER" | "RETAILER";
};

const cookieMaxAgeSeconds = 60 * 60 * 24 * 7;
const secretValue = process.env.AUTH_SECRET ?? "change-this-dev-secret";
const secret = new TextEncoder().encode(secretValue);

function getCookieValue(cookieHeader: string | null, key: string): string | null {
    if (!cookieHeader) {
        return null;
    }

    const parts = cookieHeader.split(";");
    for (const part of parts) {
        const [rawKey, ...rest] = part.trim().split("=");
        if (rawKey === key) {
            return decodeURIComponent(rest.join("="));
        }
    }

    return null;
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(
    password: string,
    passwordHash: string,
): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}

export async function signSession(user: SessionUser): Promise<string> {
    return new SignJWT({ ...user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payloadToSession(payload);
    } catch {
        return null;
    }
}

function payloadToSession(payload: JWTPayload): SessionUser | null {
    const { userId, email, fullName, role } = payload;

    if (
        typeof userId !== "string" ||
        typeof email !== "string" ||
        typeof fullName !== "string" ||
        (role !== "ADMIN" && role !== "FARMER" && role !== "RETAILER")
    ) {
        return null;
    }

    return { userId, email, fullName, role };
}

export async function getSessionFromRequest(request: Request): Promise<SessionUser | null> {
    const token = getCookieValue(request.headers.get("cookie"), SESSION_COOKIE_NAME);
    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}

export async function getSessionFromCookieHeader(
    cookieHeader: string | null,
): Promise<SessionUser | null> {
    const token = getCookieValue(cookieHeader, SESSION_COOKIE_NAME);
    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}

export function buildSessionCookie(token: string): string {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${cookieMaxAgeSeconds}${secure}`;
}

export function buildClearSessionCookie(): string {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
