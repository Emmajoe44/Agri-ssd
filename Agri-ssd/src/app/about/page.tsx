export default function AboutPage() {
    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">About AgriMarket</p>
                <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
                    Built for South Sudan's agriculture supply chain.
                </h1>
                <p className="mt-4 max-w-3xl text-zinc-600">
                    Agri SSD connects farmers, retailers, and logistics teams in one digital marketplace.
                    Farmers list produce, retailers place orders, and admins coordinate delivery operations.
                </p>
            </section>
        </main>
    );
}
