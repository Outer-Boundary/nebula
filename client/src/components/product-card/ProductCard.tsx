import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRandomWholeValueBetween } from "../../helper/Helper";
import { toTitleCase } from "../../helper/String";

import { Product } from "../types/product";
import "./styles/ProductCard.css";


export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={"/products/" + product._id} state={product} className="product-card">
      <img src={product.imageCardUrl} alt="" className="product-image" />
      <div className="product-details">
        <p className="name-text">{toTitleCase(product.title)}</p>
        <p className="price-text">${product.price}</p>
      </div>
    </Link>
  );
}
