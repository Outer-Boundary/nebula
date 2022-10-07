import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionType } from "../types/SectionType";

import "./styles/Header.css";

export default function Header() {
  const [curSection, setCurSection] = useState<SectionType>(SectionType.All);

  function selectSection(section: SectionType) {
    document.getElementById(`${SectionType[curSection].toString().toLowerCase()}-section`)?.classList.remove("selected");
    document.getElementById(`${SectionType[section].toString().toLowerCase()}-section`)?.classList.add("selected");
    setCurSection(section);
  }

  return (
    <div className="header">
      <Link to="/" id="all-section" className="section-title selected" onClick={() => selectSection(SectionType.All)}>
        All
      </Link>
      <Link to="/new" id="new-section" className="section-title" onClick={() => selectSection(SectionType.New)}>
        New
      </Link>
      <Link to="/clothing" id="clothing-section" className="section-title" onClick={() => selectSection(SectionType.Clothing)}>
        Clothing
      </Link>
      <Link to="/shoes" id="shoes-section" className="section-title" onClick={() => selectSection(SectionType.Shoes)}>
        Shoes
      </Link>
      <Link to="/accessories" id="accessories-section" className="section-title" onClick={() => selectSection(SectionType.Accessories)}>
        Accessories
      </Link>
      <Link to="sale" id="sale-section" className="section-title" onClick={() => selectSection(SectionType.Sale)}>
        Sale
      </Link>
    </div>
  );
}
