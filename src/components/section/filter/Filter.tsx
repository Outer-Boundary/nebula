import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TiArrowSortedDown } from "react-icons/ti";

import { clamp, getEnumValues, lerp } from "../../../helper/Helper";
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
  }, [props.products]);

  // goes through each filter then sets the products being viewed
  function filterProducts() {
    const newFilteredProducts = [...props.products];
    searchFilter(newFilteredProducts);
    sortByFilter(newFilteredProducts);
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

    const handle = document.getElementById(`${priceHandleInfo.handle}-price-handle`) as HTMLElement;
    const barBounds = (document.getElementsByClassName("price-range-slider-container")[0] as HTMLElement).getBoundingClientRect();

    const bar = document.getElementsByClassName("price-range-bar")[0] as HTMLElement;
    const handleBounds = handle.getBoundingClientRect();
    if (priceHandleInfo.handle === "low") {
      const highPriceHandleBounds = (document.getElementById("high-price-handle") as HTMLElement).getBoundingClientRect();
      const value = clamp(
        -handleBounds.width / 2,
        highPriceHandleBounds.left - barBounds.left,
        e.clientX - barBounds.left - priceHandleInfo.offset!
      );
      handle.style.left = value + "px";
      bar.style.left = value + handleBounds.width / 2 + "px";
      bar.style.width = highPriceHandleBounds.left - handleBounds.left + "px";
    } else {
      const lowPriceHandleBounds = (document.getElementById("low-price-handle") as HTMLElement).getBoundingClientRect();
      const value = clamp(
        lowPriceHandleBounds.left - barBounds.left,
        barBounds.width - handleBounds.width / 2,
        e.clientX - barBounds.left - priceHandleInfo.offset!
      );
      handle.style.left = value + "px";
      bar.style.width = handleBounds.left - lowPriceHandleBounds.left + "px";
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
    const lowPriceHandle = document.getElementById("low-price-handle") as HTMLElement;
    const highPriceHandle = document.getElementById("high-price-handle") as HTMLElement;
    const barBounds = (document.getElementsByClassName("price-range-slider-container")[0] as HTMLElement).getBoundingClientRect();
    lowPriceHandle.style.left = 0 - lowPriceHandle.getBoundingClientRect().width / 2 + "px";
    highPriceHandle.style.left = barBounds.width - highPriceHandle.getBoundingClientRect().width / 2 + "px";

    const lowPriceText = document.getElementsByClassName("low-price-text")[0];
    const highPriceText = document.getElementsByClassName("high-price-text")[0];
    lowPriceText.innerHTML = "$" + lowPrice;
    highPriceText.innerHTML = "$" + highPrice;

    const bar = document.getElementsByClassName("price-range-bar")[0] as HTMLElement;
    bar.style.left = "0";
    bar.style.width = "100%";
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
        <p className="sort-by-text">Sort By</p>
        <select name="" id="sort-by-select" onChange={() => filterProducts()}>
          <option value="most-popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low-high">Price Low to High</option>
          <option value="price-high-low">Price High to Low</option>
        </select>
      </div>
      <div className="filter-container category-container">
        <p className="category-text">Category</p>
      </div>
      <div className="filter-container">
        <p className="size-text">Size</p>
        <div id="sizes-container" className="checkboxes-container">
          {getEnumValues(Size).map((size, index) => (
            <div className="size-container" key={index}>
              <label htmlFor={`${size.toLowerCase()}-size-checkbox`} className="checkbox-label">
                {size}
              </label>
              <input
                type="checkbox"
                name={size}
                id={`${size.toLowerCase()}-size-checkbox`}
                className="checkbox"
                onChange={() => filterProducts()}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="filter-container">
        <p className="material-text">Material</p>
        <div id="materials-container" className="checkboxes-container">
          {getEnumValues(Material).map((material, index) => (
            <div className="material-container" key={index}>
              <label htmlFor={`${material.toLowerCase()}-material-checkbox`} className="checkbox-label">
                {material}
              </label>
              <input
                type="checkbox"
                name={material}
                id={`${material.toLowerCase()}-material-checkbox`}
                className="checkbox"
                onChange={() => filterProducts()}
              />
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
            <div className="price-range-bar-background"></div>
            <div className="price-range-bar"></div>
          </div>
          <div className="price-ranges-container">
            <p className="low-price-text price-text">Low</p>
            <p className="high-price-text price-text">High</p>
          </div>
          <TiArrowSortedDown
            id="low-price-handle"
            className="price-handle"
            onMouseDown={(e) =>
              setPriceHandleInfo({ handle: "low", offset: e.clientX - e.currentTarget.getBoundingClientRect().left, isMoving: true })
            }
          ></TiArrowSortedDown>
          <TiArrowSortedDown
            id="high-price-handle"
            className="price-handle"
            onMouseDown={(e) =>
              setPriceHandleInfo({ handle: "high", offset: e.clientX - e.currentTarget.getBoundingClientRect().left, isMoving: true })
            }
          ></TiArrowSortedDown>
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
