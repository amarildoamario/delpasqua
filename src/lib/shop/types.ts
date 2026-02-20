export type Specs = Record<string, string>;

export type ProductVariant = {
  id: string;
  label: string;
  priceCents: number;

  // new
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  specs?: Specs;
  stock?: number;
};

export type Product = {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  variants: ProductVariant[];

  // new
  specs?: Specs;
};
