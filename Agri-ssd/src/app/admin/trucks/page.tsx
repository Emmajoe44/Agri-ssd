import Link from "next/link";
import { RoleShell } from "@/components/RoleShell";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";
import { requireRole } from "@/lib/server-auth";

export default async function AdminTrucksPage() {
    const user = await requireRole(["ADMIN"]);

    return (
        <RoleShell user={user} title="Admin Trucks" subtitle="Fleet operations route.">
            <div className="mb-4">
                <Link href="/admin/trucks/new" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white">
                    Add truck
                </Link>
            </div>
            <PlaceholderPanel
                title="Trucks route cloned"
                description="Truck management paths now match the original app. Data model can be added next in Prisma."
            />
        </RoleShell>
    );
}
