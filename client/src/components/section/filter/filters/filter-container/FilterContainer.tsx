import { ReactNode } from "react";

import "./styles/FilterContainer.css";

// Toggles the visibility of an element and adds a class to the specified icon for state changing purposes
export function toggleVisibility(childContainerId: string, iconId: string) {
  const element = document.getElementById(childContainerId);

  if (!element) return;

  let display = "none";
  if (window.getComputedStyle(element as HTMLElement).display === "none") {
    display = element.classList[element.classList.length - 1];
    (document.getElementById(iconId) as HTMLElement).classList.remove("closed");
  } else {
    (document.getElementById(iconId) as HTMLElement).classList.add("closed");
  }

  element.style.display = display;
}

interface FilterContainerProps {
  children: ReactNode;
  className: string;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: React.MouseEvent<any>) => void;
}

export default function FilterContainer(props: FilterContainerProps) {
  return (
    <div
      className={`${props.className} filter-container`}
      onMouseUp={props.onMouseUp}
      onMouseLeave={props.onMouseLeave}
      onMouseMove={props.onMouseMove}
    >
      {props.children}
    </div>
  );
}
