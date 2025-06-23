import type { InferSelectModel } from "drizzle-orm";

import type { notificationsTable } from "./tables";

// 创建通知的输入类型
export type CreateNotificationInput = Omit<
  Notification,
  "createdAt" | "id" | "isRead" | "updatedAt"
>;

// 通知类型
export type Notification = InferSelectModel<typeof notificationsTable>;

// 更新通知的输入类型
export type UpdateNotificationInput = Partial<
  Omit<Notification, "createdAt" | "id" | "updatedAt" | "userId">
>;