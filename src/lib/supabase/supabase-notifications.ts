import type { Notification } from "~/db/schema";

import { createSupabaseClient } from "~/lib/supabase/client";

type NotificationCallback = (params: NotificationCallbackParams) => void;

interface NotificationCallbackParams {
  eventType: "DELETE" | "INSERT" | "UPDATE";
  new?: Notification;
  old?: Notification;
}

/**
 * 通知实时订阅服务
 * 使用Supabase Realtime功能实现通知的实时更新
 */
export const notificationsRealtime = {
  /**
   * 订阅用户通知变更
   * @param userId 用户ID
   * @param callback 回调函数，当通知变更时触发
   * @returns 取消订阅的函数
   */
  subscribeToUserNotifications(userId: string, callback: NotificationCallback) {
    const supabase = createSupabaseClient();

    // 创建通道名称，确保唯一性
    const channelName = `notifications:${userId}`;

    // 创建实时订阅
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*", // 监听所有事件类型（插入、更新、删除）
          filter: `user_id=eq.${userId}`, // 只订阅特定用户的通知
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          // 根据事件类型处理回调
          const eventType = payload.eventType as "DELETE" | "INSERT" | "UPDATE";
          callback({
            eventType,
            new: payload.new as Notification,
            old: payload.old as Notification,
          });
        },
      )
      .subscribe();

    // 返回取消订阅的函数
    return () => {
      supabase.removeChannel(channel);
    };
  },
};
