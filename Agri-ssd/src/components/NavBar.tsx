"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type SessionUser = {
    userId: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "FARMER" | "RETAILER";
};

export function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        fetch("/api/auth/me", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                if (mounted) {
                    setUser(data.user ?? null);
                }
            })
            .catch(() => {
                if (mounted) {
                    setUser(null);
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [pathname]);

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
        router.refresh();
    }

    return (
        <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-lg font-semibold text-zinc-900">
                    Agri SSD
                </Link>
                <nav className="flex items-center gap-4 text-sm font-medium text-zinc-700">
                    <Link href="/" className="hover:text-zinc-900">
                        Home
                    </Link>
                    <Link href="/about" className="hover:text-zinc-900">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-zinc-900">
                        Contact
                    </Link>
                    {loading ? (
                        <span className="text-zinc-400">Loading...</span>
                    ) : user ? (
                        <>
                            <span className="hidden text-zinc-500 sm:inline">
                                {user.fullName} ({user.role})
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    if (user.role === "RETAILER") {
                                        router.push("/retailer");
                                        return;
                                    }

                                    if (user.role === "FARMER") {
                                        router.push("/farmer");
                                        return;
                                    }

                                    router.push("/admin");
                                }}
                                className="rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50"
                            >
                                Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={logout}
                                className="rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white hover:bg-zinc-800"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-zinc-900">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white hover:bg-zinc-800"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
