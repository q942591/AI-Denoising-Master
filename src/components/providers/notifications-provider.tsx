"use client";

import { createContext, use, useCallback, useEffect, useState } from "react";

import type { Notification } from "~/db/schema";

import { useSupabase } from "~/components/providers/SupabaseProvider";
import { createSupabaseClient } from "~/lib/supabase/client";
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

  // 使用 supabase 直接查询加载用户通知
  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`加载通知失败: ${error.message}`);
      }

      setNotifications(data || []);
    } catch (error) {
      console.error("加载通知失败:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 使用 supabase 标记通知为已读
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const supabase = createSupabaseClient();

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw new Error(`标记通知已读失败: ${error.message}`);

      // 实时订阅会自动更新本地状态，这里不需要手动更新
    } catch (error) {
      console.error("标记通知已读失败:", error);
    }
  };

  // 使用 supabase 标记所有通知为已读
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const supabase = createSupabaseClient();

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false); // 只更新未读的通知

      if (error) throw new Error(`标记所有通知已读失败: ${error.message}`);

      // 实时订阅会自动更新本地状态，这里不需要手动更新
    } catch (error) {
      console.error("标记所有通知已读失败:", error);
    }
  };

  // 使用 supabase 删除通知
  const dismissNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      const supabase = createSupabaseClient();

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw new Error(`删除通知失败: ${error.message}`);

      // 实时订阅会自动更新本地状态，这里不需要手动更新
    } catch (error) {
      console.error("删除通知失败:", error);
    }
  };

  // 使用 supabase 清除所有通知
  const clearAllNotifications = async () => {
    if (!user) return;

    try {
      const supabase = createSupabaseClient();

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) throw new Error(`清除所有通知失败: ${error.message}`);

      // 实时订阅会自动更新本地状态，这里不需要手动更新
    } catch (error) {
      console.error("清除所有通知失败:", error);
    }
  };

  // 刷新通知 - 现在主要依赖实时订阅，但保留手动刷新功能
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
