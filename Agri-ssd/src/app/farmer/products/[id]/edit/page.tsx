import { notFound } from "next/navigation";
import { RoleShell } from "@/components/RoleShell";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export default async function FarmerEditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await requireRole(["FARMER", "ADMIN"]);
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        notFound();
    }

    if (user.role === "FARMER" && product.farmerId !== user.userId) {
        notFound();
    }

    return (
        <RoleShell user={user} title={`Edit ${product.name}`} subtitle="Original edit route is now available.">
            <PlaceholderPanel
                title="Edit flow placeholder"
                description="This page path matches the previous app. If you want, I can wire full editable fields + PATCH endpoint next."
            />
        </RoleShell>
    );
}
