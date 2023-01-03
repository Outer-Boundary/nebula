import { useState, useEffect } from "react";

import "./styles/Section.css";
import { SectionType } from "../types/SectionType";
import Filter from "./filter/Filter";
import { Product } from "../types/product";
import ProductIcon from "../product-card/ProductCard";

// need this to refresh when clicking on different sections so that the filters reset
export default function Section({ section }: { section: SectionType }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  return (
    <div className="section">
      <Filter section={section} products={products} setProducts={setProducts} setIsLoading={setIsLoading} />
      <div className="products-container">
        {isLoading || !products
          ? [...Array(20)].map((x, index) => <div className="product-suspense-icon" key={index}></div>)
          : products.map((product, index) => <ProductIcon product={product} key={index} />)}
      </div>
    </div>
  );
}
