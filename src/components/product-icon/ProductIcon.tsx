import IProduct from "../types/IProduct";
import "./styles/ProductIcon.css";

export default function ProductIcon({ product }: { product: IProduct }) {
  return (
    <div className="product-icon">
      <img src={product.image} alt="" className="product-image" />
      <div className="product-details">
        <p className="name-text">{product.name.replace("TS", "T-S")}</p>
        <p className="price-text">${product.price}</p>
      </div>
    </div>
  );
}
