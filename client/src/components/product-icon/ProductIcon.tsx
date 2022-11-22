import { Link } from "react-router-dom";

import { getKebabStyledString } from "../../helper/Helper";
import { Product } from "../types/product";
import "./styles/ProductIcon.css";

/* to do:
 - save the filter state when opening the product page then reapply it if the user goes back to the previous page
*/
export default function ProductIcon({ product }: { product: Product }) {
  return (
    <Link to={"/clothing/" + getKebabStyledString(product.title)} state={product} className="product-icon">
      <img src={product.imageCardUrl} alt="" className="product-image" />
      <div className="product-details">
        <p className="name-text">{product.title}</p>
        <p className="price-text">${product.price}</p>
      </div>
    </Link>
  );
}
