import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      farmer: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    take: 12,
  });

  const serializedProducts = products.map(serializeProduct);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-lime-500 px-6 py-10 text-white shadow-lg sm:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/80">Agri SSD Marketplace</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
          Farm-to-retail commerce platform rebuilt in Next.js.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
          Manage product listings, role-based accounts, and order workflows with a fullstack
          architecture powered by Prisma.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-emerald-700">
            Create account
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-white/70 px-4 py-2 text-sm font-medium text-white">
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900">Latest Products</h2>
          <span className="text-sm text-zinc-500">{serializedProducts.length} listed</span>
        </div>

        {serializedProducts.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
            No products yet. Seed your database, then login as farmer to add products.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serializedProducts.map((product) => (
              <article key={product.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900">{product.name}</h3>
                <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
                <div className="mt-3 text-sm font-medium text-zinc-900">${product.price.toFixed(2)}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  Stock {product.stock} - Farmer {product.farmer.fullName}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
