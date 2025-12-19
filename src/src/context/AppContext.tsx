import React from "react";
import type { ReactNode } from "react";
import { AppContext } from "./AppContextDefinition";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};
