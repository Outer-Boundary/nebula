import { createContext, ReactNode, useContext } from "react";

export interface INebulaContext {}

export const NebulaContext = createContext<INebulaContext | null>(null);

interface NebulaCtxProps {
  children: ReactNode;
}

export const NebulaCtx = ({ children }: NebulaCtxProps) => {
  return <NebulaContext.Provider value={{}}>{children}</NebulaContext.Provider>;
};

export const useNebulaCtx = () => {
  const nebulaCtx = useContext(NebulaContext);

  if (!nebulaCtx) throw new TypeError("NebulaContext is null.");

  return nebulaCtx;
};
