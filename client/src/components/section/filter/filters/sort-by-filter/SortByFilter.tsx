import FilterContainer from "../filter-container/FilterContainer";
import "./styles/SortByFilter.css";

export const sortByOptions = ["POPULARITY", "NEWEST", "PRICE LOW", "PRICE HIGH"];

export default function SortByFilter() {
  return (
    <FilterContainer className="sort-by-filter">
      <p className="sort-by-text filter-text">SORT BY</p>
      <select name="" id="sort-by-select">
        {sortByOptions.map((option, index) => (
          <option value={option.toLowerCase().replace(/\s/g, "-")} key={index}>
            {option}
          </option>
        ))}
      </select>
    </FilterContainer>
  );
}
