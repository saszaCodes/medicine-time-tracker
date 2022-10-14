import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

const HANDLE_NOTIFICATION_TASK = "HANDLE_NOTIFICATION_TASK";

export const useNotifications = () => {
  // Initialize notification handlers on first render
  // TODO: should I remove notification handlers when component is unmounted?
  useEffect(() => {
    setupNotificationHandlers();
  }, []);

  // TODO: use settings instead of hardcoded values
  // Setup notification handlers
  const setupNotificationHandlers = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    // TODO: is this a good way to handle tasks when app is backrounded / killed?
    if (!TaskManager.isTaskDefined(HANDLE_NOTIFICATION_TASK)) {
      TaskManager.defineTask(
        HANDLE_NOTIFICATION_TASK,
        ({ data, error, executionInfo }) => {
          console.log(data);
        }
      );
    }
    Notifications.addNotificationReceivedListener;
    Notifications.registerTaskAsync(HANDLE_NOTIFICATION_TASK);
  };

  // Schedule new notification
  const scheduleNotification = async (
    name: string,
    input: Omit<Notifications.NotificationRequestInput, "identifier">
  ) => {
    const identifier = await Notifications.scheduleNotificationAsync({
      identifier: name,
      ...input,
    });
    return identifier;
  };

  // Remove notification
  const removeNotification = async (name: string) => {
    await Notifications.cancelScheduledNotificationAsync(name);
  };

  // Get all notifications
  const getAllNotifications = Notifications.getAllScheduledNotificationsAsync;

  return {
    setupNotificationHandlers,
    scheduleNotification,
    removeNotification,
    getAllNotifications,
  };
};
