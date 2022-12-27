import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getEnumValues } from "../../helper/Helper";
import { toTitleCase } from "../../helper/String";
import { Colour } from "../types/Colour";
import { Product } from "../types/product";

import Size from "../types/Size";
import "./styles/ProductPage.css";

export default function ProductPage() {
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(location.state);

  const [isLoading, setIsLoading] = useState(true);

  const [curImageIndex, setCurImageIndex] = useState<number>(0);
  const [curSize, setSize] = useState<Size | null>(null);
  const [curColourIndex, setColourIndex] = useState<number>(0);

  const { id } = useParams();

  useEffect(() => {
    if (product) setIsLoading(false);
  }, [product]);

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
        {isLoading
          ? [...Array(3)].map((x, index) => <div className="image-card suspense" key={index}></div>)
          : product?.imageUrls.map((url, index) => (
              <img
                className={`image-card ${curImageIndex === index && "selected"}`}
                src={url}
                alt=""
                key={index}
                onClick={() => setCurImageIndex(index)}
              />
            ))}
      </div>
      {isLoading ? (
        <div className="product-image suspense"></div>
      ) : (
        <img className="product-image" src={product?.imageUrls[curImageIndex]} alt="" />
      )}
      <div className="right-container">
        {isLoading ? <div className="name-text-suspense suspense"></div> : <p className="name-text">{toTitleCase(product?.title || "")}</p>}
        {isLoading ? <div className="price-text-suspense suspense"></div> : <p className="price-text">${product?.price}</p>}
        <div className="divider"></div>
        <p className="colours-text">Colours</p>
        <div className="colours-container container">
          {isLoading
            ? [...Array(3)].map((x, index) => <div className="colour suspense" key={index}></div>)
            : product?.colours.map((colour, index) => (
                <div
                  className={`colour ${curColourIndex === index && "selected"}`}
                  style={{
                    backgroundColor: Colour[getEnumValues(Colour).find((x) => x.toLowerCase() === colour) as keyof typeof Colour] ?? "",
                  }}
                  key={index}
                  onClick={() => setColourIndex(index)}
                ></div>
              ))}
        </div>
        <p className="sizes-text">Sizes</p>
        <div className="sizes-container container">
          {isLoading
            ? [...Array(3)].map((x, index) => <div className="size-btn suspense" key={index}></div>)
            : product?.sizes.map((size, index) => (
                <button
                  className={`size-btn ${curSize?.toLowerCase() === size && "selected"}`}
                  key={index}
                  onClick={() => setSize(Size[getEnumValues(Size).find((x) => x.toLowerCase() === size) as keyof typeof Size])}
                >
                  {size.toUpperCase()}
                </button>
              ))}
        </div>
        <button className="add-to-cart-btn">Add To Cart</button>
        <details className="product-details">
          <summary className="details-text">Details</summary>
          <p>Material - {toTitleCase(product?.material || "")}</p>
        </details>
        <details className="product-description">
          <summary className="description-text">Description</summary>
          <p>{product?.description}</p>
        </details>
      </div>
    </div>
  );
}
