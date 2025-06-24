import type { InferSelectModel } from "drizzle-orm";

import type { userTable } from "./tables";

// 完整用户类型（结合Supabase Auth用户信息）
export interface User {
  email?: string;
  emailVerified?: boolean;
  // Supabase Auth字段
  id: string;
  image?: string;
  name?: string;
  // 业务扩展字段
  profile?: UserProfile;
}

// 用户扩展信息类型（不包含Supabase Auth的字段）
export type UserProfile = InferSelectModel<typeof userTable>;
