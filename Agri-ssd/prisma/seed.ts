import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash("password123", 12);

    const admin = await prisma.user.create({
        data: {
            email: "admin@agri-ssd.local",
            fullName: "System Admin",
            passwordHash,
            role: "ADMIN",
        },
    });

    const farmer = await prisma.user.create({
        data: {
            email: "farmer@agri-ssd.local",
            fullName: "Grace Farmer",
            passwordHash,
            role: "FARMER",
        },
    });

    const retailer = await prisma.user.create({
        data: {
            email: "retailer@agri-ssd.local",
            fullName: "Mina Retailer",
            passwordHash,
            role: "RETAILER",
        },
    });

    const products = await prisma.product.createManyAndReturn({
        data: [
            {
                name: "Organic Tomatoes",
                description: "Fresh organic tomatoes harvested this morning.",
                category: "Vegetables",
                imageUrl:
                    "https://images.unsplash.com/photo-1546470427-e5ac89cd0b7d?auto=format&fit=crop&w=1200&q=80",
                price: 4.5,
                stock: 120,
                farmerId: farmer.id,
            },
            {
                name: "Golden Corn",
                description: "Sweet corn packed in fresh bunches for retail stores.",
                category: "Grains",
                imageUrl:
                    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80",
                price: 2.2,
                stock: 240,
                farmerId: farmer.id,
            },
            {
                name: "Premium Rice",
                description: "Premium grade polished rice in 25kg bags.",
                category: "Staples",
                imageUrl:
                    "https://images.unsplash.com/photo-1586201375761-83865001e31f?auto=format&fit=crop&w=1200&q=80",
                price: 16.75,
                stock: 75,
                farmerId: farmer.id,
            },
        ],
    });

    await prisma.order.create({
        data: {
            retailerId: retailer.id,
            status: "CONFIRMED",
            total: Number(
                products
                    .reduce((sum, item) => sum + Number(item.price) * 2, 0)
                    .toFixed(2),
            ),
            items: {
                create: products.map((item) => ({
                    productId: item.id,
                    quantity: 2,
                    unitPrice: item.price,
                })),
            },
        },
    });

    console.log("Seed complete");
    console.log("Admin:", admin.email, "password123");
    console.log("Farmer:", farmer.email, "password123");
    console.log("Retailer:", retailer.email, "password123");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
