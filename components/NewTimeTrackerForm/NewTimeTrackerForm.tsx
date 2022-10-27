import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import {
  getInitialTrackerData,
  useTimeTrackerContext,
} from "../../contexts/TimeTrackerContext";
import { Tracker } from "../../types/types";
import { Button, TextInput } from "../FormElements";
import { DatePicker } from "./components/DatePicker";
import { Reminders } from "./components/Reminders";

// Parse values to Tracker
const parseValues = (values: FieldValues) => ({ ...values } as Tracker);

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
    console.log(values);
    const newTracker = parseValues(values);
    addTracker(newTracker);
    if (!useContextValues) return;
    clearDraft();
  };

  //  Return a form consisting of controlled elements
  return (
    <ScrollView>
      {display.name && (
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              label="Name"
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
              label="Description"
              placeholder="Description"
            />
          )}
        />
      )}
      {display.reminders && (
        <Controller
          name="reminders"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Reminders reminders={value || []} onChange={onChange} />
          )}
        />
      )}
      {display.finishDate && (
        <>
          <Controller
            name="finishDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker value={value} onChange={onChange} />
            )}
          />
        </>
      )}
      <Button onPress={handleSubmit(onSubmit)} title="Save" />
    </ScrollView>
  );
};
