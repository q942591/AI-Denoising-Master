import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { userTable } from "../users/tables";

// 通知表
export const notificationsTable = pgTable("notifications", {
  // 时间戳
  createdAt: timestamp("created_at").defaultNow().notNull(),

  description: text("description").notNull(), // 通知描述
  // 关联实体信息
  entityId: text("entity_id"),
  entityType: text("entity_type"),
  // 基本信息
  id: text("id").primaryKey(),
  // 通知状态
  isRead: boolean("is_read").notNull().default(false), // 是否已读
  // 元数据
  metadata: jsonb("metadata"), // 额外元数据（JSON对象）

  // 通知内容
  title: text("title").notNull(), // 通知标题
  type: text("type").notNull().default("info"), // 通知类型

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // 关联信息
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }), // 关联用户
});
