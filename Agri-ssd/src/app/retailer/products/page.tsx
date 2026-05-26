import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { requireRole } from "@/lib/server-auth";

export default async function RetailerProductsPage() {
    const user = await requireRole(["RETAILER", "ADMIN"]);

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { farmer: { select: { id: true, fullName: true } } },
    });

    const serialized = products.map(serializeProduct);

    return (
        <RoleShell user={user} title="Retailer Products" subtitle="Catalog of available produce.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {serialized.map((product) => (
                    <article key={product.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <h3 className="font-semibold text-zinc-900">{product.name}</h3>
                        <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
                        <p className="mt-2 text-sm font-semibold text-emerald-700">${product.price.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-zinc-500">Farmer {product.farmer.fullName}</p>
                    </article>
                ))}
            </div>
        </RoleShell>
    );
}
