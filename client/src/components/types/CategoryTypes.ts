// These categories are common to all category groups.
const commonCategories = {
  all: [],
  new: [],
  sale: [],
} as const;

// These categories are found in multiple category groups, like home, women, and men.
const generalCategories = {
  tops: ["TShirt", "LongSleeveShirt", "TankTop", "Flannel", "PoloShirt", "DressShirt"],
  bottoms: ["Pants", "Shorts", "Sweatpants", "Jeans"],
  outerwear: ["Jacket", "Hoodie", "Vest", "Coat", "Jumper"],
  activewear: [],
  swimwear: [],
  underwear: [],
  shoes: [],
  accessories: [],
} as const;

const womenCategories = {
  ...commonCategories,
  ...generalCategories,
  dresses: [],
} as const;

const menCategories = {
  ...commonCategories,
  ...generalCategories,
} as const;

const beautyCategories = {
  ...commonCategories,
  makeup: [],
  skincare: [],
  equipment: [],
} as const;

const allCategories = { ...womenCategories, ...menCategories, ...beautyCategories } as const;

export const categoryCollection = {
  home: allCategories,
  women: womenCategories,
  men: menCategories,
  beauty: beautyCategories,
} as const;

export type CommonCategory = keyof typeof commonCategories;

export type GeneralCategory = keyof typeof generalCategories;

export type WomenCategory = keyof typeof womenCategories;

export type MenCategory = keyof typeof menCategories;

export type BeautyCategory = keyof typeof beautyCategories;

export type AllCategory = keyof typeof allCategories;

export type CategoryGroup = keyof typeof categoryCollection;
