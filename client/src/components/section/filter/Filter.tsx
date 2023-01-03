import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import { clamp, lerp } from "../../../helper/Helper";
import { useNebulaCtx } from "../../../context/NebulaContext";
import { categoryCollection } from "../../types/CategoryTypes";
import { Product } from "../../types/product";
import { SectionType } from "../../types/SectionType";
import CategoryFilter from "./filters/category-filter/CategoryFilter";
import MaterialFilter from "./filters/material-filter/MaterialFilter";
import PriceRangeFilter from "./filters/price-range-filter/PriceRangeFilter";
import SizeFilter from "./filters/size-filter/SizeFilter";
import SortByFilter, { sortByOptions } from "./filters/sort-by-filter/SortByFilter";
import "./styles/Filter.css";

interface FilterProps {
  section: SectionType;
  products: Product[] | null;
  setProducts: (products: Product[]) => void;
  setIsLoading: (state: boolean) => void;
}

interface FilterData {
  searchText: string;
  sortBy: number;
  categories: { main: boolean; sub: number[] }[];
  sizes: number[];
  materials: number[];
  priceRange: { low: number; high: number };
}

/* to do: 
- add colour filter
- make it so the user can set the highest and lowest price in the range range filter by directly entering an amount
- give every filter a show hide button
- fix filters not being reset when going from section all to clothing or vice versa the first time either is clicked
*/
export default function Filter(props: FilterProps) {
  const [priceRange, setPriceRange] = useState({ low: 0, high: 0 });

  const nebulaContext = useNebulaCtx();

  useEffect(() => {
    resetFilters();
    resetPriceRange(priceRange.low, priceRange.high);
  }, [props.section]);

  useEffect(() => {
    (async () => {
      const priceRange = await getPriceRange();
      setPriceRange(priceRange);
      resetPriceRange(priceRange.low, priceRange.high);

      const filterDataString = localStorage.getItem("filterData");
      if (filterDataString) {
        setFiltersFromFilterData(JSON.parse(filterDataString) as FilterData);
      }
      filterProducts();
    })();

    window.onunload = () => {
      localStorage.removeItem("filterData");
    };
  }, []);

  function setFiltersFromFilterData(filterData: FilterData) {
    // search bar
    (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value = filterData.searchText;
    // sort by
    (document.getElementById("sort-by-select") as HTMLInputElement).value = sortByOptions[filterData.sortBy]
      .toLowerCase()
      .replace(/\s/g, "-");
    // categories
    const categories = document
      .getElementById("categories-container")
      ?.querySelectorAll("input.category-checkbox") as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < categories.length; i++) {
      if (filterData.categories[i].main) {
        categories[i].checked = true;
      }
      const subcategories = document
        .getElementById(`${categories[i].name.toLowerCase()}-subcategories-container`)!
        .querySelectorAll("input.subcategory-checkbox") as NodeListOf<HTMLInputElement>;
      for (let ii = 0; ii < filterData.categories[i].sub.length; ii++) {
        subcategories[filterData.categories[i].sub[ii]].checked = true;
      }
    }
    // sizes
    const sizes = document.getElementById("sizes-container")!.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < filterData.sizes.length; i++) {
      sizes[filterData.sizes[i]].checked = true;
    }
    // materials
    const materials = document.getElementById("materials-container")!.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < filterData.materials.length; i++) {
      materials[filterData.materials[i]].checked = true;
    }
    resetPriceRange(filterData.priceRange.low, filterData.priceRange.high);
  }

  // goes through each filter then sets the products being viewed
  async function filterProducts() {
    props.setIsLoading(true);

    const filterData = {
      searchText: "",
      sortBy: 0,
      categories: Object.keys(categoryCollection[nebulaContext.group]).map(() => ({ main: false, sub: [] })),
      sizes: [],
      materials: [],
      priceRange: { low: 0, high: 0 },
    };

    const urlFilters: string[] = [];
    searchFilter(urlFilters, filterData);
    sortByFilter(urlFilters, filterData);
    categoryFilter(urlFilters, filterData);
    sizeFilter(urlFilters, filterData);
    materialFilter(urlFilters, filterData);
    priceRangeFilter(urlFilters, filterData);

    const response = await fetch(`http://localhost:5000/products?${urlFilters.join("&")}`);
    const products: Product[] = await response.json();

    props.setProducts(products);
    localStorage.setItem("filterData", JSON.stringify(filterData));
  }

  // filters the products based on the search string and the product names. can use a hyphen to negate a search
  async function searchFilter(urlFilters: string[], filterData: FilterData) {
    const searchString = (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value;

    filterData.searchText = searchString;

    if (searchString.replace(/\s/g, "") === "") return;

    const searchFilters = searchString
      .toLowerCase()
      .replace(/(?<=\s)\s|\s$|[^\w\s-]|_/g, "")
      .split(" ");

    let positiveSearchFilters: string[] = [];
    let negativeSearchFilters: string[] = [];
    for (const searchFilter of searchFilters) {
      let isNegated = searchFilter.startsWith("-");
      if (!isNegated) {
        positiveSearchFilters.push(searchFilter.toLowerCase());
      } else {
        negativeSearchFilters.push(searchFilter.replace("-", "").toLowerCase());
      }
    }

    let filter = "";
    if (positiveSearchFilters.length > 0) {
      filter += `/${positiveSearchFilters.join("|")}/`;
    }
    if (negativeSearchFilters.length > 0) {
      filter += `!/${negativeSearchFilters.join("|")}/`;
    }
    if (filter.length > 0) urlFilters.push(`title=$regex:${filter}`);
  }

  // // sorts the products based on the selected sorting option
  function sortByFilter(urlFilters: string[], filterData: FilterData) {
    const option = (document.getElementById("sort-by-select") as HTMLInputElement).value.toLowerCase();

    // for now while popularity and item release dates don't exist
    if (option !== "price-low" && option !== "price-high") return;

    const index = sortByOptions.findIndex((x) => x.toLowerCase().replace(/\s/g, "-") === option);
    filterData.sortBy = index === -1 ? 0 : index;

    switch (option) {
      case "price-low":
        urlFilters.push("$sort=price:1");
        break;
      case "price-high":
        urlFilters.push("$sort=price:-1");
        break;
      default:
        // make sure each case matches the value in each option
        console.error("Invalid sorting option");
        break;
    }
  }

  // // filters products by their category and subcategory. if subcategories are checked by the main category isn't they are ignored
  function categoryFilter(urlFilters: string[], filterData: FilterData) {
    const categories = document
      .getElementById("categories-container")
      ?.querySelectorAll("input.category-checkbox") as NodeListOf<HTMLInputElement>;

    let categoryFilters: string[] = [];
    let subcategoryFilters: string[] = [];
    for (let i = 0; i < categories.length; i++) {
      const subcategories = Array.from(
        document
          .getElementById(`${categories[i].name.toLowerCase()}-subcategories-container`)!
          .querySelectorAll("input.subcategory-checkbox") as NodeListOf<HTMLInputElement>
      );
      // if there are subcategories checked and it matches the product or there are no subcategories checked and the category matches the product's
      if (categories[i].checked) {
        let subcategoryChecked = false;
        for (let ii = 0; ii < subcategories.length; ii++) {
          if (subcategories[ii].checked) {
            subcategoryFilters.push(subcategories[ii].name.toLowerCase());
            subcategoryChecked = true;
          }
        }
        if (!subcategoryChecked) {
          categoryFilters.push(categories[i].name.toLowerCase());
          filterData.categories[i].main = true;
        }
      }
      for (let ii = 0; ii < subcategories.length; ii++) {
        if (subcategories[ii].checked) filterData.categories[i].sub.push(ii);
      }
    }
    if (categoryFilters.length > 0 && subcategoryFilters.length > 0) {
      urlFilters.push(`(category.main=${categoryFilters.join()}|category.sub=${subcategoryFilters.join()})`);
    } else if (categoryFilters.length > 0) {
      urlFilters.push(`category.main=${categoryFilters.join()}`);
    } else if (subcategoryFilters.length > 0) {
      urlFilters.push(`category.sub=${subcategoryFilters.join()}`);
    }
  }

  // filters products based on the selected sizes. shoes products that have either size
  function sizeFilter(urlFilters: string[], filterData: FilterData) {
    const sizes = document.getElementById("sizes-container")!.querySelectorAll("input") as NodeListOf<HTMLInputElement>;

    let sizeFilters: string[] = [];
    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i].checked) {
        sizeFilters.push(sizes[i].name.toLowerCase());
        filterData.sizes.push(i);
      }
    }
    if (sizeFilters.length > 0) urlFilters.push(`sizes=${sizeFilters.join()}`);
  }

  // filters products based on the selected materials. shoes products that have either material
  function materialFilter(urlFilters: string[], filterData: FilterData) {
    const materials = document.getElementById("materials-container")!.querySelectorAll("input") as NodeListOf<HTMLInputElement>;

    let materialFilters: string[] = [];
    for (let i = 0; i < materials.length; i++) {
      if (materials[i].checked) {
        materialFilters.push(materials[i].name.toLowerCase());
        filterData.materials.push(i);
      }
    }
    if (materialFilters.length > 0) urlFilters.push(`material=${materialFilters.join()}`);
  }

  // filters products by the specified price range
  function priceRangeFilter(urlFilters: string[], filterData: FilterData) {
    const lowPrice = parseInt(document.getElementsByClassName("low-price-text")[0].innerHTML.replace(/\$/g, ""));
    const highPrice = parseInt(document.getElementsByClassName("high-price-text")[0].innerHTML.replace(/\$/g, ""));
    urlFilters.push(`price=${lowPrice}-${highPrice}`);
    filterData.priceRange = { low: lowPrice, high: highPrice };
  }

  // gets the highest and lowest price of the products
  async function getPriceRange(): Promise<{ low: number; high: number }> {
    const response = await fetch("http://localhost:5000/products/metadata");
    const metadata: { priceRange: { low: number; high: number } } = await response.json();
    return { low: metadata.priceRange.low, high: metadata.priceRange.high };
  }

  // resets filters to their default state (when switching sections)
  function resetFilters() {
    // resets search filter
    (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value = "";

    // resets sort by to its first option
    const sortBySelectElement = document.getElementById("sort-by-select") as HTMLInputElement;
    sortBySelectElement.value = (sortBySelectElement.children[0] as HTMLOptionElement).value;

    // resets category and subcategory checkboxes
    resetCheckboxes("categories-container");

    // resets size checkboxes
    resetCheckboxes("sizes-container");

    // resets material checkboxes
    resetCheckboxes("materials-container");

    // resets price range
    resetPriceRange(priceRange.low, priceRange.high);
  }

  // resets the price range
  function resetPriceRange(lowPrice: number, highPrice: number) {
    const lowPriceHandle = document.getElementById("low-price-handle-container") as HTMLElement;
    const highPriceHandle = document.getElementById("high-price-handle-container") as HTMLElement;
    const barBounds = (document.getElementsByClassName("price-range-slider-container")[0] as HTMLElement).getBoundingClientRect();
    lowPriceHandle.style.left = 0 - lowPriceHandle.getBoundingClientRect().width / 2 + "px";
    highPriceHandle.style.left = barBounds.width - highPriceHandle.getBoundingClientRect().width / 2 + "px";

    const lowPriceText = document.getElementsByClassName("low-price-text")[0];
    const highPriceText = document.getElementsByClassName("high-price-text")[0];
    lowPriceText.innerHTML = "$" + lowPrice;
    highPriceText.innerHTML = "$" + highPrice;

    const lowBar = document.getElementsByClassName("price-range-bar-low")[0] as HTMLElement;
    const highBar = document.getElementsByClassName("price-range-bar-high")[0] as HTMLElement;
    lowBar.style.left = "-100%";
    lowBar.style.right = "unset";
    highBar.style.right = "-100%";
    highBar.style.left = "unset";
  }

  // unchecks all checkboxes that are a child of the specified container
  function resetCheckboxes(containerId: string) {
    const container = document.getElementById(containerId);
    if (container) {
      (container.querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>).forEach((x) => (x.checked = false));
    }
  }

  return (
    <div className="filter">
      <form className="search-container">
        <input type="text" className="search-input" />
        <button
          type="submit"
          className="search-btn"
          onClick={(e) => {
            e.preventDefault();
            filterProducts();
          }}
        >
          <FiSearch className="search-icon" />
        </button>
      </form>
      <SortByFilter />
      <CategoryFilter group={nebulaContext.group} />
      <SizeFilter />
      <MaterialFilter />
      <PriceRangeFilter priceRange={priceRange} />
      <div className="btn-container">
        <button className="apply-filters-btn filter-btn" onClick={() => filterProducts()}>
          APPLY FILTERS
        </button>
        <button
          className="clear-filters-btn filter-btn"
          onClick={() => {
            resetFilters();
            filterProducts();
          }}
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}
