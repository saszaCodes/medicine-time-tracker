import { createContext, FunctionComponent, PropsWithChildren } from "react";

// TODO: fill types
type TimeTrackerContextType = unknown;

const TimeTrackerContext = createContext<TimeTrackerContextType | null>(null);

export const TimeTrackerProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  // here you can manipulate context data, create custom functions to handle it, etc.

  const contextValue: TimeTrackerContextType = {};

  return (
    <TimeTrackerContext.Provider value={contextValue}>
      {children}
    </TimeTrackerContext.Provider>
  );
};
