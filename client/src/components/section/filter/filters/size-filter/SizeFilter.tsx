import { GiDiamonds } from "react-icons/gi";

import { getEnumValues } from "../../../../../helper/Helper";
import Size from "../../../../types/Size";
import FilterContainer, { toggleVisibility } from "../filter-container/FilterContainer";
import "./styles/SizeFilter.css";

export default function SizeFilter() {
  return (
    <FilterContainer className="size-filter">
      <div className="title-container" onClick={() => toggleVisibility(`sizes-container`, `sizes-visibility-icon`)}>
        <p className="size-text filter-text">SIZE</p>
        <GiDiamonds id="sizes-visibility-icon" className="visibility-icon closed" />
      </div>
      <div id="sizes-container" className="checkboxes-container grid">
        {getEnumValues(Size).map((size, index) => (
          <div className="size-container" key={index}>
            <input type="checkbox" name={size} id={`${size.toLowerCase()}-size-checkbox`} className="checkbox" />
            <label htmlFor={`${size.toLowerCase()}-size-checkbox`} className="checkbox-label">
              {size}
            </label>
          </div>
        ))}
      </div>
    </FilterContainer>
  );
}
