type Category =
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
  Tops,
  Bottoms,
  Outerwear,
  Underwear,
  Socks,
  Hats,
}

export enum TopsSubcategory {
  TShirt,
  LongSleeveShirt,
  TankTop,
  Flannel,
  PoloShirt,
  DressShirt,
}

export enum BottomsSubcategory {
  Pants,
  Shorts,
  SweatPants,
  Jeans,
}

export enum OuterwearSubcategory {
  Jacket,
  Hoodie,
  Vest,
  Coat,
  Jumper,
}

export default Category;
