import { createContext, FC, PropsWithChildren } from "react";

// TODO: fill types
type ThemeContextProps = unknown;

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  // here you can manipulate context data, create custom functions to handle it, etc.

  const contextValue: ThemeContextProps = {};

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
