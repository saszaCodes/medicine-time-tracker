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
import { parseFinishTime } from "../utils/parseFinishTime";

// TODO: fill types
type TimeTrackerContextType = {
  addTracker: (tracker: Tracker) => void;
  removeTracker: (name: Tracker["name"]) => void;
  updateTracker: (tracker: Tracker) => void;
  trackers: Trackers;
  trackerFormData: Tracker;
  updateTrackerFormData: React.Dispatch<React.SetStateAction<Tracker>>;
  resetTrackerFormData: () => void;
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

export type Trackers = Tracker[];

const initialTrackerFormData: Tracker = {
  name: "",
  payload: {
    finishTime: { type: "timePeriod", value: 0 },
    description: "",
    reminders: 0,
  },
};

// TODO: there should be only one source of truth for all APIs used here. maybe file saved
export const TimeTrackerProvider: FC<PropsWithChildren> = ({ children }) => {
  const { addEntry, checkIfEntryExists, removeEntry, getAllEntries } =
    useDatabase();
  const { scheduleNotification, removeNotification } = useNotifications();
  const [trackers, setTrackers] = useState<Trackers>([]);
  const [trackerFormData, updateTrackerFormData] = useState<Tracker>(
    initialTrackerFormData
  );

  // Reset state storing form data to initial state
  const resetTrackerFormData = () =>
    updateTrackerFormData(initialTrackerFormData);

  // Setup initial state on first render - read database
  useEffect(() => {
    getAllEntries((results) => {
      setTrackers(results);
    });
  }, []);

  // Add new tracker
  const addTracker = (newTracker: Tracker) => {
    // Extract data from argument
    const { name, payload } = newTracker;
    const { finishTime, description } = payload;
    // Define triggerTime and finishDate depending on type of the new tracker
    const triggerTime = parseFinishTime(finishTime, "msFromNow") / 1000;
    const finishDate = parseFinishTime(finishTime, "date");
    checkIfEntryExists(name, (exists) => {
      // Break and inform the user if entry already exists
      if (exists)
        return alert(
          `Tracker named ${name} already exists! Choose a different name`
        );
      // Otherwise, add entry to db
      addEntry(
        {
          name,
          payload: {
            ...payload,
            finishTime: { type: "date", value: finishDate },
          },
        },
        // On success schedule notification and update state
        () => {
          scheduleNotification(name, {
            content: { body: description },
            trigger: { seconds: triggerTime },
          });
          setTrackers([...trackers, newTracker]);
        }
      );
    });
  };

  // Remove tracker
  const removeTracker = (name: Tracker["name"]) => {
    // TODO: handle errors
    // Try to remove entry
    removeEntry(name, () => {
      // On removal success remove notification and update state
      removeNotification(name);
      const newTrackers = [...trackers];
      const i = newTrackers.findIndex((tracker) => tracker.name === name);
      newTrackers.splice(i, 1);
      setTrackers(newTrackers);
    });
  };

  // Update tracker
  const updateTracker = (tracker: Tracker) => {
    removeTracker(tracker.name);
    addTracker(tracker);
  };

  const contextValue: TimeTrackerContextType = {
    addTracker,
    removeTracker,
    updateTracker,
    trackers,
    trackerFormData,
    updateTrackerFormData,
    resetTrackerFormData,
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
