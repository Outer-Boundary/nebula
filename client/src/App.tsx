import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header/Header";
import ProductPage from "./components/product-page/ProductPage";
import Section from "./components/section/Section";
import { SectionType } from "./components/types/SectionType";

function App() {
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5000/products/tops");
      const resBody = await response.json();
      console.log(resBody);
    })();
  }, []);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Section section={SectionType.All} />} />
        <Route path="/new" element={<Section section={SectionType.New} />} />
        <Route path="/clothing" element={<Section section={SectionType.Clothing} />} />
        <Route path="/shoes" element={<Section section={SectionType.Shoes} />} />
        <Route path="/accessories" element={<Section section={SectionType.Accessories} />} />
        <Route path="/sale" element={<Section section={SectionType.Sale} />} />
        <Route path="/clothing/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
