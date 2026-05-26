import Link from "next/link";
import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function AdminOrdersPage() {
    const user = await requireRole(["ADMIN"]);

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { retailer: { select: { fullName: true } } },
    });

    return (
        <RoleShell user={user} title="Admin Orders" subtitle="Full order supervision.">
            <div className="space-y-3">
                {orders.map((order) => (
                    <article key={order.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-zinc-900">Order #{order.id.slice(-8)}</h3>
                            <span className="text-xs uppercase text-zinc-600">{order.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-600">Retailer: {order.retailer.fullName}</p>
                        <p className="text-sm text-emerald-700">${Number(order.total).toFixed(2)}</p>
                        <Link href={`/admin/orders/${order.id}`} className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline">View detail</Link>
                    </article>
                ))}
            </div>
        </RoleShell>
    );
}
