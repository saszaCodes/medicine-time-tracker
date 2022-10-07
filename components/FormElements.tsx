import {
  Picker,
  PickerProps,
  PickerItemProps,
} from "@react-native-picker/picker";
import { TextInput as NativeTextInput, TextInputProps } from "react-native";

export const TextInput = (props: TextInputProps) => (
  <NativeTextInput {...props} />
);

type PicklistPropsType = PickerProps & { options: PickerItemProps[] };
// type PicklistPropsType = PickerProps;
export const Picklist = (props: PicklistPropsType) => (
  <Picker {...props}>
    {props.options.map((itemProps, i) => (
      <Picker.Item key={i} {...itemProps} />
    ))}
  </Picker>
);

// TODO: Defince checkbox
export const Checkbox = null;
