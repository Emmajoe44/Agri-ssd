type ProductForJson = {
    id: string;
    name: string;
    description: string;
    category: string | null;
    imageUrl: string | null;
    stock: number;
    price: { toString: () => string } | number;
    farmer: {
        id: string;
        fullName: string;
    };
};

type OrderForJson = {
    id: string;
    status: string;
    createdAt: Date;
    total: { toString: () => string } | number;
    items: Array<{
        id: string;
        quantity: number;
        unitPrice: { toString: () => string } | number;
        product: {
            id: string;
            name: string;
            imageUrl: string | null;
        };
    }>;
};

function asNumber(value: { toString: () => string } | number): number {
    if (typeof value === "number") {
        return value;
    }

    return Number(value.toString());
}

export function serializeProduct(product: ProductForJson) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock,
        price: asNumber(product.price),
        farmer: product.farmer,
    };
}

export function serializeOrder(order: OrderForJson) {
    return {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        total: asNumber(order.total),
        items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: asNumber(item.unitPrice),
            product: item.product,
        })),
    };
}
