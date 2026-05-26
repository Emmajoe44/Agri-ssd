import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function AdminProductsPage() {
    const user = await requireRole(["ADMIN"]);
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { farmer: { select: { fullName: true } } },
    });

    return (
        <RoleShell user={user} title="Admin Products" subtitle="Review all listed produce.">
            <div className="space-y-3">
                {products.map((product) => (
                    <article key={product.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <h3 className="font-semibold text-zinc-900">{product.name}</h3>
                        <p className="text-sm text-zinc-600">Farmer: {product.farmer.fullName}</p>
                        <p className="text-sm text-zinc-700">Stock {product.stock} • ${Number(product.price).toFixed(2)}</p>
                    </article>
                ))}
            </div>
        </RoleShell>
    );
}
