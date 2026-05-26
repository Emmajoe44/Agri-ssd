import Link from "next/link";
import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function FarmerHomePage() {
    const user = await requireRole(["FARMER", "ADMIN"]);

    const products = await prisma.product.findMany({
        where: user.role === "ADMIN" ? undefined : { farmerId: user.userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <RoleShell user={user} title="Farmer Dashboard" subtitle="Manage listings and track sales.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <article className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-sm text-zinc-600">Total Products</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{products.length}</p>
                </article>
                <article className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-sm text-zinc-600">Active Stock Units</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
                </article>
            </div>
            <div className="mt-6">
                <Link href="/farmer/products/new" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white">
                    Add new product
                </Link>
            </div>
        </RoleShell>
    );
}
