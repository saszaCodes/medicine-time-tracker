export type Tracker = {
  name: string;
  description?: string;
  finishTime: { type: "date" | "timePeriod"; value: number };
  reminders?: number;
};

export type Trackers = Tracker[];

export type MainNavigatorParams = {
  Welcome: undefined;
  AddTracker: undefined;
  Settings: undefined;
};
