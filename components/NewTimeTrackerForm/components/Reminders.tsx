import Checkbox from "expo-checkbox";
import { Text, View } from "react-native";
import { parseTimePeriods } from "../../../utils/parseTimePeriods";

type RemindersProps = {
  initialValue?: ReminderKeys;
  reminders: ReminderKeys;
  onChange: (reminders: ReminderKeys) => void;
};
export type ReminderOptions = typeof reminderOptions;
export type ReminderKey = keyof ReminderOptions;
export type ReminderKeys = ReminderKey[];

export const reminderOptions = {
  "15min": {
    label: "15 minutes before",
    ms: parseTimePeriods(15, "minute(s)", "ms"),
  },
  "30min": {
    label: "30 minutes before",
    ms: parseTimePeriods(30, "minute(s)", "ms"),
  },
  "1h": {
    label: "1 hour before",
    ms: parseTimePeriods(1, "hour(s)", "ms"),
  },
  "3h": {
    label: "3 hours before",
    ms: parseTimePeriods(3, "hour(s)", "ms"),
  },
  "1d": {
    label: "1 day before",
    ms: parseTimePeriods(1, "day(s)", "ms"),
  },
  "3d": {
    label: "3 days before",
    ms: parseTimePeriods(3, "day(s)", "ms"),
  },
} as const;

const reminderKeys = Object.keys(reminderOptions) as ReminderKeys;

export const Reminders = (props: RemindersProps) => {
  const handleValueChange = (key: ReminderKey, newValue: boolean) => {
    if (newValue) props.onChange([...props.reminders, key]);
    else
      props.onChange(
        props.reminders.filter((reminderKey) => reminderKey !== key)
      );
  };

  const generateReminders = () =>
    reminderKeys.map((key, index) => {
      const { label } = reminderOptions[key];
      return (
        <View key={index}>
          <Checkbox
            value={props.reminders.includes(key)}
            onValueChange={(value) => handleValueChange(key, value)}
          />
          <Text>{label}</Text>
        </View>
      );
    });

  return <>{generateReminders()}</>;
};
