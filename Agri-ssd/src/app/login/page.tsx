"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
        };

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({ error: "Login failed" }));
                setError(data.error ?? "Login failed");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md flex-col justify-center px-4 py-12 sm:px-0">
            <h1 className="text-3xl font-semibold text-zinc-900">Welcome back</h1>
            <p className="mt-2 text-sm text-zinc-600">Login to manage your agriculture marketplace account.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                    />
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-4 text-sm text-zinc-600">
                Need an account?{" "}
                <Link className="font-medium text-zinc-900" href="/register">
                    Create one
                </Link>
            </p>
        </main>
    );
}
