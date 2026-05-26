"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            fullName: String(formData.get("fullName") ?? ""),
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            role: String(formData.get("role") ?? "RETAILER"),
        };

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({ error: "Registration failed" }));
                setError(data.error ?? "Registration failed");
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
            <h1 className="text-3xl font-semibold text-zinc-900">Create account</h1>
            <p className="mt-2 text-sm text-zinc-600">Sign up as a farmer or retailer.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="fullName">
                        Full name
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        required
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                    />
                </div>

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
                        minLength={6}
                        required
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="role">
                        Account type
                    </label>
                    <select
                        id="role"
                        name="role"
                        defaultValue="RETAILER"
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                    >
                        <option value="RETAILER">Retailer</option>
                        <option value="FARMER">Farmer</option>
                    </select>
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>

            <p className="mt-4 text-sm text-zinc-600">
                Already have an account?{" "}
                <Link className="font-medium text-zinc-900" href="/login">
                    Login
                </Link>
            </p>
        </main>
    );
}
