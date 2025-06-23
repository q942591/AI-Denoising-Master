import { relations } from "drizzle-orm";

import { userTable } from "../users/tables";
import { notificationsTable } from "./tables";

// 定义通知表与其他表的关系
export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
  // 一个通知属于一个用户
  user: one(userTable, {
    fields: [notificationsTable.userId],
    references: [userTable.id],
  }),
}));