import { BottomsSubcategory, CategoryType, OuterwearSubcategory, TopsSubcategory } from "../types/Category";
import IProduct from "../types/IProduct";
import Material from "../types/Material";
// import { SectionType } from "../types/CategoryTypes";
import Size from "../types/Size";

export const testProducts: IProduct[] = [
  {
    name: "Plain TShirt",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgildan.my%2Fwp-content%2Fuploads%2F2020%2F02%2F76000B-24C-Gold.png&f=1&nofb=1&ipt=b6cf2017d0b012724ad5f06f3b92fcfb1919c1c771a57c11b61c1360e89b08d1&ipo=images",
    // section: SectionType.Clothing,
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
    image:
      "https://m.media-amazon.com/images/I/A1Ig7DnP6sL._CLa%7C2140%2C2000%7C81alJh2hy2L.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UL1500_.png",
    // section: SectionType.Clothing,
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
    image: "https://images.burkesoutlet.com/i/burkesoutlet/236-2296-5500-97-yyy?h=1200&w=627",
    // section: SectionType.Clothing,
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
    image: "https://1.bp.blogspot.com/_NlXLy36jo0g/TGQgxk4kpCI/AAAAAAAAIX8/8LsndlhYqWI/s1600/64F17ACAM_large.jpg",
    // section: SectionType.Clothing,
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
    name: "Plain Jumper",
    image: "https://images.fcwholesale.com/MN/MN0665-02.jpg",
    // section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
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
    image: "https://images-na.ssl-images-amazon.com/images/I/61TjewzaBsL._AC_UL1024_.jpg",
    // section: SectionType.Clothing,
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
    image: "https://i.etsystatic.com/26956067/r/il/a2352f/3019208592/il_fullxfull.3019208592_p8od.jpg",
    // section: SectionType.Clothing,
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
    image: "https://m.media-amazon.com/images/I/51ChuLnOqLL._AC_UX569_.jpg",
    // section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Hoodie },
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
    image:
      "https://i5.walmartimages.com/asr/1f375da5-4715-4144-9719-b67e18354423_2.31c78210f152a2c7d0040493b78fdadb.jpeg",
    // section: SectionType.Clothing,
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
    image:
      "https://i5.walmartimages.com/asr/12ce6a06-e148-4524-834b-9e856a869073_1.bc22a7440a4d2c905bb22103400af7cc.jpeg?odnWidth=1000&odnHeight=1000&odnBg=ffffff",
    // section: SectionType.Clothing,
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
    image: "https://d2wfvd7ei865en.cloudfront.net/product-media/1YM1/800/1130/BereniceStripeJumperoffwhite1.jpg",
    // section: SectionType.Clothing,
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
    image: "https://static.smallable.com/741369-thickbox/two-tone-jumper.jpg",
    // section: SectionType.Clothing,
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
