// src/lib/shopTypes.ts

export type ProductVariant = {
  id: string;
  label: string;
  priceCents: number; // IVA ESCLUSA

  // ✅ aggiunti (sono presenti nel products.json)
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  specs?: Record<string, string>;
  stock?: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageSrc: string;
  imageAlt: string;
  description?: string;
  specs?: Record<string, string>;
  variants: ProductVariant[];
};

export type CartLine = {
  productId: string;
  variantId: string;
  qty: number;
};

export type CustomerInfo = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
};
