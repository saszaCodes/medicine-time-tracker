import { TimePeriod } from "../types/types";

type ValidTimeUnits = TimePeriod | "ms";

const msInTimeUnit: { [key in ValidTimeUnits]: number } = {
  ms: 1,
  "minute(s)": 1000 * 60,
  "hour(s)": 1000 * 60 * 60,
  "day(s)": 1000 * 60 * 60 * 24,
  "week(s)": 1000 * 60 * 60 * 24 * 7,
};

export const parseTimePeriods = (
  value: number,
  parseFrom: ValidTimeUnits,
  parseTo: ValidTimeUnits
) => {
  if (parseTo === parseFrom) return value;
  return (value * msInTimeUnit[parseFrom]) / msInTimeUnit[parseTo];
};
