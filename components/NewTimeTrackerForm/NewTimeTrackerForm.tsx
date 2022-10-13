import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { Button } from "react-native";
import {
  getInitialTrackerData,
  useTimeTrackerContext,
} from "../../contexts/TimeTrackerContext";
import { Tracker } from "../../types/types";
import { TextInput } from "../FormElements";
import { DatePicker } from "./components/DatePicker";

// Parse values to Tracker
const parseValues = (values: FieldValues) =>
  ({
    name: values.name,
    finishDate: values.finishDate,
    description: values.description,
    reminders: values.reminders,
  } as Tracker);

// TODO: use default display in a way that doesn't require specyfi=ying all props if any one is specified
export const NewTimeTrackerForm = ({
  useContextValues = true,
  display = {
    description: true,
    finishDate: true,
    name: true,
    reminders: true,
  },
}) => {
  const { control, handleSubmit, getValues, setValue, watch } = useForm();
  const { addTracker, draft, clearDraft, updateDraft } =
    useTimeTrackerContext();
  const navigation = useNavigation();

  // When form goes out of focus, update the context (unless useContextValues is false)
  useEffect(() => {
    // TODO: analyze how this useEffect affects when component is rerendered and what side effects it causes
    // (hint: add console.log() in component body)
    const subscription = navigation.addListener("blur", () => {
      console.log("Form context updated");
      if (!useContextValues) return;
      const values = getValues();
      const newDraft = parseValues(values);
      updateDraft(newDraft);
    });

    return navigation.removeListener("blur", subscription);
  }, []);

  // On first render read initial form data from context
  useEffect(() => {
    // Extract form data from context (unless useContextValues is false)
    const { name, description, finishDate, reminders } = useContextValues
      ? draft
      : getInitialTrackerData();
    // Set initial form values
    setValue("name", name);
    setValue("description", description);
    setValue("finishDate", finishDate);
    setValue("reminders", reminders);
  }, []);

  // On submit clear form context (unless useContextValues is false) and add a new tracker
  const onSubmit = () => {
    console.log("Form submitted");
    const values = getValues();
    const newTracker = parseValues(values);
    addTracker(newTracker);
    if (!useContextValues) return;
    clearDraft();
  };

  const value = watch("finishDate");
  useEffect(() => {
    console.log(value);
  }, [value]);

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
          // TODO: pass <Reminders /> to render
          render={({ field: { value, onChange } }) => <></>}
        />
      )}
      {display.finishDate && (
        <>
          <Controller
            name="finishDate"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DatePicker value={value} onChange={onChange} />
            )}
          />
        </>
      )}
      <Button onPress={handleSubmit(onSubmit)} title="Save" />
    </>
  );
};
