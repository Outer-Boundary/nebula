import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRandomValueBetween } from "../../helper/Helper";
import { toTitleCase } from "../../helper/String";

import { Product } from "../types/product";
import "./styles/ProductCard.css";

/* to do:
 - save the filter state when opening the product page then reapply it if the user goes back to the previous page
*/

// const meshGradientBackgrounds = ["326", "975", "538", "620", "388", "387", "556", "145", "974", "385", "385-1", "25", "428", "523", "806"];
const meshGradientColours = ["rgb(216, 82, 253)", "rgb(124, 174, 244)", "rgb(151, 82, 248)"];

export default function ProductCard({ product }: { product: Product }) {
  // const meshGradientIndex = Math.round(Math.random() * (meshGradientBackgrounds.length - 1));
  const [background, setBackground] = useState("");

  useEffect(() => getGradientBackground(), []);

  function getGradientBackground() {
    const numGradients = getRandomValueBetween(2, 3);
    let backgrounds: string[] = [];
    for (let i = 0; i < numGradients; i++) {
      const shape = Math.random() <= 0.5 ? "circle" : "ellipse";

      const posX = getRandomValueBetween(0, 100);
      const posY = getRandomValueBetween(0, 100);

      const spread = getRandomValueBetween(25, 50);

      const colour = meshGradientColours[getRandomValueBetween(0, meshGradientColours.length - 1)];

      backgrounds.push(`radial-gradient(${shape} at ${posX}% ${posY}%, ${colour}, transparent ${spread}%)`);
    }
    setBackground(backgrounds.join(","));
  }

  return (
    <Link to={"/products/" + product._id} state={product} className="product-card">
      <div className="background" style={{ background: background }} />
      <img src={product.imageCardUrl} alt="" className="product-image" />
      <div className="product-details">
        <p className="name-text">{toTitleCase(product.title)}</p>
        <p className="price-text">${product.price}</p>
      </div>
    </Link>
  );
}
