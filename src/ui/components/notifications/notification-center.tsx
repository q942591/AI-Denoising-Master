"use client";

import type React from "react";

import { Bell } from "lucide-react";
import { useState } from "react";

import type { Notification } from "~/db/schema";

import { cn } from "~/lib/utils";
import { Button } from "~/ui/primitives/button";
import { CardFooter } from "~/ui/primitives/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/primitives/dropdown-menu";

import { Notifications } from "./notifications";

interface NotificationCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications: Notification[];
  onClearAll: () => void;
  onDismiss: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationCenter({
  className,
  notifications,
  onClearAll,
  onDismiss,
  onMarkAsRead,
  ...props
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // 处理全部标为已读的函数
  const handleMarkAllAsRead = () => {
    if (onMarkAsRead) {
      for (const notification of notifications) {
        if (!notification.isRead) {
          onMarkAsRead(notification.id);
        }
      }
    }
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="relative" variant="ghost">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span
                className={`
                  absolute top-1 right-1 flex h-4 min-w-4 items-center
                  justify-center rounded-full bg-red-500 px-1 text-[10px]
                  font-medium text-white
                `}
              >
                {unreadCount > 99 ? "99+" : String(unreadCount)}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>通知</span>
            {unreadCount > 0 && onMarkAsRead && (
              <Button
                className="h-auto p-0 text-xs font-normal text-primary"
                onClick={handleMarkAllAsRead}
                size="sm"
                variant="ghost"
              >
                全部标为已读
              </Button>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {notifications.length === 0 ? (
            <div
              className={`
                flex items-center justify-center p-4 text-sm
                text-muted-foreground
              `}
            >
              暂无通知
            </div>
          ) : (
            <Notifications
              notifications={notifications}
              onDismiss={onDismiss}
              onMarkAsRead={onMarkAsRead}
            />
          )}

          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <CardFooter className="p-2">
                <Button
                  className="w-full"
                  onClick={onClearAll}
                  size="sm"
                  variant="outline"
                >
                  清除所有通知
                </Button>
              </CardFooter>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
