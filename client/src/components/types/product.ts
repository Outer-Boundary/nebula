export interface Product {
  _id: string;
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
  imageCardUrl: string;
  imageUrls: string[];
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
  imageUrls: string[];
}
