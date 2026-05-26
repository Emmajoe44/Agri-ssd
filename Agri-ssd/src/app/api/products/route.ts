import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { productSchema } from "@/lib/validators";

export async function GET() {
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
    });

    return NextResponse.json({ products: products.map(serializeProduct) });
}

export async function POST(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "FARMER" && session.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = productSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid product data", details: parsed.error.flatten() },
            { status: 400 },
        );
    }

    const data = parsed.data;

    const created = await prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            category: data.category,
            imageUrl: data.imageUrl,
            stock: data.stock,
            price: data.price,
            farmerId: session.userId,
        },
        include: {
            farmer: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
        },
    });

    return NextResponse.json({ product: serializeProduct(created) }, { status: 201 });
}
