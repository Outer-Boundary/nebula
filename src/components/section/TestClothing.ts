import { BottomsSubcategory, CategoryType, OuterwearSubcategory, TopsSubcategory } from "../types/Category";
import IProduct from "../types/IProduct";
import Material from "../types/Material";
import Size from "../types/Size";

export const testProducts: IProduct[] = [
  {
    name: "Plain TShirt",
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 18,
  },
  {
    name: "Sunset Graphic Tank Top",
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TankTop },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 20,
  },
  {
    name: "Denim Jeans",
    category: { main: CategoryType.Bottoms, sub: BottomsSubcategory.Jeans },
    material: Material.Denim,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 35,
  },
  {
    name: "Plain Coat",
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Coat },
    material: Material.Wool,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 60,
  },
  {
    name: "Plain Sweatshirt",
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Wool,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 25,
  },
  {
    name: "Anime Graphic Hoodie",
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Hoodie },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 40,
  },
  {
    name: "Anime Graphic TShirt",
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 22,
  },
  {
    name: "Renaissance Hoodie",
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 48,
  },
  {
    name: "Plain Dress Shirt",
    category: { main: CategoryType.Tops, sub: TopsSubcategory.DressShirt },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 28,
  },
  {
    name: "Checkered Sweatpants",
    category: { main: CategoryType.Bottoms, sub: BottomsSubcategory.SweatPants },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 34,
  },
  {
    name: "Striped Jumper",
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 40,
  },
  {
    name: "Two-tone Jumper",
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
    material: Material.Cotton,
    sizes: [
      { size: Size.S, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 37,
  },
];
