import { notFound } from "next/navigation";
import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function RetailerOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await requireRole(["RETAILER", "ADMIN"]);
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
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

    if (!order) {
        notFound();
    }

    if (user.role === "RETAILER" && order.retailerId !== user.userId) {
        notFound();
    }

    return (
        <RoleShell user={user} title={`Order ${order.id.slice(-8)}`} subtitle="Retailer order detail view.">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-sm text-zinc-600">Status: {order.status}</p>
                <p className="mt-1 text-sm font-semibold text-emerald-700">Total ${Number(order.total).toFixed(2)}</p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                    {order.items.map((item) => (
                        <li key={item.id}>
                            {item.product.name} × {item.quantity} @ ${Number(item.unitPrice).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
        </RoleShell>
    );
}
