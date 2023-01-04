import { Link } from "react-router-dom";
import { toTitleCase } from "../../helper/String";

import { Product } from "../types/product";
import "./styles/ProductCard.css";

/* to do:
 - save the filter state when opening the product page then reapply it if the user goes back to the previous page
*/

const meshGradientBackgrounds = ["326", "975", "538", "620", "388", "387", "556", "145", "974", "385", "385-1", "25", "428", "523", "806"];

export default function ProductCard({ product }: { product: Product }) {
  const meshGradientIndex = Math.round(Math.random() * (meshGradientBackgrounds.length - 1));

  return (
    <Link to={"/products/" + product._id} state={product} className="product-card">
      <img className="background" src={`./images/gradients/mesh-${meshGradientBackgrounds[meshGradientIndex]}.png`} />
      <img src={product.imageCardUrl} alt="" className="product-image" />
      <div className="product-details">
        <p className="name-text">{toTitleCase(product.title)}</p>
        <p className="price-text">${product.price}</p>
      </div>
    </Link>
  );
}
