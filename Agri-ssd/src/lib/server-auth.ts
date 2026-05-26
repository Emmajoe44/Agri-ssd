import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionFromCookieHeader, type SessionUser } from "@/lib/auth";

export async function requireSession(): Promise<SessionUser> {
    const headerList = await headers();
    const session = await getSessionFromCookieHeader(headerList.get("cookie"));

    if (!session) {
        redirect("/login");
    }

    return session;
}

export async function requireRole(
    roles: Array<SessionUser["role"]>,
): Promise<SessionUser> {
    const session = await requireSession();

    if (!roles.includes(session.role)) {
        if (session.role === "RETAILER") {
            redirect("/retailer");
        }

        if (session.role === "FARMER") {
            redirect("/farmer");
        }

        redirect("/admin");
    }

    return session;
}
