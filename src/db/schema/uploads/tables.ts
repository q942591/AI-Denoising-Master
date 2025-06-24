import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { userTable } from "../users/tables";

// 媒体类型枚举
export const mediaTypeEnum = pgEnum("media_type", [
  "image",
  "video",
  "audio",
  "document",
]);

// 上传状态枚举
export const uploadStatusEnum = pgEnum("upload_status", [
  "uploading", // 上传中
  "completed", // 已完成
  "failed", // 失败
  "processing", // 处理中
]);

// 上传文件表 - 增强版本
export const uploadsTable = pgTable("uploads", {
  bucketName: varchar("bucket_name", { length: 100 }).default("uploads"), // 存储桶名称
  // 时间戳
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // 文件信息
  fileName: varchar("file_name", { length: 255 }).notNull(), // 原始文件名
  fileSize: integer("file_size").notNull(), // 文件大小（字节）
  // 基础信息
  id: text("id").primaryKey(),
  // 处理相关（用于AI生成等）
  isProcessed: boolean("is_processed").default(false), // 是否已处理

  metadata: jsonb("metadata"), // 额外元数据（文件信息、EXIF数据等）
  mimeType: varchar("mime_type", { length: 100 }).notNull(), // MIME类型
  // 存储信息
  path: text("path").notNull(), // Supabase Storage文件路径

  processingError: text("processing_error"), // 处理错误信息
  // 状态和元数据
  status: uploadStatusEnum("status").notNull().default("completed"),

  type: mediaTypeEnum("type").notNull(), // 媒体类型
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  url: text("url").notNull(), // Supabase Storage文件URL
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});
