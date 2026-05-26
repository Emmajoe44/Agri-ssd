import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";
import { createOrderSchema } from "@/lib/validators";

export async function GET(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where =
        session.role === "ADMIN" ? {} : { retailerId: session.userId };

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true,
                        },
                    },
                },
            },
        },
    });

    return NextResponse.json({ orders: orders.map(serializeOrder) });
}

export async function POST(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "RETAILER" && session.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = createOrderSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid order payload", details: parsed.error.flatten() },
            { status: 400 },
        );
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const products = await tx.product.findMany({
                where: {
                    id: {
                        in: parsed.data.items.map((item) => item.productId),
                    },
                },
            });

            if (products.length !== parsed.data.items.length) {
                throw new Error("One or more products were not found");
            }

            let total = 0;

            for (const line of parsed.data.items) {
                const product = products.find((entry) => entry.id === line.productId);
                if (!product) {
                    throw new Error("One or more products were not found");
                }

                if (product.stock < line.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }

                total += Number(product.price) * line.quantity;
            }

            const created = await tx.order.create({
                data: {
                    retailerId: session.userId,
                    total: Number(total.toFixed(2)),
                    items: {
                        create: parsed.data.items.map((line) => {
                            const product = products.find((entry) => entry.id === line.productId)!;
                            return {
                                productId: line.productId,
                                quantity: line.quantity,
                                unitPrice: product.price,
                            };
                        }),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                },
            });

            await Promise.all(
                parsed.data.items.map((line) =>
                    tx.product.update({
                        where: { id: line.productId },
                        data: {
                            stock: { decrement: line.quantity },
                        },
                    }),
                ),
            );

            return created;
        });

        return NextResponse.json({ order: serializeOrder(result) }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Could not place order";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
