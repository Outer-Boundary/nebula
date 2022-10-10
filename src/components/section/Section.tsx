import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

import "./styles/Section.css";
import { testProducts } from "./TestClothing";
import ProductIcon from "../product-icon/ProductIcon";
import IProduct from "../types/IProduct";
import { SectionType } from "../types/SectionType";
import Size from "../types/Size";
import { getEnumValues } from "../../helper/Helper";
import Material from "../types/Material";

// need this to refresh when clicking on different sections so that the filters reset
export default function Section({ section }: { section: SectionType }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  // gets the products from the selected section
  useEffect(() => {
    let newProducts = [...testProducts];
    newProducts = newProducts.filter(
      (x) => x.section === section || section === SectionType.All || (section === SectionType.Sale && x.onSale)
    );
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    resetFilters();
  }, [section]);

  // goes through each filter then sets the products being viewed
  function filterProducts() {
    const newFilteredProducts = [...products];
    searchFilter(newFilteredProducts);
    sortByFilter(newFilteredProducts);
    sizeFilter(newFilteredProducts);
    materialFilter(newFilteredProducts);
    setFilteredProducts(newFilteredProducts);
  }

  // filters the products based on the search string and the product names. can use a hyphen to negate a search
  function searchFilter(products: IProduct[]) {
    const searchString = (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value;
    if (searchString.replace(/\s/g, "") === "") {
      setFilteredProducts(products);
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

  // resets filters to their default state (when switching sections)
  function resetFilters() {
    // reset search filter
    (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value = "";

    // reset sort by to its first
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
  }

  return (
    <div className="section">
      <div className="filters-container">
        <form className="filter search-container">
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
        <div className="filter">
          <p className="sort-by-text">Sort By</p>
          <select name="" id="sort-by-select" onChange={() => filterProducts()}>
            <option value="most-popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low-high">Price Low to High</option>
            <option value="price-high-low">Price High to Low</option>
          </select>
        </div>
        <div className="filter category-container">
          <p className="category-text">Category</p>
        </div>
        <div className="filter">
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
        <div className="filter">
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
        <div className="filter">
          <p className="price-range-text">Price Range</p>
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
      <div className="products-container">
        {filteredProducts.map((product, index) => (
          <ProductIcon product={product} key={index} />
        ))}
      </div>
    </div>
  );
}
