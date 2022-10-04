import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNotifications } from "../hooks/useNotifications";

// TODO: fill types
type TimeTrackerContextType = {
  // trackers: Tracker[];
  addTracker: (tracker: Tracker) => void;
  removeTracker: (name: Tracker["name"]) => void;
};

const TimeTrackerContext = createContext<TimeTrackerContextType | null>(null);

type Tracker = {
  name: string;
  payload: {
    description?: string;
    finishTime: number;
    reminders?: number;
  };
};

// TODO: there should be only one source of truth for all APIs used here. maybe file saved
export const TimeTrackerProvider: FC<PropsWithChildren> = ({ children }) => {
  // TODO: init state with currently registered trackers on app launch and update whenever tracker is added / removed
  // TODO: store in memory and sync react state with it - persistence!
  const [trackers, setTrackers] =
    useState<Record<Tracker["name"], Tracker["payload"]>>();

  const {
    setupNotificationHandlers,
    scheduleNotification,
    removeNotification,
  } = useNotifications();

  // TODO: should I remove notification handlers when component is unmounted?
  useEffect(() => {
    setupNotificationHandlers();
  }, []);

  const addTracker = ({ name, payload }: Tracker) => {
    if (trackers?.[name])
      throw new Error(
        `Tracker named ${name} already exists. Choose different name`
      );
    const { finishTime, description } = payload;
    scheduleNotification(name, {
      content: { body: description },
      trigger: { seconds: (finishTime - Date.now()) / 1000 },
    });
    // TODO: maybe useRef instead?
    const newTrackers = { ...trackers, [name]: payload };
    setTrackers(newTrackers);
  };

  const removeTracker = (name: Tracker["name"]) => removeNotification(name);

  const contextValue: TimeTrackerContextType = {
    addTracker,
    removeTracker,
  };

  return (
    <TimeTrackerContext.Provider value={contextValue}>
      {children}
    </TimeTrackerContext.Provider>
  );
};

export const useTimeTrackerContext = () => {
  const context = useContext(TimeTrackerContext);
  if (context) return context;
  throw Error("Use this hook in TimeTrackerContext");
};
