import moment from "moment";
import { View } from "react-native";
import styled from "styled-components/native";
import { Tracker } from "../../../types/types";
import { PropsWithChildren } from "react";

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing.mplus};
  // TODO: get ":last-of-type" working
  :last-of-type {
    margin-bottom: ${({ theme }) => theme.spacing.mplus};
    border: 1px solid red;
  }
  padding: ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadi.regular};
  flex-direction: row;
  align-items: center;
  min-height: 80px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  // TODO: get shadow working
  box-shadow: 5px 4px ${({ theme }) => theme.colors.boxShadow};
`;

const DateContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing.l};
`;

const Heading = styled.Text`
  font: ${({ theme }) => theme.fonts.subheading1};
  font-weight: 800;
`;

type TrackerCardProps = { icon?: JSX.Element; tracker: Tracker };

export const TrackerCard = (props: TrackerCardProps) => {
  const {
    icon,
    tracker: { name, finishDate, description, reminders },
  } = props;
  return (
    <Container>
      <DateContainer>
        <Heading>{moment(finishDate).format(" hh:mm")}</Heading>
      </DateContainer>
      <View>
        <Heading>{name}</Heading>
      </View>
    </Container>
  );
};
