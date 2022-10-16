import { useState } from "react";
import { useSelector } from "react-redux";

import { StateType } from "../../redux/reducers";
import Size from "../types/Size";
import "./styles/ProductPage.css";

export default function ProductPage() {
  const product = useSelector((state: StateType) => state.currentProduct);
  const [curImageIndex, setCurImageIndex] = useState<number>(0);
  const [size, setSize] = useState<Size | null>(null);

  return (
    <div className="product-page">
      <div id="image-cards-container">
        {product?.imageUrls.map((url, index) => (
          <img
            className={`image-card ${curImageIndex === index && "selected"}`}
            src={url}
            alt=""
            key={index}
            onClick={() => setCurImageIndex(index)}
          />
        ))}
      </div>
      <img className="product-image" src={product?.imageUrls[curImageIndex]} alt="" />
      <div className="right-container">
        <p className="name-text">{product?.name}</p>
        <p className="price-text">${product?.price}</p>
        <div className="divider"></div>
        <p className="colours-text">Colours</p>
        <div className="colours-container container"></div>
        <p className="sizes-text">Sizes</p>
        <div className="sizes-container container">
          {product?.sizes.map((sizeInfo, index) => (
            <button className={`size-btn ${size === sizeInfo.size && "selected"}`} key={index} onClick={() => setSize(sizeInfo.size)}>
              {sizeInfo.size}
            </button>
          ))}
        </div>
        <button className="add-to-cart-btn">Add To Cart</button>
        <details className="product-details">
          <summary className="details-text">Details</summary>
          <p>Material: {product?.material}</p>
        </details>
      </div>
    </div>
  );
}
