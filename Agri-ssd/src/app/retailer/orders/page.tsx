import Link from "next/link";
import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";
import { requireRole } from "@/lib/server-auth";

export default async function RetailerOrdersPage() {
    const user = await requireRole(["RETAILER", "ADMIN"]);

    const orders = await prisma.order.findMany({
        where: user.role === "ADMIN" ? undefined : { retailerId: user.userId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    product: {
                        select: { id: true, name: true, imageUrl: true },
                    },
                },
            },
        },
    });

    const serialized = orders.map(serializeOrder);

    return (
        <RoleShell user={user} title="Retailer Orders" subtitle="Order history and delivery status.">
            <div className="space-y-3">
                {serialized.map((order) => (
                    <article key={order.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-zinc-900">Order #{order.id.slice(-8)}</h3>
                            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">{order.status}</span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-600">{new Date(order.createdAt).toLocaleString()}</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-700">Total ${order.total.toFixed(2)}</p>
                        <Link className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline" href={`/retailer/orders/${order.id}`}>
                            View details
                        </Link>
                    </article>
                ))}
            </div>
        </RoleShell>
    );
}
