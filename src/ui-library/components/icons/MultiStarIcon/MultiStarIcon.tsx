import { StarIcon } from "../StarIcon/StarIcon";

import "./styles/MultiStarIcon.css";

export const MultiStarIcon = () => {
  return (
    <div className="multi-star-icon">
      <StarIcon />
      <StarIcon />
      <StarIcon />
    </div>
  );
};
