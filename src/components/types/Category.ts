export type Category =
  | {
      main: CategoryType.Tops;
      sub: TopsSubcategory;
    }
  | {
      main: CategoryType.Bottoms;
      sub: BottomsSubcategory;
    }
  | {
      main: CategoryType.Outerwear;
      sub: OuterwearSubcategory;
    };

export enum CategoryType {
  Tops = "Tops",
  Bottoms = "Bottoms",
  Outerwear = "Outerwear",
  Underwear = "Underwear",
  Socks = "Socks",
  Hats = "Hats",
}

export enum TopsSubcategory {
  TShirt = "TShirt",
  LongSleeveShirt = "LongSleeveShirt",
  TankTop = "TankTop",
  Flannel = "Flannel",
  PoloShirt = "PoloShirt",
  DressShirt = "DressShirt",
}

export enum BottomsSubcategory {
  Pants = "Pants",
  Shorts = "Shorts",
  SweatPants = "SweatPants",
  Jeans = "Jeans",
}

export enum OuterwearSubcategory {
  Jacket = "Jacket",
  Hoodie = "Hoodie",
  Vest = "Vest",
  Coat = "Coat",
  Jumper = "Jumper",
}

export const Categories = [
  { main: CategoryType.Tops, sub: TopsSubcategory },
  { main: CategoryType.Bottoms, sub: BottomsSubcategory },
  { main: CategoryType.Outerwear, sub: OuterwearSubcategory },
];
