export type TimePeriod = "minute(s)" | "hour(s)" | "day(s)" | "week(s)";

export type Tracker = {
  name: string;
  description?: string;
  finishDate: number;
  reminders?: [{ id: number; timeValue: number; timePeriod: TimePeriod }];
};

export type Trackers = Tracker[];

export type MainNavigatorParams = {
  Welcome: undefined;
  AddTracker: undefined;
  Settings: undefined;
};
