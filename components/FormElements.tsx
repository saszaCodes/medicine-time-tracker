import {
  Picker,
  PickerProps,
  PickerItemProps,
} from "@react-native-picker/picker";
import { PropsWithChildren } from "react";
import { ButtonProps, PressableProps, TextInputProps } from "react-native";
import styled from "styled-components/native";

const FormItemContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xxxl};
`;
const FormItemlabelContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.mplus};
`;
const FormItemLabel = styled.Text`
  font: ${({ theme }) => theme.fonts.subheading2};
`;
export const FormItemWrapper = (
  props: PropsWithChildren<{ label?: string }>
) => (
  <FormItemContainer>
    {props.label && (
      <FormItemlabelContainer>
        <FormItemLabel>{props.label}</FormItemLabel>
      </FormItemlabelContainer>
    )}
    {props.children}
  </FormItemContainer>
);

const Input = styled.TextInput`
  font: ${({ theme }) => theme.fonts.regular};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadi.regular};
  // TODO: add inset shadow
`;
export const TextInput = ({
  label,
  ...props
}: TextInputProps & { label?: string }) => (
  <FormItemWrapper {...{ label }}>
    <Input {...props} />
  </FormItemWrapper>
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

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.mplus};
  justify-content: center;
  // TODO: make button not 100% wide
`;

const StyledButton = styled.Pressable`
  font: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadi.regular};
  padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.l};
`;

const ButtonText = styled.Text``;

export const Button = (
  props: Pick<PressableProps, "onPress"> & { title: string }
) => (
  <FormItemWrapper>
    <ButtonContainer>
      <StyledButton onPress={props.onPress}>
        <ButtonText>{props.title}</ButtonText>
      </StyledButton>
    </ButtonContainer>
  </FormItemWrapper>
);
