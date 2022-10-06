import { createContext, FC, PropsWithChildren, useContext } from "react";

// TODO: fill types
type NewTimeTrackerFormContextType = unknown;

const NewTimeTrackerFormContext =
  createContext<NewTimeTrackerFormContextType | null>(null);

export const NewTimeTrackerFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  // here you can manipulate context data, create custom functions to handle it, etc.

  const contextValue: NewTimeTrackerFormContextType = {};

  return (
    <NewTimeTrackerFormContext.Provider value={contextValue}>
      {children}
    </NewTimeTrackerFormContext.Provider>
  );
};

export const useNewTimeTrackerFormContext = () => {
  const context = useContext(NewTimeTrackerFormContext);
  if (context) return context;
  throw Error("Use this hook in NewTimeTrackerFormContext");
};
