import { RoleShell } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function AdminFarmersPage() {
    const user = await requireRole(["ADMIN"]);
    const farmers = await prisma.user.findMany({ where: { role: "FARMER" }, orderBy: { createdAt: "desc" } });

    return (
        <RoleShell user={user} title="Admin Farmers" subtitle="Manage producer accounts.">
            <div className="space-y-3">
                {farmers.map((farmer) => (
                    <article key={farmer.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <h3 className="font-semibold text-zinc-900">{farmer.fullName}</h3>
                        <p className="text-sm text-zinc-600">{farmer.email}</p>
                    </article>
                ))}
            </div>
        </RoleShell>
    );
}
