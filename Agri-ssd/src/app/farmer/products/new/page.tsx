import { RoleShell } from "@/components/RoleShell";
import { ProductCreator } from "@/app/dashboard/ProductCreator";
import { requireRole } from "@/lib/server-auth";

export default async function FarmerAddProductPage() {
    const user = await requireRole(["FARMER", "ADMIN"]);

    return (
        <RoleShell user={user} title="Add Product" subtitle="Create a new farm listing.">
            <ProductCreator />
        </RoleShell>
    );
}
