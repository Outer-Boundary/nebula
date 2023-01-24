import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNebulaCtx } from "../../context/NebulaContext";
import { backgroundColours, getGradientBackground } from "../../helper/Helper";
import { StarIcon } from "../../ui-library/components/icons/StarIcon/StarIcon";
import { categoryCollection, CategoryGroup } from "../types/CategoryTypes";

import "./styles/Header.css";

export default function Header() {
  const location = useLocation();

  const nebulaContext = useNebulaCtx();

  useLayoutEffect(() => {
    const rootPath = location.pathname.substring(1).split("/")[0];

    if (Object.keys(categoryCollection).includes(rootPath)) {
      nebulaContext.setGroup(rootPath as CategoryGroup);
    }
  }, []);

  function playSpinAnimation() {
    const starIcon = document.getElementsByClassName("star-icon")[0] as HTMLElement;
    if (!starIcon.classList.contains("spin")) {
      starIcon.classList.add("spin");
      setTimeout(() => starIcon.classList.remove("spin"), 500);
    }
  }

  return (
    <div className="header">
      {["one", "two", "three"].map((shape, index) => (
        <div
          className={`header-background-shape ${shape}`}
          onMouseEnter={() => {
            const shape = document.getElementsByClassName("header-background-shape")[index] as HTMLElement;
            shape.classList.add("pulsate");
          }}
          onMouseLeave={() => {
            const shape = document.getElementsByClassName("header-background-shape")[index] as HTMLElement;
            shape.classList.remove("pulsate");
          }}
          key={shape}
        ></div>
      ))}
      <div className="main-section">
        {/* Groups */}
        <div className="groups">
          {Object.keys(categoryCollection).map((group) => (
            <Link
              to={group === "home" ? "/" : `/${group}`}
              onClick={() => nebulaContext.setGroup(group as CategoryGroup)}
              className="group"
              key={group}
            >
              {group.toUpperCase()}
            </Link>
          ))}
        </div>
        {/* Logo */}
        <Link className="logo" to="/" onClick={() => nebulaContext.setGroup("home")} onMouseEnter={() => playSpinAnimation()}>
          <div className="logo-text">NEBULA</div>
          <StarIcon />
        </Link>
        <div className="nav"></div>
      </div>
      {/* Categories */}
      <div className="categories">
        {Object.keys(categoryCollection[nebulaContext.group]).map((category) => (
          <Link to={nebulaContext.group === "home" ? "/" : `/${nebulaContext.group}/` + "products"} className="category" key={category}>
            {category.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
