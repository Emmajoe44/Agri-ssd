import { RoleShell } from "@/components/RoleShell";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";
import { requireRole } from "@/lib/server-auth";

export default async function AdminAddTruckPage() {
    const user = await requireRole(["ADMIN"]);

    return (
        <RoleShell user={user} title="Add Truck" subtitle="Create a new fleet entry.">
            <PlaceholderPanel
                title="Add-truck route cloned"
                description="Route path parity is complete. I can wire full truck create form + persistence in the next pass."
            />
        </RoleShell>
    );
}
