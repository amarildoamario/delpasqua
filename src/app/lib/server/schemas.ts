import { z } from "zod";

export const CartLineSchema = z.object({
  productId: z.string().min(1).max(64),
  variantId: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(99),
});

export const CheckoutSchema = z.object({
  items: z.array(CartLineSchema).min(1).max(50),
});

export const CustomerSchema = z.object({
  fullName: z.string().min(3).max(120),
  email: z.string().email().max(200),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(120),
  zip: z.string().min(4).max(20),
});

export const CreateOrderSchema = z.object({
  items: z.array(CartLineSchema).min(1).max(50),
  customer: CustomerSchema,
});
