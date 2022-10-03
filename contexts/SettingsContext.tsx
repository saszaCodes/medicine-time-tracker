import { createContext, FC, PropsWithChildren } from "react";

// TODO: fill types
type SettingsContextType = unknown;

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  // here you can manipulate context data, create custom functions to handle it, etc.

  const contextValue: SettingsContextType = {};

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};
