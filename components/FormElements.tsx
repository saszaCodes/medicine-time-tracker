import {
  Picker,
  PickerProps,
  PickerItemProps,
} from "@react-native-picker/picker";
import { TextInput as NativeTextInput, TextInputProps } from "react-native";

export const TextInput = (props: TextInputProps) => (
  <NativeTextInput {...props} />
);

type PicklistPropsType<T> = PickerProps & {
  options: (Omit<PickerItemProps, "value"> & { value: T })[];
};
// type PicklistPropsType = PickerProps;
export const Picklist: <T = any>(props: PicklistPropsType<T>) => JSX.Element = (
  props
) => (
  <Picker {...props}>
    {props.options.map((itemProps, i) => (
      <Picker.Item key={i} {...itemProps} />
    ))}
  </Picker>
);

// TODO: Defince checkbox
export const Checkbox = null;
