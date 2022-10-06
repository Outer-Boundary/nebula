import Category from "./Category";
import Material from "./Material";
import Size from "./Size";

export default interface IProduct {
  name: string;
  category: Category;
  material: Material;
  sizes: { size: Size; amount: number }[];
  price: number;
}
