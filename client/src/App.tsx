import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header/Header";
import ProductPage from "./components/product-page/ProductPage";
import Section from "./components/section/Section";
import { categoryCollection } from "./components/types/CategoryTypes";
import { SectionType } from "./components/types/SectionType";
import { toTitleCase } from "./helper/String";

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        {Object.keys(categoryCollection).map((group) => (
          <Route path={group === "home" ? "/" : `/${toTitleCase(group)}`} element={<Section section={SectionType.All} />} key={group}>
            <Route path="products" element={<></>} />
          </Route>
        ))}
        <Route path="products/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
