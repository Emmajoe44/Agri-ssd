import { RoleShell } from "@/components/RoleShell";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";
import { requireRole } from "@/lib/server-auth";

export default async function RetailerCartPage() {
    const user = await requireRole(["RETAILER", "ADMIN"]);

    return (
        <RoleShell user={user} title="Retailer Cart" subtitle="Review selected products before placing an order.">
            <PlaceholderPanel
                title="Cart flow cloned"
                description="This route now matches the original path. Next step is plugging in persistent cart state and quantity controls like the original web app."
            />
        </RoleShell>
    );
}
