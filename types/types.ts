import { ReminderKeys } from "../components/NewTimeTrackerForm/components/Reminders";

export type TimePeriod = "minute(s)" | "hour(s)" | "day(s)" | "week(s)";

export type Tracker = {
  name: string;
  description?: string;
  finishDate: number;
  reminders?: ReminderKeys;
};

export type Trackers = Tracker[];

export type MainNavigatorParams = {
  Welcome: undefined;
  AddTracker: undefined;
  Settings: undefined;
};
