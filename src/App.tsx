import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header/Header";
import Section from "./components/section/Section";
import { categoryCollection } from "./components/types/CategoryTypes";
import { toTitleCase } from "./helper/String";

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        {Object.keys(categoryCollection).map((group) => (
          <Route path={group === "home" ? "/" : `/${toTitleCase(group)}`} element={<></>} key={group}>
            <Route path="products" element={<></>} />
          </Route>
        ))}
      </Routes>
    </div>
  );
}

export default App;
