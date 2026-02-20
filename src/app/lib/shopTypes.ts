export type ProductVariant = {
  id: string;
  label: string;
  priceCents: number; // IVA ESCLUSA
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
