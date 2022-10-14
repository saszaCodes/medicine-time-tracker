import { Text } from "react-native";
import {
  AndroidNativeProps,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

export {};

type DatePickerProps = {
  value: number;
  onChange: (selectedDate: number) => void;
};

const extractDateInfo = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate(),
  hour: date.getHours(),
  minutes: date.getMinutes(),
});

export const DatePicker = (props: DatePickerProps) => {
  const date = new Date(props.value);
  const { year, month, day, hour, minutes } = extractDateInfo(date);

  const openPicker = (
    params: Omit<AndroidNativeProps, "onChange" | "value">
  ) => {
    DateTimePickerAndroid.open({
      ...params,
      value: date,
      onChange: (event, selectedDate) => {
        DateTimePickerAndroid.dismiss(params.mode);
        if (selectedDate === undefined || event.type === "dismissed") return;
        props.onChange(selectedDate.valueOf());
      },
    });
  };

  return (
    <>
      <Text
        style={{ fontSize: 40 }}
        onPress={() => openPicker({ mode: "date" })}
      >{`${day}/${month}/${year}`}</Text>
      <Text
        style={{ fontSize: 40 }}
        onPress={() => openPicker({ mode: "time" })}
      >{`${hour}:${minutes < 10 ? 0 : ""}${minutes}`}</Text>
    </>
  );
};
