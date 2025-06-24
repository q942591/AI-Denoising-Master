import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// 用户扩展信息表 - 存储Supabase Auth之外的业务特定字段
// Supabase Auth已经管理了：email, email_verified, name, avatar, created_at等基础认证信息
export const userTable = pgTable("user", {
  bio: text("bio"), // 用户简介
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // 业务扩展字段
  displayName: text("display_name"), // 用户显示名称（可能与Supabase Auth的name不同）

  // 基础字段
  id: text("id").primaryKey(), // 对应Supabase Auth的用户ID
  // 业务状态
  isActive: integer("is_active").default(1).notNull(), // 账户是否激活（业务层面）

  lastLoginAt: timestamp("last_login_at"), // 最后登录时间
  // 使用偏好设置
  preferredLocale: text("preferred_locale").default("en"), // 偏好语言

  theme: text("theme").default("system"), // 主题偏好: light, dark, system
  totalCreditsUsed: integer("total_credits_used").default(0).notNull(), // 总积分使用量

  // 统计信息
  totalUploads: integer("total_uploads").default(0).notNull(), // 总上传次数
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 以下表已删除，因为Supabase Auth已经管理：
// - sessionTable: Supabase管理所有会话
// - accountTable: Supabase管理OAuth和本地账户
// - verificationTable: Supabase管理邮箱验证
// - twoFactorTable: Supabase支持MFA管理
