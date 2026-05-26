import { RoleShell } from "@/components/RoleShell";
import { requireRole } from "@/lib/server-auth";

export default async function RetailerProfilePage() {
    const user = await requireRole(["RETAILER", "ADMIN"]);

    return (
        <RoleShell user={user} title="Retailer Profile" subtitle="Account and business details.">
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-sm text-zinc-600">Name</p>
                <p className="font-medium text-zinc-900">{user.fullName}</p>
                <p className="mt-3 text-sm text-zinc-600">Email</p>
                <p className="font-medium text-zinc-900">{user.email}</p>
                <p className="mt-3 text-sm text-zinc-600">Role</p>
                <p className="font-medium text-zinc-900">{user.role}</p>
            </section>
        </RoleShell>
    );
}
