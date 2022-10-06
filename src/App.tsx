import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header/Header";
import Section from "./components/section/Section";

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Section section="all" />} />
      </Routes>
    </div>
  );
}

export default App;
