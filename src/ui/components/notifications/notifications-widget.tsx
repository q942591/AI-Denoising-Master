import React from "react";

import { useNotifications } from "~/components/providers/notifications-provider";

import { NotificationCenter } from "./notification-center";

export function NotificationsWidget() {
  const {
    clearAllNotifications,
    dismissNotification,
    markAsRead,
    notifications,
  } = useNotifications();

  return (
    <NotificationCenter
      notifications={notifications}
      onClearAll={clearAllNotifications}
      onDismiss={dismissNotification}
      onMarkAsRead={markAsRead}
    />
  );
}
