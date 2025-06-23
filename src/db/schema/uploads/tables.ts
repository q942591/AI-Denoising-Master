import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { userTable } from "../users/tables";

export const mediaTypeEnum = pgEnum("type", ["image", "video"]);

export const uploadsTable = pgTable("uploads", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  id: text("id").primaryKey(),
  path: text("path").notNull(), // Supabase Storage file path
  type: mediaTypeEnum("type").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  url: text("url").notNull(), // Supabase Storage file URL
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});
