export interface Product {
  id: string;
  title: string;
  description: string;
  category: { main: string; sub: string };
  createdAt: string;
  updatedAt: string;
  active: boolean;
  tags: string[];
  vendor: string;
  sizes: string[];
  colours: string[];
  material: string;
  imageCardId: string;
  totalQuantity: number;
  timesSold: number;
  price: number;
}

export interface ProductVariant {
  productId: string;
  quantity: number;
  size: string;
  colour: string;
  material: string;
  imageIds: string[];
}
