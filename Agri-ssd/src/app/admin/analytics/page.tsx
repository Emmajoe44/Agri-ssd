import { RoleShell } from "@/components/RoleShell";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";
import { requireRole } from "@/lib/server-auth";

export default async function AdminAnalyticsPage() {
    const user = await requireRole(["ADMIN"]);

    return (
        <RoleShell user={user} title="Admin Analytics" subtitle="Demand and sales intelligence.">
            <PlaceholderPanel
                title="Analytics route cloned"
                description="Route parity is complete. I can port over the original chart widgets next using your current data model."
            />
        </RoleShell>
    );
}
