export type Tracker = {
  name: string;
  description?: string;
  finishTime: { type: "date" | "timePeriod"; value: number };
  reminders?: number;
};

export type Trackers = Tracker[];
