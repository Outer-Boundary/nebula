import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Colour } from "../types/Colour";
import { Product } from "../types/product";

import Size from "../types/Size";
import "./styles/ProductPage.css";

export default function ProductPage() {
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(location.state);

  const [curImageIndex, setCurImageIndex] = useState<number>(0);
  const [curSize, setSize] = useState<Size | null>(null);
  const [curColourIndex, setColourIndex] = useState<number>(0);

  const { id } = useParams();

  useEffect(() => {
    if (!product) {
      (async () => {
        const response = await fetch(`http://localhost:5000/products/${id}`);
        const newProduct: Product = await response.json();
        setProduct(newProduct);
      })();
    }
  }, []);

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
        <p className="name-text">{product?.title}</p>
        <p className="price-text">${product?.price}</p>
        <div className="divider"></div>
        <p className="colours-text">Colours</p>
        <div className="colours-container container">
          {product?.colours.map((colour, index) => (
            <div
              className={`colour ${curColourIndex === index && "selected"}`}
              style={{ backgroundColor: Colour[colour as keyof typeof Colour] ?? "" }}
              key={index}
              onClick={() => setColourIndex(index)}
            ></div>
          ))}
        </div>
        <p className="sizes-text">Sizes</p>
        <div className="sizes-container container">
          {product?.sizes.map((size, index) => (
            <button
              className={`size-btn ${curSize === size && "selected"}`}
              key={index}
              onClick={() => setSize(Size[size as keyof typeof Size])}
            >
              {size}
            </button>
          ))}
        </div>
        <button className="add-to-cart-btn">Add To Cart</button>
        <details className="product-details">
          <summary className="details-text">Details</summary>
          <p>Material - {product?.material}</p>
        </details>
        <details className="product-description">
          <summary className="description-text">Description</summary>
          <p>{product?.description}</p>
        </details>
      </div>
    </div>
  );
}
