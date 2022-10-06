import IProduct from "../types/IProduct";
import "./styles/ProductIcon.css";

export default function ProductIcon({ product }: { product: IProduct }) {
  return (
    <div className="product-icon">
      <img
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgildan.my%2Fwp-content%2Fuploads%2F2020%2F02%2F76000B-24C-Gold.png&f=1&nofb=1&ipt=b6cf2017d0b012724ad5f06f3b92fcfb1919c1c771a57c11b61c1360e89b08d1&ipo=images"
        alt=""
        className="product-image"
      />
      <div className="product-details">
        <p className="name-text">{product.name.replace("TS", "T-S")}</p>
        <p className="price-text">${product.price}</p>
      </div>
    </div>
  );
}
