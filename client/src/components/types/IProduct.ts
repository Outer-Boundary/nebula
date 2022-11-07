import { Category } from "./category";
import { Colour } from "./Colour";
import Material from "./Material";
import { SectionType } from "./SectionType";
import Size from "./Size";

export default interface IProduct {
  name: string;
  imageUrls: string[];
  section: SectionType;
  category: Category;
  colours: Colour[];
  material: Material;
  description: string;
  target: "men" | "women" | "any";
  onSale?: boolean;
  sizes: { size: Size; amount: number }[];
  price: number;
}
