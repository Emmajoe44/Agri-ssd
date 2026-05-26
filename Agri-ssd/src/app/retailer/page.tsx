import Link from "next/link";
import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { requireRole } from "@/lib/server-auth";

export default async function RetailerHomePage() {
    const user = await requireRole(["RETAILER", "ADMIN"]);

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            farmer: {
                select: { id: true, fullName: true },
            },
        },
        take: 6,
    });

    const serialized = products.map(serializeProduct);

    return (
        <RoleShell user={user} title="Retailer Home" subtitle="Browse fresh produce and place orders.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {serialized.map((product) => (
                    <article key={product.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <h3 className="font-semibold text-zinc-900">{product.name}</h3>
                        <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
                        <p className="mt-2 text-sm font-semibold text-emerald-700">${product.price.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-zinc-500">Stock {product.stock} • {product.farmer.fullName}</p>
                    </article>
                ))}
            </div>
            <div className="mt-6 flex gap-3">
                <Link href="/retailer/products" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white">View all products</Link>
                <Link href="/retailer/orders" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800">My orders</Link>
            </div>
        </RoleShell>
    );
}
