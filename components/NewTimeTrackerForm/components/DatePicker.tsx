import { Text, View } from "react-native";
import {
  AndroidNativeProps,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import styled from "styled-components/native";
import { FormItemWrapper } from "../../FormElements";

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

  const Container = styled.View`
    flex-direction: row;
  `;

  const Text = styled.Text`
    font: ${({ theme }) => theme.fonts.regular};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.l};
    border-radius: ${({ theme }) => theme.borderRadi.regular};
    // TODO: remove right margin from last item
    margin-right: ${({ theme }) => theme.spacing.mplus};
    // TODO: add inset shadow
  `;

  return (
    <FormItemWrapper label="Finish date">
      <Container>
        <Text
          onPress={() => openPicker({ mode: "date" })}
        >{`${day}/${month}/${year}`}</Text>
        <Text onPress={() => openPicker({ mode: "time" })}>{`${hour}:${
          minutes < 10 ? 0 : ""
        }${minutes}`}</Text>
      </Container>
    </FormItemWrapper>
  );
};
