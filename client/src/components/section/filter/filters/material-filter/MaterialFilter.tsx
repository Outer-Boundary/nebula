import { GiDiamonds } from "react-icons/gi";
import { getEnumValues } from "../../../../../helper/Helper";
import Material from "../../../../types/Material";
import FilterContainer, { toggleVisibility } from "../filter-container/FilterContainer";
import "./styles/MaterialFilter.css";

export default function MaterialFilter() {
  return (
    <FilterContainer className="material-filter">
      <div className="title-container" onClick={() => toggleVisibility(`materials-container`, `materials-visibility-icon`)}>
        <p className="material-text filter-text">MATERIAL</p>
        <GiDiamonds id="materials-visibility-icon" className="visibility-icon closed" />
      </div>
      <div id="materials-container" className="checkboxes-container grid">
        {getEnumValues(Material).map((material, index) => (
          <div className="material-container" key={index}>
            <input type="checkbox" name={material} id={`${material.toLowerCase()}-material-checkbox`} className="checkbox" />
            <label htmlFor={`${material.toLowerCase()}-material-checkbox`} className="checkbox-label">
              {material.toUpperCase()}
            </label>
          </div>
        ))}
      </div>
    </FilterContainer>
  );
}
