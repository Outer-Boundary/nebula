import { BottomsSubcategory, CategoryType, OuterwearSubcategory, TopsSubcategory } from "../types/Category";
import { Colour } from "../types/Colour";
import IProduct from "../types/IProduct";
import Material from "../types/Material";
import { SectionType } from "../types/SectionType";
import Size from "../types/Size";

export const testProducts: IProduct[] = [
  {
    name: "Plain T-Shirt",
    imageUrls: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgildan.my%2Fwp-content%2Fuploads%2F2020%2F02%2F76000B-24C-Gold.png&f=1&nofb=1&ipt=b6cf2017d0b012724ad5f06f3b92fcfb1919c1c771a57c11b61c1360e89b08d1&ipo=imageUrls",
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.blackandblue1871.com%2Fwp-content%2Fuploads%2Fsites%2F2%2F2018%2F05%2FB_B-TShirt-Plain-Grey-flat.jpg&f=1&nofb=1&ipt=7562ca53125fd3f68775cef233e15b235ff996e760ca35db4d0b9ecbd2a38dba&ipo=images",
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdemo.wpstartersites.com%2Fcordero-demo%2Fwp-content%2Fuploads%2Fsites%2F12%2F2020%2F06%2Fmens-tee-blue.jpg&f=1&nofb=1&ipt=c94d3abf117fce072e5b7ac925e4b72a296fb4f40990065242f68d94fd9b25ba&ipo=images",
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-na.ssl-images-amazon.com%2Fimages%2FI%2F71qow1RNpgL._AC_UL1500_.jpg&f=1&nofb=1&ipt=9e99d592a82df36a867a3be252dac85d5033c1eb97123977e728b68366438d59&ipo=images",
    ],
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    colours: [Colour.Yellow, Colour.Grey, Colour.Blue, Colour.DarkBrown],
    material: Material.Cotton,
    description: "",
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
    imageUrls: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2FA1Ig7DnP6sL._CLa%257C2140%252C2000%257C71ILa7fjURL.png%257C0%252C0%252C2140%252C2000%252B0.0%252C0.0%252C2140.0%252C2000.0_AC_UL1500_.png&f=1&nofb=1&ipt=09a1edc0a983662c573a1f8967463d022dc1456923b99416669a4fb49f72a29a&ipo=images",
    ],
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TankTop },
    colours: [Colour.Black],
    material: Material.Cotton,
    description: "",
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
    imageUrls: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.7w4lxSu3u1vqukiMZs3GCAHaOL%26pid%3DApi&f=1&ipt=7a43643eebdb98a22503357060f63348e6301e0216c1432dc76a760557de2632&ipo=images",
    ],
    section: SectionType.Clothing,
    category: { main: CategoryType.Bottoms, sub: BottomsSubcategory.Jeans },
    colours: [Colour.PastelBlue],
    material: Material.Denim,
    description: "",
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
    imageUrls: ["https://1.bp.blogspot.com/_NlXLy36jo0g/TGQgxk4kpCI/AAAAAAAAIX8/8LsndlhYqWI/s1600/64F17ACAM_large.jpg"],
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Coat },
    colours: [Colour.Beige],
    material: Material.Wool,
    description: "",
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
    imageUrls: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.w7cTdMXOMHWyZuPtWW-JSgHaHa%26pid%3DApi&f=1&ipt=80b2e3b22af0218085773b40f82aa1652048ac4d64e6da3276eeb593acce9c7f&ipo=images",
    ],
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
    colours: [Colour.LightGrey],
    material: Material.Wool,
    description: "",
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
    imageUrls: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Nx8fw_45KIdQPwCfDhskBAHaHa%26pid%3DApi&f=1&ipt=988307509aa05b2bd12bf583947d433423e30862a52854543f1d44dac5f8bf4d&ipo=images",
    ],
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Hoodie },
    colours: [Colour.PastelPink],
    material: Material.Cotton,
    description: "",
    target: "any",
    sizes: [
      { size: Size.XXS, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.L, amount: 8 },
    ],
    price: 40,
  },
  {
    name: "Anime Graphic T-Shirt",
    imageUrls: ["https://i.etsystatic.com/26956067/r/il/a2352f/3019208592/il_fullxfull.3019208592_p8od.jpg"],
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.TShirt },
    colours: [Colour.Black],
    material: Material.Cotton,
    description: "",
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
    imageUrls: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51ChuLnOqLL._AC_UX569_.jpg&f=1&nofb=1&ipt=1b29d0598b5cc5a4736c764da15e9bea733d44bc33ed729b03a3d3fdc41de482&ipo=images",
    ],
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Hoodie },
    colours: [Colour.Black],
    material: Material.Cotton,
    description: "",
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
    imageUrls: ["https://i5.walmartimages.com/asr/1f375da5-4715-4144-9719-b67e18354423_2.31c78210f152a2c7d0040493b78fdadb.jpeg"],
    section: SectionType.Clothing,
    category: { main: CategoryType.Tops, sub: TopsSubcategory.DressShirt },
    colours: [Colour.DarkBlue],
    material: Material.Cotton,
    description: "",
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
    imageUrls: [
      "https://i5.walmartimages.com/asr/12ce6a06-e148-4524-834b-9e856a869073_1.bc22a7440a4d2c905bb22103400af7cc.jpeg?odnWidth=1000&odnHeight=1000&odnBg=ffffff",
    ],
    section: SectionType.Clothing,
    category: { main: CategoryType.Bottoms, sub: BottomsSubcategory.SweatPants },
    colours: [Colour.Red],
    material: Material.Cotton,
    description: "",
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
    imageUrls: ["https://d2wfvd7ei865en.cloudfront.net/product-media/1YM1/800/1130/BereniceStripeJumperoffwhite1.jpg"],
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
    colours: [Colour.Cream],
    material: Material.Wool,
    description: "",
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
    imageUrls: ["https://static.smallable.com/741369-thickbox/two-tone-jumper.jpg"],
    section: SectionType.Clothing,
    category: { main: CategoryType.Outerwear, sub: OuterwearSubcategory.Jumper },
    colours: [Colour.Yellow],
    material: Material.Cotton,
    description: "",
    target: "any",
    sizes: [
      { size: Size.XXS, amount: 6 },
      { size: Size.M, amount: 10 },
      { size: Size.XL, amount: 8 },
    ],
    price: 37,
  },
];
