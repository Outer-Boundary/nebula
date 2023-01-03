import { createContext, ReactNode, useContext, useState } from "react";
import { AllCategory, CategoryGroup } from "../components/types/CategoryTypes";

export interface INebulaContext {
  group: CategoryGroup;
  category: AllCategory;
  setGroup: (group: CategoryGroup) => void;
  setCategory: (category: AllCategory) => void;
}

export const NebulaContext = createContext<INebulaContext | null>(null);

export const NebulaCtx = ({ children }: { children: ReactNode }) => {
  const [group, setGroup] = useState<CategoryGroup>("home");
  const [category, setCategory] = useState<AllCategory>("all");

  return <NebulaContext.Provider value={{ group, category, setGroup, setCategory }}>{children}</NebulaContext.Provider>;
};

export const useNebulaCtx = () => {
  const nebulaCtx = useContext(NebulaContext);

  if (!nebulaCtx) throw new TypeError("NebulaContext is null.");

  return nebulaCtx;
};
