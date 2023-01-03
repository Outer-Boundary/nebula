import { GiDiamonds } from "react-icons/gi";
import { categoryCollection, CategoryGroup } from "../../../../types/CategoryTypes";
import FilterContainer, { toggleVisibility } from "../filter-container/FilterContainer";
import "./styles/CategoryFilter.css";

interface CategoryFilterProps {
  group: CategoryGroup;
}

export default function CategoryFilter({ group }: CategoryFilterProps) {
  return (
    <FilterContainer className="category-filter">
      <div className="title-container" onClick={() => toggleVisibility(`categories-container`, `category-visibility-icon`)}>
        <p className="category-text filter-text">CATEGORY</p>
        <GiDiamonds id="category-visibility-icon" className="visibility-icon closed" />
      </div>
      <div id="categories-container" className="flex">
        {Object.keys(categoryCollection[group])
          .filter((category) => ["all", "new", "sale"].every((x) => x !== category))
          .map((category, index) => (
            <div className="category-container" key={index}>
              <div className="category-checkbox-container">
                <input id={`${category.toLowerCase()}-category-checkbox`} className="category-checkbox" name={category} type="checkbox" />
                <label htmlFor={`${category.toLowerCase()}-category-checkbox`} className="checkbox-label">
                  {category.toUpperCase()}
                </label>
                <GiDiamonds
                  id={`${category.toLowerCase()}-visibility-icon`}
                  className="visibility-icon small closed"
                  onClick={() =>
                    toggleVisibility(`${category.toLowerCase()}-subcategories-container`, `${category.toLowerCase()}-visibility-icon`)
                  }
                />
              </div>
              <div id={`${category.toLowerCase()}-subcategories-container`} className="subcategories-container flex">
                {categoryCollection[group][category as keyof typeof categoryCollection[typeof group]].map((subcategory: string, index) => (
                  <div className="subcategory-checkbox-container" key={index}>
                    <input
                      id={`${subcategory.toLowerCase()}-subcategory-checkbox`}
                      className="subcategory-checkbox"
                      name={subcategory}
                      type="checkbox"
                    />
                    <label htmlFor={`${subcategory.toLowerCase()}-category-checkbox`} className="checkbox-label">
                      {subcategory
                        .replace(/(?<=[a-z])(?=[A-Z])/g, " ")
                        .replace("TS", "T-S")
                        .toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </FilterContainer>
  );
}
