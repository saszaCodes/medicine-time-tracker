import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { Button } from "react-native";
import {
  initialTrackerFormData,
  useTimeTrackerContext,
} from "../contexts/TimeTrackerContext";
import {
  FinishTimeType,
  TimePeriod,
  Tracker,
  TrackerFormInput,
} from "../types/types";
import { parseTimePeriods } from "../utils/parseTimePeriods";
import { Picklist, TextInput } from "./FormElements";

type NewTimeTrackerFormProps = {
  useContextValues?: boolean;
  display?: {
    [key in keyof TrackerFormInput]?: boolean | string;
  };
};

// TODO: get rid of any time hidden in FieldValues
// Overload signatures for parseValues
function parseValues(values: FieldValues, parseTo?: "Tracker"): Tracker;
function parseValues(
  values: FieldValues,
  parseTo: "TrackerFormInput"
): TrackerFormInput;
// Parse values to either Tracker or TrackerFormInput (by default: Tracker)
function parseValues(
  values: FieldValues,
  parseTo: "TrackerFormInput" | "Tracker" = "Tracker"
) {
  // Define props common for both return types
  const parsedValues = {
    name: values.name,
    description: values.description,
    reminders: values.reminders,
  };
  // Add a prop specific to Tracker type and return
  if (parseTo === "Tracker") {
    const finishDate =
      values.finishTimeType === "date"
        ? values.finishTimeValue
        : parseTimePeriods(
            values.finishTimeValue,
            values.finishTimePeriod,
            "ms"
          ) + Date.now();
    console.log(`finishDate: ${finishDate}`);
    return { ...parsedValues, finishDate } as Tracker;
  }
  // Add a prop specific to TrackerFormInput type and return
  else {
    const finishTime: TrackerFormInput["finishTime"] = {
      type: values.finishTimeType,
      period: values.finishTimePeriod,
      value: values.finishTimeValue,
    };
    console.log(`finishTime: ${finishTime}`);
    return { ...parsedValues, finishTime } as TrackerFormInput;
  }
}

// TODO: don't use context values if useContextValues = false
export const NewTimeTrackerForm = ({
  useContextValues = true,
  display = {
    description: true,
    finishTime: true,
    name: true,
    reminders: true,
  },
}: NewTimeTrackerFormProps) => {
  const { control, handleSubmit, getValues, watch, setValue } = useForm();
  const {
    addTracker,
    trackerFormData,
    updateTrackerFormData,
    resetTrackerFormData,
  } = useTimeTrackerContext();
  const navigation = useNavigation();

  // When form goes out of focus, update the context (unless useContextValues is false)
  useEffect(() => {
    // TODO: analyze how this useEffect affects when component is rerendered and what side effects it causes
    // (hint: add console.log() in component body)
    const subscription = navigation.addListener("blur", () => {
      console.log("Form context updated");
      if (!useContextValues) return;
      const values = getValues();
      const newFormData = parseValues(values, "TrackerFormInput");
      updateTrackerFormData(newFormData);
    });

    return navigation.removeListener("blur", subscription);
  }, []);

  const finishTimeSelectType: FinishTimeType = watch("finishTimeType");

  useEffect(() => {
    console.log(finishTimeSelectType);
  }, [finishTimeSelectType]);

  // On first render read initial form data from context
  useEffect(() => {
    // Extract form data from context (unless useContextValues is false)
    const {
      name,
      description,
      reminders,
      finishTime: {
        type: finishTimeType,
        period: finishTimePeriod,
        value: finishTimeValue,
      },
    } = useContextValues ? trackerFormData : initialTrackerFormData;
    // Set initial form values
    setValue("name", name);
    setValue("description", description);
    setValue("reminders", reminders?.toString());
    setValue("finishTimeType", finishTimeType);
    setValue("finishTimePeriod", finishTimePeriod);
    setValue("finishTimeValue", finishTimeValue);
  }, []);

  // On submit clear form context (unless useContextValues is false) and add a new tracker
  const onSubmit = () => {
    console.log("Form submitted");
    const values = getValues();
    const newTracker = parseValues(values);
    addTracker(newTracker);
    if (!useContextValues) return;
    resetTrackerFormData();
  };

  //  Return a form consisting of controlled elements
  return (
    <>
      {display.name && (
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Name"
            />
          )}
        />
      )}
      {display.description && (
        <Controller
          name="description"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextInput
              multiline
              value={value}
              onChangeText={onChange}
              placeholder="Description"
            />
          )}
        />
      )}
      {display.reminders && (
        <Controller
          rules={{ pattern: /[0-9]+/ }}
          name="reminders"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Reminders"
            />
          )}
        />
      )}
      {display.finishTime && (
        // TODO: add more options for particular timer periods
        <>
          <Controller
            name="finishTimeType"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Picklist<FinishTimeType>
                selectedValue={value}
                onValueChange={onChange}
                options={[
                  { label: "Date", value: "date" },
                  { label: "TimePeriod", value: "timePeriod" },
                ]}
              />
            )}
          />
          {finishTimeSelectType === "timePeriod" && (
            <Controller
              name="finishTimePeriod"
              rules={{ required: true }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picklist<TimePeriod>
                  selectedValue={value}
                  onValueChange={onChange}
                  options={[
                    { label: "Minute(s)", value: "minute(s)" },
                    { label: "Hour(s)", value: "hour(s)" },
                    { label: "Day(s)", value: "day(s)" },
                    { label: "Week(s)", value: "week(s)" },
                  ]}
                />
              )}
            />
          )}
          <Controller
            rules={{ pattern: /[0-9]+/, required: true }}
            name="finishTimeValue"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Finish time"
              />
            )}
          />
        </>
      )}
      <Button onPress={handleSubmit(onSubmit)} title="Save" />
    </>
  );
};
