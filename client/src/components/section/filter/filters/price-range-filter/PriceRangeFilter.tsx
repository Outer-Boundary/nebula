import { useState } from "react";

import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { clamp, lerp } from "../../../../../helper/Helper";
import FilterContainer from "../filter-container/FilterContainer";
import "./styles/PriceRangeFilter.css";

interface PriceRangeFilterProps {
  priceRange: { low: number; high: number };
}

export default function PriceRangeFilter({ priceRange }: PriceRangeFilterProps) {
  const [priceHandleInfo, setPriceHandleInfo] = useState<{ handle?: "low" | "high"; offset?: number; isMoving: boolean }>({
    isMoving: false,
  });

  // Moves the price range handles. need to figure out why the bar width doesn't snap
  function movePriceHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!priceHandleInfo.isMoving) return;

    const handle = document.getElementById(`${priceHandleInfo.handle}-price-handle-container`) as HTMLElement;
    const barBounds = (document.getElementsByClassName("price-range-slider-container")[0] as HTMLElement).getBoundingClientRect();

    const handleBounds = handle.getBoundingClientRect();
    if (priceHandleInfo.handle === "low") {
      const highPriceHandleBounds = (document.getElementById("high-price-handle-container") as HTMLElement).getBoundingClientRect();
      const lowBar = document.getElementsByClassName("price-range-bar-low")[0] as HTMLElement;

      const value = clamp(
        -handleBounds.width / 2,
        highPriceHandleBounds.left - barBounds.left,
        e.clientX - barBounds.left - priceHandleInfo.offset!
      );

      handle.style.left = value + "px";
      lowBar.style.right = barBounds.width - value - handleBounds.width / 2 + "px";
    } else {
      const lowPriceHandleBounds = (document.getElementById("low-price-handle-container") as HTMLElement).getBoundingClientRect();
      const highBar = document.getElementsByClassName("price-range-bar-high")[0] as HTMLElement;

      const value = clamp(
        lowPriceHandleBounds.left - barBounds.left,
        barBounds.width - handleBounds.width / 2,
        e.clientX - barBounds.left - priceHandleInfo.offset!
      );

      handle.style.left = value + "px";
      highBar.style.left = handleBounds.left + handleBounds.width / 2 - barBounds.left + "px";
    }

    const priceText = document.getElementsByClassName(`${priceHandleInfo.handle}-price-text`)[0];
    const percentage = (handleBounds.left - barBounds.left + handleBounds.width / 2) / barBounds.width;
    priceText.innerHTML = "$" + Math.round(lerp(priceRange.low, priceRange.high, percentage));
  }

  return (
    <FilterContainer
      className="price-range-filter"
      onMouseUp={() => {
        setPriceHandleInfo({ isMoving: false });
      }}
      onMouseLeave={() => {
        setPriceHandleInfo({ isMoving: false });
      }}
      onMouseMove={(e) => movePriceHandle(e)}
    >
      <p className="price-range-text">PRICE RANGE</p>
      <div className="price-range-slider-container">
        <div className="price-range-bar-container">
          <div className="price-range-bar-low"></div>
          <div className="price-range-bar-high"></div>
          <div className="price-range-bar"></div>
        </div>
        <div className="price-ranges-container">
          <p className="low-price-text price-text">LOW</p>
          <p className="high-price-text price-text">HIGH</p>
        </div>
        <div
          id="low-price-handle-container"
          onMouseDown={(e) =>
            setPriceHandleInfo({ handle: "low", offset: e.clientX - e.currentTarget.getBoundingClientRect().left, isMoving: true })
          }
        >
          <TiArrowSortedUp id="low-price-handle" className="price-handle" />
        </div>
        <div
          id="high-price-handle-container"
          onMouseDown={(e) =>
            setPriceHandleInfo({ handle: "high", offset: e.clientX - e.currentTarget.getBoundingClientRect().left, isMoving: true })
          }
        >
          <TiArrowSortedDown id="high-price-handle" className="price-handle" />
        </div>
      </div>
    </FilterContainer>
  );
}
