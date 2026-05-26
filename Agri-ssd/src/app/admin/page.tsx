import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function AdminDashboardPage() {
    const user = await requireRole(["ADMIN"]);

    const [users, products, orders] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
    ]);

    return (
        <RoleShell user={user} title="Admin Dashboard" subtitle="Control center overview.">
            <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-sm text-zinc-600">Users</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{users}</p>
                </article>
                <article className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-sm text-zinc-600">Products</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{products}</p>
                </article>
                <article className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-sm text-zinc-600">Orders</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{orders}</p>
                </article>
            </div>
        </RoleShell>
    );
}
