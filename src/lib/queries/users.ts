import "server-only";

import type { User as SupabaseUser } from "@supabase/supabase-js";

import { eq } from "drizzle-orm";

import type { User } from "~/db/schema/users/types";
import type { UserProfile } from "~/db/schema/users/types";

import { db } from "~/db";
import { userTable } from "~/db/schema";

// 根据用户ID获取完整用户信息（Supabase + 扩展信息）
export async function getFullUser(supabaseUser: SupabaseUser): Promise<User> {
  const profile = await getUserProfile(supabaseUser.id);
  return mergeSupabaseUserWithProfile(supabaseUser, profile);
}

/**
 * Fetches a user from the database by their ID.
 * @param userId - The ID of the user to fetch.
 * @returns The user object or null if not found.
 */
export async function getUserById(userId: string): Promise<null | User> {
  try {
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
    });
    return user ?? null; // Return user or null if undefined
  } catch (error) {
    console.error("Failed to fetch user by ID:", error);
    return null;
  }
}

// 根据用户ID获取用户扩展信息
export async function getUserProfile(
  userId: string,
): Promise<null | UserProfile> {
  try {
    const [profile] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));

    return profile || null;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return null;
  }
}

// 增加用户统计信息
export async function incrementUserStats(
  userId: string,
  stats: {
    creditsUsedIncrement?: number;
    uploadsIncrement?: number;
  },
): Promise<void> {
  try {
    const { creditsUsedIncrement = 0, uploadsIncrement = 0 } = stats;

    // 先获取当前统计信息
    const currentProfile = await getUserProfile(userId);
    const currentUploads = currentProfile?.totalUploads || 0;
    const currentCreditsUsed = currentProfile?.totalCreditsUsed || 0;

    await upsertUserProfile(userId, {
      totalCreditsUsed: currentCreditsUsed + creditsUsedIncrement,
      totalUploads: currentUploads + uploadsIncrement,
    });
  } catch (error) {
    console.error("Failed to increment user stats:", error);
  }
}

// 合并Supabase用户和扩展信息为完整用户对象
export function mergeSupabaseUserWithProfile(
  supabaseUser: SupabaseUser,
  profile: null | UserProfile,
): User {
  return {
    email: supabaseUser.email,
    emailVerified: !!supabaseUser.email_confirmed_at,
    id: supabaseUser.id,
    image:
      supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture,
    name:
      supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
    profile: profile || undefined,
  };
}

// 更新用户最后登录时间
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await upsertUserProfile(userId, {
      lastLoginAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to update last login:", error);
  }
}

// 创建或更新用户扩展信息
export async function upsertUserProfile(
  userId: string,
  profileData: Partial<Omit<UserProfile, "createdAt" | "id" | "updatedAt">>,
): Promise<null | UserProfile> {
  try {
    const existingProfile = await getUserProfile(userId);

    if (existingProfile) {
      // 更新现有资料
      const [updatedProfile] = await db
        .update(userTable)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, userId))
        .returning();

      return updatedProfile;
    }

    // 创建新资料
    const [newProfile] = await db
      .insert(userTable)
      .values({
        id: userId,
        ...profileData,
      })
      .returning();

    return newProfile;
  } catch (error) {
    console.error("Failed to upsert user profile:", error);
    return null;
  }
}
