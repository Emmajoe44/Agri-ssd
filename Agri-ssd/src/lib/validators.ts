import { z } from "zod";

export const roleSchema = z.enum(["FARMER", "RETAILER"]);

export const registerSchema = z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6).max(100),
    role: roleSchema.default("RETAILER"),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6).max(100),
});

export const productSchema = z.object({
    name: z.string().trim().min(2).max(140),
    description: z.string().trim().min(10).max(1200),
    category: z.string().trim().min(2).max(80).optional(),
    imageUrl: z.string().trim().url().optional(),
    price: z.coerce.number().positive().max(10000000),
    stock: z.coerce.number().int().nonnegative().max(1000000),
});

export const createOrderSchema = z.object({
    items: z
        .array(
            z.object({
                productId: z.string().trim().min(1),
                quantity: z.coerce.number().int().positive().max(1000),
            }),
        )
        .min(1),
});
