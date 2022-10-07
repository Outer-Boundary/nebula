import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

import "./styles/Section.css";
import { testProducts } from "./TestClothing";
import ProductIcon from "../product-icon/ProductIcon";
import IProduct from "../types/IProduct";
import { SectionType } from "../types/SectionType";

export default function Section({ section }: { section: SectionType }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    let newProducts = [...testProducts];
    newProducts = newProducts.filter(
      (x) => x.section === section || section === SectionType.All || (section === SectionType.Sale && x.onSale)
    );
    setProducts(newProducts);
    setFilteredProducts(newProducts);
  }, [section]);

  function filterResults() {
    const searchFilters = (document.getElementsByClassName("search-input")[0] as HTMLInputElement).value
      .toLowerCase()
      .replace(/[\W_]/g, "")
      .split(" ");

    const newFilteredProducts: IProduct[] = [];
    for (const product of products) {
      const matches = searchFilters.every((filter) => product.name.toLowerCase().includes(filter));
      if (matches) newFilteredProducts.push(product);
    }

    setFilteredProducts(newFilteredProducts);
  }

  return (
    <div className="section">
      <div className="filter-container">
        <form className="filter search-container">
          <input type="text" className="search-input" />
          <button
            type="submit"
            className="search-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              filterResults();
            }}
          >
            <FiSearch className="search-icon" />
          </button>
        </form>
        <div className="filter sort-by-container">
          <p className="sort-by-text">Sort By</p>
        </div>
        <div className="filter category-container">
          <p className="category-text">Category</p>
        </div>
        <div className="filter size-container">
          <p className="size-text">Size</p>
        </div>
        <div className="filter material-container">
          <p className="material-text">Material</p>
        </div>

        <div className="filter price-range-container">
          <p className="price-range-text">Price Range</p>
        </div>
      </div>
      <div className="products-container">
        {filteredProducts.map((product, index) => (
          <ProductIcon product={product} key={index} />
        ))}
      </div>
    </div>
  );
}
