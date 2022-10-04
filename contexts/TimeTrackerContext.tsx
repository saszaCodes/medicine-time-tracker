import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDatabase } from "../hooks/useDatabase";
import { useNotifications } from "../hooks/useNotifications";

// TODO: fill types
type TimeTrackerContextType = {
  // trackers: Tracker[];
  addTracker: (tracker: Tracker) => void;
  removeTracker: (name: Tracker["name"]) => void;
  updateTracker: (tracker: Tracker) => void;
};

const TimeTrackerContext = createContext<TimeTrackerContextType | null>(null);

export type Tracker = {
  name: string;
  payload: {
    description?: string;
    finishTime: { type: "date" | "timePeriod"; value: number };
    reminders?: number;
  };
};

// TODO: there should be only one source of truth for all APIs used here. maybe file saved
export const TimeTrackerProvider: FC<PropsWithChildren> = ({ children }) => {
  // TODO: init state with currently registered trackers on app launch and update whenever tracker is added / removed
  const {
    addEntry,
    checkIfEntryExists,
    removeEntry,
    updateEntry,
    getAllEntries,
  } = useDatabase();
  const {
    setupNotificationHandlers,
    scheduleNotification,
    removeNotification,
  } = useNotifications();

  // TODO: store in memory and sync react state with it - persistence!
  const [trackers, setTrackers] =
    useState<Record<Tracker["name"], Tracker["payload"]>>();

  const addTracker = ({ name, payload }: Tracker) => {
    // HANDLE IF NAME ALREADY EXISTS
    const { finishTime, description } = payload;
    const { type, value } = finishTime;
    const triggerTime =
      type === "date" ? (value - Date.now()) / 1000 : value / 1000;
    const finishDate = type === "date" ? value : Date.now() + value;
    checkIfEntryExists(name, (exists) => {
      if (exists) throw new Error(`Tracker named ${name} already exists`);
      scheduleNotification(name, {
        content: { body: description },
        trigger: { seconds: triggerTime },
      });
      addEntry({
        name,
        payload: {
          ...payload,
          finishTime: { type: "date", value: finishDate },
        },
      });
      // TODO: maybe useRef instead?
      const newTrackers = { ...trackers, [name]: payload };
      setTrackers(newTrackers);
    });
  };

  const removeTracker = (name: Tracker["name"]) => {
    // TODO: handle errors
    removeNotification(name);
    removeEntry(name);
  };

  const updateTracker = (tracker: Tracker) => {
    removeTracker(tracker.name);
    addTracker(tracker);
  };

  const contextValue: TimeTrackerContextType = {
    addTracker,
    removeTracker,
    updateTracker,
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
