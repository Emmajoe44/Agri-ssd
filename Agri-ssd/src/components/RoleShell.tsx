import Link from "next/link";
import type { SessionUser } from "@/lib/auth";

type RoleName = SessionUser["role"];

type RoleNavItem = {
    href: string;
    label: string;
};

const navByRole: Record<RoleName, RoleNavItem[]> = {
    RETAILER: [
        { href: "/retailer", label: "Home" },
        { href: "/retailer/products", label: "Products" },
        { href: "/retailer/cart", label: "Cart" },
        { href: "/retailer/orders", label: "Orders" },
        { href: "/retailer/profile", label: "Profile" },
    ],
    FARMER: [
        { href: "/farmer", label: "Dashboard" },
        { href: "/farmer/products", label: "Products" },
        { href: "/farmer/products/new", label: "Add Product" },
        { href: "/farmer/sales", label: "Sales" },
        { href: "/farmer/profile", label: "Profile" },
    ],
    ADMIN: [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/orders", label: "Orders" },
        { href: "/admin/products", label: "Products" },
        { href: "/admin/trucks", label: "Trucks" },
        { href: "/admin/farmers", label: "Farmers" },
        { href: "/admin/retailers", label: "Retailers" },
        { href: "/admin/pricing", label: "Pricing" },
        { href: "/admin/analytics", label: "Analytics" },
        { href: "/admin/profile", label: "Profile" },
    ],
};

export function RoleShell({
    user,
    title,
    subtitle,
    children,
}: {
    user: SessionUser;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    const nav = navByRole[user.role];

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <header className="border-b border-zinc-200 bg-zinc-50/90 px-4 py-4 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        {user.role} PANEL
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-zinc-900">{title}</h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        {subtitle ?? `Signed in as ${user.fullName} (${user.email})`}
                    </p>
                </header>

                <div className="border-b border-zinc-200 px-2 py-2 sm:px-4">
                    <nav className="flex flex-wrap gap-2">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <section className="p-4 sm:p-6">{children}</section>
            </div>
        </main>
    );
}
