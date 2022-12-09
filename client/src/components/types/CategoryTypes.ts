// These categories are common to all category groups.
const commonCategories = ["all", "new", "sale"] as const;

// These categories are found in multiple category groups, like home, women, and men.
const generalCategories = [
  "tops",
  "bottoms",
  "outerwear",
  "activewear",
  "swimwear",
  "underwear",
  "shoes",
  "accessories",
] as const;

const womenCategories = [...commonCategories, "dresses", ...generalCategories] as const;

const menCategories = [...commonCategories, ...generalCategories] as const;

const beautyCategories = [...commonCategories, "makeup", "skincare", "equipment"] as const;

const allCategories = [...new Set([...womenCategories, ...menCategories])] as const;

export const categoryCollection = {
  home: allCategories,
  women: womenCategories,
  men: menCategories,
  beauty: beautyCategories,
} as const;

export type CommonCategories = typeof commonCategories[number];

export type GeneralCategories = typeof generalCategories[number];

export type WomenCategories = typeof womenCategories[number];

export type MenCategories = typeof menCategories[number];

export type BeautyCategories = typeof beautyCategories[number];

export type AllCategories = typeof allCategories[number];

export type CategoryGroups = keyof typeof categoryCollection;
