import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function FarmerSalesPage() {
    const user = await requireRole(["FARMER", "ADMIN"]);

    const items = await prisma.orderItem.findMany({
        where: user.role === "ADMIN" ? undefined : { product: { farmerId: user.userId } },
        include: { product: { select: { name: true } } },
    });

    const revenue = items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);

    return (
        <RoleShell user={user} title="Farmer Sales" subtitle="Performance and revenue view.">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-sm text-zinc-600">Sold line items</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">{items.length}</p>
                <p className="mt-3 text-sm text-zinc-600">Estimated revenue</p>
                <p className="mt-1 text-xl font-semibold text-emerald-700">${revenue.toFixed(2)}</p>
            </div>
        </RoleShell>
    );
}
