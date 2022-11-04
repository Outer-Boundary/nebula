export interface Product {
  id: number;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  tags: string[];
  vendor: string;
  options: { name: string; values: string[] }[];
  imageCardId: number;
  totalQuantity: number;
  timesSold: number;
  price: number;
}

export interface ProductVariant {
  id: number;
  quantity: number;
  options: { name: string; value: string }[];
  imageIds: number[];
}
