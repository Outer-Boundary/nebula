import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backgroundColours, getGradientBackground, getRandomValueBetween, getRandomWholeValueBetween } from "../../helper/Helper";
import { toTitleCase } from "../../helper/String";

import { Product } from "../types/product";
import "./styles/ProductCard.css";

const backgrounds = [
  "radial-gradient(circle at 0% 75%, rgb(3, 2, 80), rgb(20, 0, 186), rgb(201, 7, 103), rgb(234, 85, 87) 85%)",
  "radial-gradient(circle at 75% 20%, rgb(20, 0, 186) 15%, rgb(201, 7, 103), rgb(234, 85, 87) 85%)",
  "radial-gradient(circle at 65% 57.5%, rgb(3, 2, 80), rgb(20, 0, 186), rgb(137, 57, 172) 50%, rgb(201, 7, 103))",
  "radial-gradient(circle at 0% 0%, rgb(255, 203, 99), transparent 75%), radial-gradient(circle at 100% 35%, rgb(201, 7, 103), rgb(234, 85, 87), transparent), radial-gradient(circle at 50% 100%, rgb(137, 57, 172), rgb(201, 7, 103), rgb(234, 85, 87))",
  "radial-gradient(circle at 100% 75%, rgb(201, 7, 103), rgb(234, 85, 87), rgb(255, 203, 99))",
  "radial-gradient(circle at 100% 100%, rgb(3, 2, 80), rgb(20, 0, 186), transparent 35%), radial-gradient(circle at 15% 75%, rgb(3, 2, 80), rgb(20, 0, 186), rgb(137, 57, 172) 90%)",
];

export default function ProductCard({ product }: { product: Product }) {
  const [shapes, setShapes] = useState<JSX.Element[]>([]);

  useEffect(getBackgroundShapes, []);

  function getBackgroundShapes() {
    const numShapes = getRandomWholeValueBetween(1, 2);

    const newShapes: JSX.Element[] = [];
    for (let i = 0; i < numShapes; i++) {
      const background = backgrounds[getRandomWholeValueBetween(0, backgrounds.length - 1)];
      const size = getRandomWholeValueBetween(10, 20);
      const posX = getRandomWholeValueBetween(-size * 1.5, 90);
      const posY = getRandomWholeValueBetween(-size * 1.5, 90);

      newShapes.push(
        <div
          className="product-card-background-shape"
          style={{ background: background, width: size + "rem", height: size + "rem", left: posX + "%", top: posY + "%" }}
        ></div>
      );
    }
    setShapes(newShapes);
  }

  return (
    <Link
      to={"/products/" + product._id}
      state={product}
      className="product-card"
      // style={{ background: background[getRandomWholeValueBetween(0, background.length - 1)] }}
    >
      {shapes.map((element, index) => element)}
      <img src={product.imageCardUrl} alt="" className="product-image" />
      <div className="product-details">
        <p className="name-text">{toTitleCase(product.title)}</p>
        <p className="price-text">${product.price}</p>
      </div>
    </Link>
  );
}
