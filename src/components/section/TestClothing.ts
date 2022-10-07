import { BottomsSubcategory, CategoryType, OuterwearSubcategory, TopsSubcategory } from "../types/Category";
import IProduct from "../types/IProduct";
import Material from "../types/Material";
import { SectionType } from "../types/SectionType";
import Size from "../types/Size";

export const testProducts: IProduct[] = [
  {
    name: "Plain TShirt",
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.XL, amount: 8 },
    ],
    price: 18,
  },
  {
    name: "Sunset Graphic Tank Top",
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TankTop },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 20,
  },
  {
    name: "Denim Jeans",
    section: SectionType.Clothing,
    category: { main: CategoryType.Bottoms, sub: BottomsSubcategory.Jeans },
    material: Material.Denim,
    target: "any",
    sizes: [
      { size: Size.XS, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 35,
  },
  {
    name: "Plain Coat",
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Coat },
    material: Material.Wool,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 60,
  },
  {
    name: "Plain Sweatshirt",
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Wool,
    target: "any",
    sizes: [
      { size: Size.XS, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 25,
  },
  {
    name: "Anime Graphic Hoodie",
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Hoodie },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.XXS, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 40,
  },
  {
    name: "Anime Graphic TShirt",
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.XL, amount: 8 },
    ],
    price: 22,
  },
  {
    name: "Renaissance Graphic Hoodie",
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.XL, amount: 8 },
    ],
    price: 48,
  },
  {
    name: "Plain Dress Shirt",
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.DressShirt },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 28,
  },
  {
    name: "Checkered Sweatpants",
    section: SectionType.Clothing,
    category: { main: CategoryType.Bottoms, sub: BottomsSubcategory.SweatPants },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.XXL, amount: 8 },
    ],
    price: 34,
  },
  {
    name: "Striped Jumper",
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.XXL, amount: 8 },
    ],
    price: 40,
  },
  {
    name: "Two-tone Jumper",
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
    material: Material.Cotton,
    target: "any",
    sizes: [
      { size: Size.XXS, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.XL, amount: 8 },
    ],
    price: 37,
  },
];
