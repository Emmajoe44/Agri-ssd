"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ProductCreator() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            name: String(formData.get("name") ?? ""),
            description: String(formData.get("description") ?? ""),
            category: String(formData.get("category") ?? ""),
            imageUrl: String(formData.get("imageUrl") ?? ""),
            price: Number(formData.get("price") ?? 0),
            stock: Number(formData.get("stock") ?? 0),
        };

        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({ error: "Failed to create product" }));
            setError(data.error ?? "Failed to create product");
            setLoading(false);
            return;
        }

        event.currentTarget.reset();
        setLoading(false);
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">Add Product</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input name="name" placeholder="Name" required className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                <input name="category" placeholder="Category" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                <input name="price" placeholder="Price" type="number" step="0.01" min="0.01" required className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                <input name="stock" placeholder="Stock" type="number" min="0" required className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                <input name="imageUrl" placeholder="Image URL" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                <textarea
                    name="description"
                    placeholder="Description"
                    required
                    rows={3}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2"
                />
            </div>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <button
                disabled={loading}
                type="submit"
                className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
                {loading ? "Saving..." : "Save product"}
            </button>
        </form>
    );
}
