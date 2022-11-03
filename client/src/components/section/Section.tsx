import { useState, useEffect } from "react";

import "./styles/Section.css";
import { testProducts } from "./TestClothing";
import ProductIcon from "../product-icon/ProductIcon";
import IProduct from "../types/IProduct";
import { SectionType } from "../types/SectionType";
import Filter from "./filter/Filter";

// need this to refresh when clicking on different sections so that the filters reset
export default function Section({ section }: { section: SectionType }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  // gets the products from the selected section
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5000/products/upload-to-database", {
        method: "POST",
      });
      console.log(response.body);
    })();

    let newProducts = [...testProducts];
    newProducts = newProducts.filter(
      (x) => x.section === section || section === SectionType.All || (section === SectionType.Sale && x.onSale)
    );
    setProducts(newProducts);
    setFilteredProducts(newProducts);
  }, [section]);

  return (
    <div className="section">
      <Filter section={section} products={products} setFilteredProducts={setFilteredProducts} />
      <div className="products-container">
        {filteredProducts.map((product, index) => (
          <ProductIcon product={product} key={index} />
        ))}
      </div>
    </div>
  );
}
