import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function AdminRetailersPage() {
    const user = await requireRole(["ADMIN"]);
    const retailers = await prisma.user.findMany({ where: { role: "RETAILER" }, orderBy: { createdAt: "desc" } });

    return (
        <RoleShell user={user} title="Admin Retailers" subtitle="Manage retailer accounts.">
            <div className="space-y-3">
                {retailers.map((retailer) => (
                    <article key={retailer.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <h3 className="font-semibold text-zinc-900">{retailer.fullName}</h3>
                        <p className="text-sm text-zinc-600">{retailer.email}</p>
                    </article>
                ))}
            </div>
        </RoleShell>
    );
}
