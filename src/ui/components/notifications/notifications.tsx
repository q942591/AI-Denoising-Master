import type * as React from "react";

import { Bell, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Notification } from "~/db/schema";

import { cn } from "~/lib/utils";
import { Button } from "~/ui/primitives/button";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "~/ui/primitives/dropdown-menu";

interface NotificationsProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

function formatTimestamp(date: Date, t: ReturnType<typeof useTranslations>) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return t("justNow");
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return t("minutesAgo", { minutes });
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return t("hoursAgo", { hours });
  }
  const days = Math.floor(diffInSeconds / 86400);
  return t("daysAgo", { days });
}

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "credit":
      return <div className="h-2 w-2 rounded-full bg-purple-500" />;
    case "error":
      return <div className="h-2 w-2 rounded-full bg-red-500" />;
    case "generation":
      return <div className="h-2 w-2 rounded-full bg-indigo-500" />;
    case "info":
      return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    case "success":
      return <div className="h-2 w-2 rounded-full bg-green-500" />;
    case "system":
      return <div className="h-2 w-2 rounded-full bg-gray-500" />;
    case "warning":
      return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-gray-500" />;
  }
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onDismiss,
  onMarkAsRead,
}) => {
  const t = useTranslations("Notifications");

  if (notifications.length === 0) {
    return (
      <div
        className={"flex flex-col items-center justify-center py-6 text-center"}
      >
        <Bell className="mb-2 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm font-medium">{t("empty")}</p>
        <p className="text-xs text-muted-foreground">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
      {notifications.map((notification) => (
        <DropdownMenuItem
          className={cn(
            "flex cursor-default flex-col items-start p-0",
            !notification.isRead && "bg-muted/50"
          )}
          key={notification.id}
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex w-full items-start gap-2 p-2">
            <div className="mt-1 flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm leading-none font-medium">
                  {notification.title}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(new Date(notification.createdAt), t)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {notification.description}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-1">
              {!notification.isRead && (
                <Button
                  className="h-6 w-6"
                  onClick={() => onMarkAsRead?.(notification.id)}
                  variant="ghost"
                >
                  <Check className="h-3 w-3" />
                  <span className="sr-only">{t("markAsRead")}</span>
                </Button>
              )}
              <Button
                className="h-6 w-6"
                onClick={() => onDismiss?.(notification.id)}
                variant="ghost"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">{t("dismiss")}</span>
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
};
