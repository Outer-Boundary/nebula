import { useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toTitleCase } from "../../helper/String";
import { MultiStarIcon } from "../../ui-library/components/icons/MultiStarIcon/MultiStarIcon";
import { StarIcon } from "../../ui-library/components/icons/StarIcon/StarIcon";
import { categoryCollection, CategoryGroups } from "../types/CategoryTypes";

import "./styles/Header.css";

export default function Header() {
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroups>("home");

  const location = useLocation();

  useLayoutEffect(() => {
    const rootPath = location.pathname.substring(1).split("/")[0];

    if (Object.keys(categoryCollection).includes(rootPath)) {
      setSelectedGroup(rootPath as CategoryGroups);
    }
  }, []);

  return (
    <div className="header">
      <div className="main-section">
        {/* Groups */}
        <div className="groups">
          {Object.keys(categoryCollection).map((group) => (
            <Link
              to={group === "home" ? "/" : `/${group}`}
              onClick={() => setSelectedGroup(group as CategoryGroups)}
              key={group}
            >
              {toTitleCase(group)}
            </Link>
          ))}
        </div>
        {/* Logo */}
        <Link className="logo" to="/" onClick={() => setSelectedGroup("home")}>
          <div className="logo-text">NEBULA</div>
          <StarIcon />
        </Link>
        <div className="nav"></div>
      </div>
      {/* Categories */}
      <div className="categories">
        {categoryCollection[selectedGroup].map((category) => (
          <Link to={selectedGroup === "home" ? "/" : `/${selectedGroup}/` + "products"} key={category}>
            <p className="test">{toTitleCase(category)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
