import Link from "next/link";
import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function FarmerProductsPage() {
    const user = await requireRole(["FARMER", "ADMIN"]);

    const products = await prisma.product.findMany({
        where: user.role === "ADMIN" ? undefined : { farmerId: user.userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <RoleShell user={user} title="Farmer Products" subtitle="Your listed produce.">
            <div className="mb-4">
                <Link href="/farmer/products/new" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white">
                    Add Product
                </Link>
            </div>
            <div className="space-y-3">
                {products.map((product) => (
                    <article key={product.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <h3 className="font-semibold text-zinc-900">{product.name}</h3>
                        <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
                        <p className="mt-2 text-sm text-zinc-700">Stock {product.stock} • ${Number(product.price).toFixed(2)}</p>
                        <Link href={`/farmer/products/${product.id}/edit`} className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline">
                            Edit listing
                        </Link>
                    </article>
                ))}
            </div>
        </RoleShell>
    );
}
