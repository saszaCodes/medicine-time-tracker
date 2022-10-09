export type FinishTimeType = "date" | "timePeriod";

export type TimePeriod = "minute(s)" | "hour(s)" | "day(s)" | "week(s)";

export type Tracker = {
  name: string;
  description?: string;
  finishDate: number;
  reminders?: number;
};

export type TrackerFormInput = {
  name: string;
  description?: string;
  // TODO: use discriminatory union to discern whether period should be required
  finishTime: {
    type: FinishTimeType;
    period: TimePeriod;
    value: number;
  };
  reminders?: number;
};

export type Trackers = Tracker[];

export type MainNavigatorParams = {
  Welcome: undefined;
  AddTracker: undefined;
  Settings: undefined;
};
