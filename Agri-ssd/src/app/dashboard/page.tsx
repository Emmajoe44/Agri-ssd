import { redirect } from "next/navigation";
import { requireSession } from "@/lib/server-auth";

export default async function DashboardRedirectPage() {
    const session = await requireSession();

    if (session.role === "RETAILER") {
        redirect("/retailer");
    }

    if (session.role === "FARMER") {
        redirect("/farmer");
    }

    redirect("/admin");
}
