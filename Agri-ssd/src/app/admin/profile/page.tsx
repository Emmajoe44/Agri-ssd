import { RoleShell } from "@/components/RoleShell";
import { requireRole } from "@/lib/server-auth";

export default async function AdminProfilePage() {
    const user = await requireRole(["ADMIN"]);

    return (
        <RoleShell user={user} title="Admin Profile" subtitle="Administrator account overview.">
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-sm text-zinc-600">Full name</p>
                <p className="font-medium text-zinc-900">{user.fullName}</p>
                <p className="mt-3 text-sm text-zinc-600">Email</p>
                <p className="font-medium text-zinc-900">{user.email}</p>
            </section>
        </RoleShell>
    );
}
