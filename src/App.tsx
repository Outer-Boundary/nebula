import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header/Header";
import Section from "./components/section/Section";
import { SectionType } from "./components/types/SectionType";

function App() {
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
      </Routes>
    </div>
  );
}

export default App;
