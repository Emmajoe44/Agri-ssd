export function PlaceholderPanel({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <section className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6">
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{description}</p>
        </section>
    );
}
