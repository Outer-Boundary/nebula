import ProductIcon from "../product-icon/ProductIcon";
import { SectionType } from "../types/SectionType";
import "./styles/Section.css";
import { testProducts } from "./TestClothing";

export default function Section({ section }: { section: SectionType }) {
  return (
    <div className="section">
      <div className="filter-container">
        <div className="filter category-container">
          <p className="category-text">Category</p>
        </div>
        <div className="filter size-container">
          <p className="size-text">Size</p>
        </div>
        <div className="filter material-container">
          <p className="material-text">Material</p>
        </div>
        <div className="filter sort-by-container">
          <p className="sort-by-text">Sort By</p>
        </div>
        <div className="filter price-range-container">
          <p className="price-range-text">Price Range</p>
        </div>
      </div>
      <div className="products-container">
        {testProducts.map((product, index) => (
          <ProductIcon product={product} key={index} />
        ))}
      </div>
    </div>
  );
}
