import { relations } from "drizzle-orm";

import { uploadsTable } from "../uploads/tables";
import { userTable } from "./tables";

// 用户表关系定义
export const userRelations = relations(userTable, ({ many }) => ({
  uploads: many(uploadsTable), // 用户的上传文件
  // 其他关系由各自的业务模块定义：
  // - credits: 在credits/relations.ts中定义
  // - notifications: 在notifications/relations.ts中定义
  // - payments: 在payments/relations.ts中定义
  // - generations: 在generations/relations.ts中定义
}));
