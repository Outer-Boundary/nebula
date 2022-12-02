import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import { clamp, getEnumValues, lerp } from "../../../helper/Helper";
import { Categories, CategoryType } from "../../types/category";
import Material from "../../types/Material";
import { Product } from "../../types/product";
import { SectionType } from "../../types/SectionType";
import Size from "../../types/Size";
import "./styles/Filter.css";

interface FilterProps {
  section: SectionType;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

interface FilterData {
  searchText: string;
  sortBy: number;
  categories: { main: boolean; sub: number[] }[];
  sizes: number[];
  materials: number[];
  priceRange: { low: number; high: number };
}

const filterDataInitState: FilterData = {
  searchText: "",
  sortBy: 0,
  categories: getEnumValues(CategoryType).map(() => ({ main: false, sub: [] })),
  sizes: [],
  materials: [],
  priceRange: { low: 0, high: 0 },
};

const sortByOptions = ["Most Popular", "Newest", "Price Low to High", "Price High to Low"];

/* to do: 
- add colour filter
- make it so the user can set the highest and lowest price in the range range filter by directly entering an amount
- give every filter a show hide button
- fix filters not being reset when going from section all to clothing or vice versa the first time either is clicked
*/
export default function Filter(props: FilterProps) {
  const [priceRange, setPriceRange] = useState({ low: 0, high: 0 });
  const [priceHandleInfo, setPriceHandleInfo] = useState<{ handle?: "low" | "high"; offset?: number; isMoving: boolean }>({
    isMoving: false,
  });
  // const [filterData, setFilterData] = useState<FilterData>(filterDataInitState);

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
        filterProducts();
      }
    })();
  }, []);

  function setFiltersFromFilterData(filterData: FilterData) {
    (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value = filterData.searchText;
    (document.getElementById("sort-by-select") as HTMLInputElement).value = sortByOptions[filterData.sortBy]
      .toLowerCase()
      .replace(/\s/g, "-");
  }

  // goes through each filter then sets the products being viewed
  async function filterProducts() {
    const filterData = filterDataInitState;
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
        positiveSearchFilters.push(searchFilter);
      } else {
        negativeSearchFilters.push(searchFilter.replace("-", ""));
      }
    }

    let filter = "";
    if (positiveSearchFilters.length > 0) {
      filter += `/${positiveSearchFilters.join("|")}/i`;
    }
    if (negativeSearchFilters.length > 0) {
      filter += `!/${negativeSearchFilters.join("|")}/i`;
    }
    if (filter.length > 0) urlFilters.push(`title=$regex:${filter}`);
  }

  // // sorts the products based on the selected sorting option
  function sortByFilter(urlFilters: string[], filterData: FilterData) {
    const option = (document.getElementById("sort-by-select") as HTMLInputElement).value;

    // for now while popularity and item release dates don't exist
    if (option !== "price-low-to-high" && option !== "price-high-to-low") return;

    const index = sortByOptions.findIndex((x) => x.toLowerCase().replace(/\s/g, "-") === option);
    filterData.sortBy = index === -1 ? 0 : index;

    switch (option) {
      case "price-low-to-high":
        urlFilters.push("$sort=price:1");
        break;
      case "price-high-to-low":
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
    const checkedCategories = document
      .getElementById("categories-container")
      ?.querySelectorAll("input.category-checkbox:checked") as NodeListOf<HTMLInputElement>;
    if (checkedCategories.length === 0) return;

    let categoryFilters: string[] = [];
    let subcategoryFilters: string[] = [];
    for (let i = 0; i < checkedCategories.length; i++) {
      const checkedSubcategories = Array.from(
        document
          .getElementById(`${checkedCategories[i].name.toLowerCase()}-subcategories-container`)!
          .querySelectorAll("input.subcategory-checkbox:checked") as NodeListOf<HTMLInputElement>
      );
      // if there are subcategories checked and it matches the product or there are no subcategories checked and the category matches the product's
      if (checkedCategories[i].checked) {
        if (checkedSubcategories.length > 0) {
          for (let ii = 0; ii < checkedSubcategories.length; ii++) {
            subcategoryFilters.push(checkedSubcategories[ii].name);
            filterData.categories[i].sub.push(ii);
          }
        } else {
          categoryFilters.push(checkedCategories[i].name);
          filterData.categories[i].main = true;
        }
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
    const checkedSizes = document.getElementById("sizes-container")!.querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>;
    if (checkedSizes.length === 0) return;

    let sizeFilters: string[] = [];
    for (let i = 0; i < checkedSizes.length; i++) {
      sizeFilters.push(checkedSizes[i].name);
      filterData.sizes.push(i);
    }
    urlFilters.push(`sizes=${sizeFilters.join()}`);
  }

  // filters products based on the selected materials. shoes products that have either material
  function materialFilter(urlFilters: string[], filterData: FilterData) {
    const checkedMaterials = document
      .getElementById("materials-container")!
      .querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>;
    if (checkedMaterials.length === 0) return;

    let materialFilters: string[] = [];
    for (let i = 0; i < checkedMaterials.length; i++) {
      materialFilters.push(checkedMaterials[i].name);
      filterData.materials.push(i);
    }
    urlFilters.push(`material=${materialFilters.join()}`);
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

  // moves the price range handles. need to figure out why the bar width doesn't snap
  function movePriceHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!priceHandleInfo.isMoving) return;

    const handle = document.getElementById(`${priceHandleInfo.handle}-price-handle-container`) as HTMLElement;
    const barBounds = (document.getElementsByClassName("price-range-slider-container")[0] as HTMLElement).getBoundingClientRect();

    const handleBounds = handle.getBoundingClientRect();
    if (priceHandleInfo.handle === "low") {
      const highPriceHandleBounds = (document.getElementById("high-price-handle-container") as HTMLElement).getBoundingClientRect();
      const lowBar = document.getElementsByClassName("price-range-bar-low")[0] as HTMLElement;

      const value = clamp(
        -handleBounds.width / 2,
        highPriceHandleBounds.left - barBounds.left,
        e.clientX - barBounds.left - priceHandleInfo.offset!
      );

      handle.style.left = value + "px";
      lowBar.style.right = barBounds.width - value - handleBounds.width / 2 + "px";
    } else {
      const lowPriceHandleBounds = (document.getElementById("low-price-handle-container") as HTMLElement).getBoundingClientRect();
      const highBar = document.getElementsByClassName("price-range-bar-high")[0] as HTMLElement;

      const value = clamp(
        lowPriceHandleBounds.left - barBounds.left,
        barBounds.width - handleBounds.width / 2,
        e.clientX - barBounds.left - priceHandleInfo.offset!
      );

      handle.style.left = value + "px";
      highBar.style.left = handleBounds.left + handleBounds.width / 2 - barBounds.left + "px";
    }

    const priceText = document.getElementsByClassName(`${priceHandleInfo.handle}-price-text`)[0];
    const percentage = (handleBounds.left - barBounds.left + handleBounds.width / 2) / barBounds.width;
    priceText.innerHTML = "$" + Math.round(lerp(priceRange.low, priceRange.high, percentage));
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

  // toggles the visibility of an element and adds a class to the specified icon for state changing purposes
  function toggleVisibility(childContainerId: string, iconId: string) {
    const element = document.getElementById(childContainerId);

    if (!element) return;

    let display = "none";
    if (window.getComputedStyle(element as HTMLElement).display === "none") {
      display = element.classList[element.classList.length - 1];
      (document.getElementById(iconId) as HTMLElement).classList.remove("closed");
    } else {
      (document.getElementById(iconId) as HTMLElement).classList.add("closed");
    }

    element.style.display = display;
  }

  return (
    <div className="filter">
      <form className="filter-container search-container">
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
      <div className="filter-container">
        <p className="sort-by-text filter-text">Sort By</p>
        <select name="" id="sort-by-select">
          {sortByOptions.map((option, index) => (
            <option value={option.toLowerCase().replace(/\s/g, "-")} key={index}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-container">
        <div className="title-container">
          <p className="category-text filter-text">Category</p>
          <TiArrowSortedDown
            id="category-visibility-icon"
            className="visibility-icon closed"
            onClick={() => toggleVisibility(`categories-container`, `category-visibility-icon`)}
          />
        </div>
        <div id="categories-container" className="flex">
          {getEnumValues(CategoryType).map((category, index) => (
            <div className="category-container" key={index}>
              <div className="category-checkbox-container">
                <input id={`${category.toLowerCase()}-category-checkbox`} className="category-checkbox" name={category} type="checkbox" />
                <label htmlFor={`${category.toLowerCase()}-category-checkbox`} className="checkbox-label">
                  {category.replace(/(?<=[a-z])(?=[A-Z])/g, " ").replace("TS", "T-S")}
                </label>
                <TiArrowSortedDown
                  id={`${category.toLowerCase()}-visibility-icon`}
                  className="visibility-icon closed"
                  onClick={() =>
                    toggleVisibility(`${category.toLowerCase()}-subcategories-container`, `${category.toLowerCase()}-visibility-icon`)
                  }
                />
              </div>
              <div id={`${category.toLowerCase()}-subcategories-container`} className="subcategories-container flex">
                {getEnumValues(Categories.find((x) => x.main === category)?.sub).map((subcategory, index) => (
                  <div className="subcategory-checkbox-container" key={index}>
                    <input
                      id={`${subcategory.toLowerCase()}-subcategory-checkbox`}
                      className="subcategory-checkbox"
                      name={subcategory}
                      type="checkbox"
                    />
                    <label htmlFor={`${subcategory.toLowerCase()}-category-checkbox`} className="checkbox-label">
                      {subcategory.replace(/(?<=[a-z])(?=[A-Z])/g, " ").replace("TS", "T-S")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="filter-container">
        <div className="title-container">
          <p className="size-text filter-text">Size</p>
          <TiArrowSortedDown
            id="sizes-visibility-icon"
            className="visibility-icon closed"
            onClick={() => toggleVisibility(`sizes-container`, `sizes-visibility-icon`)}
          />
        </div>
        <div id="sizes-container" className="checkboxes-container grid">
          {getEnumValues(Size).map((size, index) => (
            <div className="size-container" key={index}>
              <input type="checkbox" name={size} id={`${size.toLowerCase()}-size-checkbox`} className="checkbox" />
              <label htmlFor={`${size.toLowerCase()}-size-checkbox`} className="checkbox-label">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="filter-container">
        <div className="title-container">
          <p className="material-text filter-text">Material</p>
          <TiArrowSortedDown
            id="materials-visibility-icon"
            className="visibility-icon closed"
            onClick={() => toggleVisibility(`materials-container`, `materials-visibility-icon`)}
          />
        </div>
        <div id="materials-container" className="checkboxes-container grid">
          {getEnumValues(Material).map((material, index) => (
            <div className="material-container" key={index}>
              <input type="checkbox" name={material} id={`${material.toLowerCase()}-material-checkbox`} className="checkbox" />
              <label htmlFor={`${material.toLowerCase()}-material-checkbox`} className="checkbox-label">
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div
        className="filter-container"
        onMouseUp={() => {
          setPriceHandleInfo({ isMoving: false });
        }}
        onMouseLeave={() => {
          setPriceHandleInfo({ isMoving: false });
        }}
        onMouseMove={(e) => movePriceHandle(e)}
      >
        <p className="price-range-text">Price Range</p>
        <div className="price-range-slider-container">
          <div className="price-range-bar-container">
            <div className="price-range-bar-low"></div>
            <div className="price-range-bar-high"></div>
            <div className="price-range-bar"></div>
          </div>
          <div className="price-ranges-container">
            <p className="low-price-text price-text">Low</p>
            <p className="high-price-text price-text">High</p>
          </div>
          <div
            id="low-price-handle-container"
            onMouseDown={(e) =>
              setPriceHandleInfo({ handle: "low", offset: e.clientX - e.currentTarget.getBoundingClientRect().left, isMoving: true })
            }
          >
            <TiArrowSortedUp id="low-price-handle" className="price-handle" />
          </div>
          <div
            id="high-price-handle-container"
            onMouseDown={(e) =>
              setPriceHandleInfo({ handle: "high", offset: e.clientX - e.currentTarget.getBoundingClientRect().left, isMoving: true })
            }
          >
            <TiArrowSortedDown id="high-price-handle" className="price-handle" />
          </div>
        </div>
      </div>
      <div className="btn-container">
        <button className="apply-filters-btn filter-btn" onClick={() => filterProducts()}>
          Apply Filters
        </button>
        <button
          className="clear-filters-btn filter-btn"
          onClick={() => {
            resetFilters();
            filterProducts();
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
