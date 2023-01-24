import { useState, useEffect } from "react";

import "./styles/Section.css";
import { SectionType } from "../types/SectionType";
import Filter from "./filter/Filter";
import { Product } from "../types/product";
import ProductIcon from "../product-card/ProductCard";
import { getRandomWholeValueBetween } from "../../helper/Helper";

const backgrounds = [
  "radial-gradient(circle at 0% 75%, rgb(3, 2, 80), rgb(20, 0, 186), rgb(201, 7, 103), rgb(234, 85, 87) 85%)",
  "radial-gradient(circle at 75% 20%, rgb(20, 0, 186) 15%, rgb(201, 7, 103), rgb(234, 85, 87) 85%)",
  "radial-gradient(circle at 65% 57.5%, rgb(3, 2, 80), rgb(20, 0, 186), rgb(137, 57, 172) 50%, rgb(201, 7, 103))",
  "radial-gradient(circle at 0% 0%, rgb(255, 203, 99), transparent 75%), radial-gradient(circle at 100% 35%, rgb(201, 7, 103), rgb(234, 85, 87), transparent), radial-gradient(circle at 50% 100%, rgb(137, 57, 172), rgb(201, 7, 103), rgb(234, 85, 87))",
  "radial-gradient(circle at 100% 75%, rgb(201, 7, 103), rgb(234, 85, 87), rgb(255, 203, 99))",
  "radial-gradient(circle at 100% 100%, rgb(3, 2, 80), rgb(20, 0, 186), transparent 35%), radial-gradient(circle at 15% 75%, rgb(3, 2, 80), rgb(20, 0, 186), rgb(137, 57, 172) 90%)",
];

// need this to refresh when clicking on different sections so that the filters reset
export default function Section({ section }: { section: SectionType }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shapes, setShapes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  useEffect(getBackgroundShapes, []);

  function getBackgroundShapes() {
    const numShapes = getRandomWholeValueBetween(3, 6);

    const newShapes: JSX.Element[] = [];
    for (let i = 0; i < numShapes; i++) {
      const background = backgrounds[getRandomWholeValueBetween(0, backgrounds.length - 1)];
      const size = getRandomWholeValueBetween(10, 75);
      const posX = getRandomWholeValueBetween(-size * 1.5, 90);
      const posY = getRandomWholeValueBetween(-size * 1.5, 90);

      newShapes.push(
        <div
          className="section-background-shape"
          style={{ background: background, width: size + "rem", height: size + "rem", left: posX + "%", top: posY + "%" }}
        ></div>
      );
    }
    setShapes(newShapes);
  }

  // radial-gradient(circle at 0% 75%, rgb(3, 2, 80), rgb(20, 0, 186), rgb(201, 7, 103), rgb(234, 85, 87) 85%)

  return (
    <div className="section">
      {/* <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blob-gradient" x1="0" x2="1" y1="1" y2="0">
            <stop id="stop1" stop-color="rgb(20, 0, 186)" offset="0%"></stop>
            <stop id="stop2" stop-color="rgb(234, 85, 87)" offset="100%"></stop>
          </linearGradient>
        </defs>
        <path
          fill="url(#blob-gradient)"
          d="M35.1,-64C38.1,-52.7,28,-30.4,29.2,-16.6C30.4,-2.8,42.9,2.6,45.4,8.7C47.9,14.7,40.2,21.5,35.5,35.7C30.8,49.9,29.1,71.5,21.2,75.1C13.3,78.8,-0.7,64.5,-17,59.1C-33.2,53.7,-51.7,57.3,-63.3,50.9C-74.9,44.6,-79.6,28.4,-69.3,17.5C-59.1,6.7,-33.9,1.4,-27.2,-12C-20.5,-25.4,-32.1,-46.8,-30.7,-58.8C-29.2,-70.7,-14.6,-73.3,0.7,-74.4C16.1,-75.6,32.1,-75.3,35.1,-64Z"
          transform="translate(100 100)"
        />
      </svg> */}
      {shapes.map((element) => element)}
      <Filter section={section} products={products} setProducts={setProducts} setIsLoading={setIsLoading} />
      <div className="products-container">
        {isLoading || !products
          ? [...Array(20)].map((x, index) => <div className="product-suspense-icon" key={index}></div>)
          : products.map((product, index) => <ProductIcon product={product} key={index} />)}
      </div>
    </div>
  );
}
