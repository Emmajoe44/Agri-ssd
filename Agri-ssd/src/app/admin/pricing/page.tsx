import { RoleShell } from "@/components/RoleShell";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";
import { requireRole } from "@/lib/server-auth";

export default async function AdminPricingPage() {
    const user = await requireRole(["ADMIN"]);

    return (
        <RoleShell user={user} title="Admin Pricing" subtitle="Pricing rule management.">
            <PlaceholderPanel
                title="Pricing route cloned"
                description="This mirrors the old pricing path. Next step can be a full pricing policy model and editor."
            />
        </RoleShell>
    );
}
