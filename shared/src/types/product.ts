export interface Product {
  id: string;
  title: string;
  category: { main: string; sub: string };
  createdAt: string;
  updatedAt: string;
  active: boolean;
  tags: string[];
  vendor: string;
  options: { name: string; values: string[] }[];
  imageCardId: string;
  totalQuantity: number;
  timesSold: number;
  price: number;
  variants: ProductVariant[];
}

export interface ProductVariant {
  // id: string;
  quantity: number;
  options: { name: string; value: string }[];
  imageIds: string[];
}
