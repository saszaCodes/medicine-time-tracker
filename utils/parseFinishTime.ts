import { Tracker } from "../contexts/TimeTrackerContext";

// This function assumes, but doesn't check, that parseTo = 'date' ==> value > Date.now()
export const parseFinishTime = (
  finishTime: Tracker["payload"]["finishTime"],
  parseTo: "msFromNow" | "date"
) => {
  const { type, value } = finishTime;
  if (parseTo === "date") {
    if (type === "date") return value;
    const newValue = Date.now() + value;
    return newValue;
  }
  // if parseTo === 'msFromNow' (comment, not actual js to make sure TS sees proper return type)
  if (type === "timePeriod") return value;
  const newValue = value - Date.now();
  return newValue;
};
