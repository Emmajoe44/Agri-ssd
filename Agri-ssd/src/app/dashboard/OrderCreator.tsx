"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProductOption = {
    id: string;
    name: string;
    price: number;
    stock: number;
};

export function OrderCreator({ products }: { products: ProductOption[] }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const productId = String(formData.get("productId") ?? "");
        const quantity = Number(formData.get("quantity") ?? 0);

        const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: [{ productId, quantity }],
            }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({ error: "Failed to create order" }));
            setError(data.error ?? "Failed to create order");
            setLoading(false);
            return;
        }

        event.currentTarget.reset();
        setLoading(false);
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">Place Order</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label htmlFor="order-product" className="text-sm font-medium text-zinc-700 sm:col-span-2">
                    Product
                </label>
                <select id="order-product" name="productId" required className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2">
                    <option value="">Choose a product</option>
                    {products.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name} - ${item.price.toFixed(2)} ({item.stock} in stock)
                        </option>
                    ))}
                </select>
                <label htmlFor="order-quantity" className="text-sm font-medium text-zinc-700">
                    Quantity
                </label>
                <input
                    id="order-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    defaultValue="1"
                    required
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                />
            </div>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <button
                disabled={loading}
                type="submit"
                className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
                {loading ? "Ordering..." : "Submit order"}
            </button>
        </form>
    );
}
