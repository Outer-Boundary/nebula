import { useState, useEffect } from "react";

import "./styles/Section.css";
import { SectionType } from "../types/SectionType";
import Filter from "./filter/Filter";
import { Product } from "../types/product";
import ProductIcon from "../product-icon/ProductIcon";

// need this to refresh when clicking on different sections so that the filters reset
export default function Section({ section }: { section: SectionType }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // gets the products from the selected section
  useEffect(() => {
    let newProducts: Product[] = [];
    (async () => {
      const response = await fetch("http://localhost:5000/products?$limit=40");
      newProducts = await response.json();

      setProducts(newProducts);
    })();
  }, [section]);

  return (
    <div className="section">
      <Filter section={section} products={products} setProducts={setProducts} setIsLoading={setIsLoading} />
      <div className="products-container">
        {!isLoading
          ? products.map((product, index) => <ProductIcon product={product} key={index} />)
          : [...Array(20)].map((x) => <div className="product-suspense-icon"></div>)}
      </div>
    </div>
  );
}
