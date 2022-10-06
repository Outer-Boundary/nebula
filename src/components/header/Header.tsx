import { useState } from "react";
import { SectionType } from "../types/SectionType";

import "./styles/Header.css";

export default function Header() {
  const [curSection, setCurSection] = useState<SectionType>("all");

  function selectSection(section: SectionType) {
    document.getElementById(`${curSection}-section`)?.classList.remove("selected");
    document.getElementById(`${section}-section`)?.classList.add("selected");
    setCurSection(section);
  }

  return (
    <div className="header">
      <button id="all-section" className="section-title selected" onClick={() => selectSection("all")}>
        All
      </button>
      <button id="new-section" className="section-title" onClick={() => selectSection("new")}>
        New
      </button>
      <button id="clothing-section" className="section-title" onClick={() => selectSection("clothing")}>
        Clothing
      </button>
      <button id="shoes-section" className="section-title" onClick={() => selectSection("shoes")}>
        Shoes
      </button>
      <button id="accessories-section" className="section-title" onClick={() => selectSection("accessories")}>
        Accessories
      </button>
      <button id="sale-section" className="section-title" onClick={() => selectSection("sale")}>
        Sale
      </button>
    </div>
  );
}
