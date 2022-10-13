import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import { clamp, getEnumValues, lerp } from "../../../helper/Helper";
import { BottomsSubcategory, Categories, Category, CategoryType, TopsSubcategory } from "../../types/Category";
import IProduct from "../../types/IProduct";
import Material from "../../types/Material";
import { SectionType } from "../../types/SectionType";
import Size from "../../types/Size";
import "./styles/Filter.css";

interface FilterProps {
  section: SectionType;
  products: IProduct[];
  setFilteredProducts: (products: IProduct[]) => void;
}

/* to do: 
- make it so the user can set the highest and lowest price in the range range filter by directly entering an amount
- give every filter a show hide button
- fix filters not being reset when going from section all to clothing or vice versa the first time either is clicked
*/
export default function Filter(props: FilterProps) {
  const [priceRange, setPriceRange] = useState({ low: 0, high: 0 });
  const [priceHandleInfo, setPriceHandleInfo] = useState<{ handle?: "low" | "high"; offset?: number; isMoving: boolean }>({
    isMoving: false,
  });

  useEffect(() => {
    const priceRange = getPriceRange();
    setPriceRange(priceRange);
    resetFilters();
    resetPriceRange(priceRange.low, priceRange.high);
  }, [props.products, props.section]);

  // goes through each filter then sets the products being viewed
  function filterProducts() {
    const newFilteredProducts = [...props.products];
    searchFilter(newFilteredProducts);
    sortByFilter(newFilteredProducts);
    categoryFilter(newFilteredProducts);
    sizeFilter(newFilteredProducts);
    materialFilter(newFilteredProducts);
    priceRangeFilter(newFilteredProducts);
    props.setFilteredProducts(newFilteredProducts);
  }

  // filters the products based on the search string and the product names. can use a hyphen to negate a search
  function searchFilter(products: IProduct[]) {
    const searchString = (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value;
    if (searchString.replace(/\s/g, "") === "") {
      props.setFilteredProducts(products);
      return;
    }

    const searchFilters = searchString.toLowerCase().replace(/\S\W_/g, "").split(" ");
    console.log(searchFilters);

    for (let i = 0; i < products.length; i++) {
      const productKeywords = products[i].name
        .toLowerCase()
        .replace(/\S\W_|-/g, "")
        .split(" ");

      for (const searchFilter of searchFilters) {
        const notIncludesKeyword =
          !searchFilter.startsWith("-") && productKeywords.every((keyword) => keyword !== searchFilter.replace(/-/g, ""));
        const includesNegatedKeyword =
          searchFilter.startsWith("-") && productKeywords.some((keyword) => keyword === searchFilter.replace(/-/g, ""));
        if ((notIncludesKeyword || includesNegatedKeyword) && searchFilter !== "") {
          products.splice(i, 1);
          i--;
          break;
        }
      }
    }
  }

  // sorts a filter based on the selected sorting option
  function sortByFilter(products: IProduct[]) {
    const option = (document.getElementById("sort-by-select") as HTMLInputElement).value;

    // for now while popularity and item release dates don't exist
    if (option !== "price-low-high" && option !== "price-high-low") return;

    switch (option) {
      case "price-low-high":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        // make sure each case matches the value in each option
        console.error("Invalid sorting option");
        break;
    }
  }

  function categoryFilter(products: IProduct[]) {
    const checkedCategories = document.getElementById("categories-container")?.querySelectorAll("input:checked");
  }

  // filters products based on the selected sizes. shoes products that have either size
  function sizeFilter(products: IProduct[]) {
    const checkedSizes = document.getElementById("sizes-container")!.querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>;
    if (checkedSizes.length === 0) return;

    for (let i = 0; i < products.length; i++) {
      let matchesOne = false;
      for (let ii = 0; ii < checkedSizes.length; ii++) {
        if (products[i].sizes.some((sizeInfo) => sizeInfo.size === checkedSizes[ii].name && sizeInfo.amount > 0)) {
          matchesOne = true;
          break;
        }
      }
      if (!matchesOne) {
        products.splice(i, 1);
        i--;
      }
    }
  }

  // filters products based on the selected materials. shoes products that have either material
  function materialFilter(products: IProduct[]) {
    const checkedMaterials = document
      .getElementById("materials-container")!
      .querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>;
    if (checkedMaterials.length === 0) return;

    for (let i = 0; i < products.length; i++) {
      let matchesOne = false;
      for (let ii = 0; ii < checkedMaterials.length; ii++) {
        if (products[i].material === checkedMaterials[ii].name) {
          matchesOne = true;
          break;
        }
      }
      if (!matchesOne) {
        products.splice(i, 1);
        i--;
      }
    }
  }

  // filters products by the specified price range
  function priceRangeFilter(products: IProduct[]) {
    const lowPrice = parseInt(document.getElementsByClassName("low-price-text")[0].innerHTML.replace(/\$/g, ""));
    const highPrice = parseInt(document.getElementsByClassName("high-price-text")[0].innerHTML.replace(/\$/g, ""));
    for (let i = 0; i < products.length; i++) {
      if (products[i].price < lowPrice || products[i].price > highPrice) {
        products.splice(i, 1);
        i--;
      }
    }
  }

  // gets the highest and lowest price of the products
  function getPriceRange(): { low: number; high: number } {
    let low = -1;
    let high = -1;
    for (const product of props.products) {
      if (product.price < low || low === -1) {
        low = product.price;
      } else if (product.price > high || high === -1) {
        high = product.price;
      }
    }
    return { low: low, high: high };
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

    // resets size checkboxes
    const checkedSizes = document.getElementById("sizes-container")!.querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>;
    checkedSizes.forEach((x) => (x.checked = false));

    // resets material checkboxes
    const checkedMaterials = document
      .getElementById("materials-container")!
      .querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>;
    checkedMaterials.forEach((x) => (x.checked = false));

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
        <select name="" id="sort-by-select" onChange={() => filterProducts()}>
          <option value="most-popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low-high">Price Low to High</option>
          <option value="price-high-low">Price High to Low</option>
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
                <input id={`${category.toLowerCase()}-category-checkbox`} type="checkbox" key={index} />
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
                {getEnumValues(Categories.find((x) => CategoryType[x.main].toString() === category)?.sub).map((subcategory, index) => (
                  <div className="subcategory-checkbox-container" key={index}>
                    <input id={`${subcategory.toLowerCase()}-category-checkbox`} type="checkbox" />
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
              <input
                type="checkbox"
                name={size}
                id={`${size.toLowerCase()}-size-checkbox`}
                className="checkbox"
                onChange={() => filterProducts()}
              />
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
              <input
                type="checkbox"
                name={material}
                id={`${material.toLowerCase()}-material-checkbox`}
                className="checkbox"
                onChange={() => filterProducts()}
              />
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
          filterProducts();
        }}
        onMouseLeave={() => {
          setPriceHandleInfo({ isMoving: false });
          filterProducts();
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
      <button
        className="clear-filters-btn"
        onClick={() => {
          resetFilters();
          filterProducts();
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
