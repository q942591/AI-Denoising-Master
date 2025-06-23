"use client";

import { createContext, use, useCallback, useEffect, useState } from "react";

import type { Notification } from "~/db/schema";

import { useSupabase } from "~/components/providers/SupabaseProvider";
import { notificationsRealtime } from "~/lib/supabase/supabase-notifications";

interface NotificationsContextType {
  clearAllNotifications: () => Promise<void>;
  dismissNotification: (notificationId: string) => Promise<void>;
  loading: boolean;
  markAllAsRead: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  notifications: Notification[];
  refreshNotifications: () => Promise<void>;
  unreadCount: number;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSupabase();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 计算未读通知数量
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // 加载用户通知
  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error("加载通知失败");
      }
      const data = (await response.json()) as { notifications: Notification[] };
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("加载通知失败:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 标记通知为已读
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const response = await fetch("/api/notifications", {
        body: JSON.stringify({ id: notificationId }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      if (!response.ok) throw new Error("标记通知已读失败");

      // 更新本地状态
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("标记通知已读失败:", error);
    }
  };

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/notifications", {
        body: JSON.stringify({ markAll: true }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      if (!response.ok) throw new Error("标记所有通知已读失败");

      // 更新本地状态
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("标记所有通知已读失败:", error);
    }
  };

  // 删除通知
  const dismissNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("删除通知失败");

      // 更新本地状态
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("删除通知失败:", error);
    }
  };

  // 清除所有通知
  const clearAllNotifications = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/notifications?clearAll=true", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("清除所有通知失败");

      // 更新本地状态
      setNotifications([]);
    } catch (error) {
      console.error("清除所有通知失败:", error);
    }
  };

  // 刷新通知
  const refreshNotifications = async () => {
    await loadNotifications();
  };

  // 初始加载通知和订阅实时通知更新
  useEffect(() => {
    if (!user) return;

    // 加载初始通知
    loadNotifications();

    // 订阅实时更新
    const unsubscribe = notificationsRealtime.subscribeToUserNotifications(
      user.id,
      (params) => {
        const {
          eventType,
          new: newNotification,
          old: oldNotification,
        } = params;

        if (eventType === "DELETE" && oldNotification) {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== oldNotification.id)
          );
        } else if (eventType === "INSERT" && newNotification) {
          setNotifications((prev) => [newNotification, ...prev]);
        } else if (eventType === "UPDATE" && newNotification) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === newNotification.id ? newNotification : n))
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, loadNotifications]);

  const value = {
    clearAllNotifications,
    dismissNotification,
    loading,
    markAllAsRead,
    markAsRead,
    notifications,
    refreshNotifications,
    unreadCount,
  };

  return <NotificationsContext value={value}>{children}</NotificationsContext>;
}

export function useNotifications() {
  const context = use(NotificationsContext);

  if (context === undefined) {
    throw new Error("useNotifications必须在NotificationsProvider内部使用");
  }

  return context;
}
