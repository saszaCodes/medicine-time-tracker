import { useForm, Controller, FieldValues } from "react-hook-form";
import { Button } from "react-native";
import { Tracker, useTimeTrackerContext } from "../contexts/TimeTrackerContext";
import { Picklist, TextInput } from "./FormElements";

// TODO: get rid of 'payload' string in resulting union
type NewTimeTrackerFormProps = {
  useContextValues?: boolean;
  display?: {
    [key in keyof Tracker | keyof Tracker["payload"]]?: boolean | string;
  };
};

const parseFormValuesToTracker = (values: FieldValues) => ({
  name: values.name,
  payload: {
    description: values.description,
    finishTime: {
      type: values.finishTimeType,
      value: values.finishTimeValue,
    },
    reminders: values.reminders,
  },
});

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
  const { control, handleSubmit, getValues } = useForm();
  const {
    addTracker,
    trackerFormData,
    updateTrackerFormData,
    resetTrackerFormData,
  } = useTimeTrackerContext();

  // On submit clear form context and add a new tracker
  const onSubmit = () => {
    console.log("Form submitted");
    const values = getValues();
    const newTracker = parseFormValuesToTracker(values);
    resetTrackerFormData();
    addTracker(newTracker);
  };

  // TODO: Update form context when user unfocuses the screen

  // Extract form data from context if useContextValues is true
  const {
    name,
    payload: {
      description,
      reminders,
      finishTime: { type: finishTimeType, value: finishTimeValue },
    },
  } = trackerFormData;

  //  Return a form consisting of controlled elements
  return (
    <>
      {display.name && (
        <Controller
          name="name"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={value}
              defaultValue={name}
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
              defaultValue={description}
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
              defaultValue={reminders?.toString()}
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
            render={({ field: { onChange, value } }) => (
              <Picklist
                selectedValue={finishTimeType}
                onValueChange={onChange}
                options={[
                  { label: "Date", value: "Date" },
                  { label: "TimePeriod", value: "TimePeriod" },
                ]}
              />
            )}
          />
          <Controller
            rules={{ pattern: /[0-9]+/ }}
            name="finishTimeValue"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                defaultValue={finishTimeValue?.toString()}
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
