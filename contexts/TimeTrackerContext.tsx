import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { reminderOptions } from "../components/NewTimeTrackerForm/components/Reminders";
import { useDatabase } from "../hooks/useDatabase";
import { useNotifications } from "../hooks/useNotifications";
import { Tracker, Trackers } from "../types/types";
import { parseTimePeriods } from "../utils/parseTimePeriods";

// TODO: fill types
type TimeTrackerContextType = {
  addTracker: (tracker: Tracker) => void;
  removeTracker: (name: Tracker["name"]) => void;
  updateTracker: (tracker: Tracker) => void;
  trackers: Trackers;
  draft: Tracker;
  updateDraft: React.Dispatch<React.SetStateAction<Tracker>>;
  clearDraft: () => void;
};

const TimeTrackerContext = createContext<TimeTrackerContextType | null>(null);

export const getInitialTrackerData = () =>
  ({
    name: "",
    finishDate: Date.now() + parseTimePeriods(1, "day(s)", "ms"),
  } as Tracker);

// TODO: there should be only one source of truth for all APIs used here. maybe file saved
export const TimeTrackerProvider: FC<PropsWithChildren> = ({ children }) => {
  const { addEntry, checkIfEntryExists, removeEntry, getAllEntries } =
    useDatabase();
  const { scheduleNotification, removeNotification } = useNotifications();
  const [trackers, setTrackers] = useState<Trackers>([]);
  const [draft, setDraft] = useState<Tracker>(getInitialTrackerData());

  // Reset state storing form data to initial state
  const clearDraft = () => setDraft(getInitialTrackerData());

  // Setup initial state on first render - read database
  useEffect(() => {
    getAllEntries((results) => {
      setTrackers(results);
    });
  }, []);

  // Add new tracker
  const addTracker = (newTracker: Tracker) => {
    // Extract data from argument
    const { name, finishDate, description, reminders } = newTracker;
    checkIfEntryExists(name, (exists) => {
      // Break and inform the user if entry already exists
      if (exists)
        return alert(
          `Tracker named ${name} already exists! Choose a different name`
        );
      // Otherwise, add entry to db
      addEntry(
        newTracker,
        // On success schedule notifications for finishDate and reminders and update state
        () => {
          scheduleNotification(name, {
            content: { body: description },
            trigger: { date: finishDate },
          });
          reminders?.forEach((key, i) => {
            const reminderDate = finishDate - reminderOptions[key].ms;
            if (reminderDate < Date.now()) return;
            scheduleNotification(`${name}_reminder_${i}`, {
              content: { body: description },
              trigger: { date: reminderDate },
            });
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
      // On removal success remove notification(s) and update state
      removeNotification(name);
      const tracker = trackers.find((tracker) => tracker.name === name);
      tracker?.reminders?.forEach((el, i) =>
        removeNotification(`${name}_reminder_${i}`)
      );
      setTrackers(trackers.filter((tracker) => tracker.name !== name));
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
    draft,
    updateDraft: setDraft,
    clearDraft,
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
