import { useState, useEffect } from "react";

import "./styles/Section.css";
import { testProducts } from "./TestClothing";
import ProductIcon from "../product-icon/ProductIcon";
import IProduct from "../types/IProduct";
// import { SectionType } from "../types/CategoryTypes";
import Filter from "./filter/Filter";

// need this to refresh when clicking on different sections so that the filters reset
export default function Section(/*{ section }: { section: SectionType }*/) {
  const [products, setProducts] = useState<IProduct[]>(testProducts);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  // gets the products from the selected section
  // useEffect(() => {
  //   let newProducts = [...testProducts];
  //   newProducts = newProducts.filter(
  //     (x) => x.section === section || section === SectionType.All || (section === SectionType.Sale && x.onSale)
  //   );
  //   setProducts(newProducts);
  //   setFilteredProducts(newProducts);
  // }, [section]);

  return (
    <div className="section">
      <Filter products={products} setFilteredProducts={setFilteredProducts} />
      <div className="products-container">
        {products.map((product, index) => (
          <ProductIcon product={product} key={index} />
        ))}
      </div>
    </div>
  );
}
