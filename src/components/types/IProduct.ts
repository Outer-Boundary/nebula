import { Category } from "./Category";
import Material from "./Material";
import { SectionType } from "./SectionType";
import Size from "./Size";

export default interface IProduct {
  name: string;
  image: string;
  section: SectionType;
  category: Category;
  material: Material;
  target: "men" | "women" | "any";
  onSale?: boolean;
  sizes: { size: Size; amount: number }[];
  price: number;
}
