import { useState } from "react";

import "./styles/Header.css";

type Section = "all" | "new" | "clothing" | "shoes" | "accessories";

export default function Header() {
  const [curSection, setCurSection] = useState<Section>("all");

  function selectSection(section: Section) {
    document.getElementById(`${curSection}-section`)?.classList.remove("selected");
    document.getElementById(`${section}-section`)?.classList.add("selected");
    setCurSection(section);
  }

  return (
    <div className="header">
      <div className="section-container">
        <button id="all-section" className="section selected" onClick={() => selectSection("all")}>
          All
        </button>
        <button id="new-section" className="section" onClick={() => selectSection("new")}>
          New
        </button>
        <button id="clothing-section" className="section" onClick={() => selectSection("clothing")}>
          Clothing
        </button>
        <button id="shoes-section" className="section" onClick={() => selectSection("shoes")}>
          Shoes
        </button>
        <button id="accessories-section" className="section" onClick={() => selectSection("accessories")}>
          Accessories
        </button>
      </div>
    </div>
  );
}
