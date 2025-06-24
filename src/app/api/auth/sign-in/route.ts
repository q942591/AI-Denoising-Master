import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { db } from "~/db";
import { userTable } from "~/db/schema";
import { checkAndGrantDailyReward } from "~/lib/daily-login-reward";
import { createSupabaseServerClient } from "~/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    // 尝试登录
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const { user } = data;

    if (user) {
      // 确保用户存在于数据库中
      try {
        const existingUser = await db.query.userTable.findFirst({
          where: eq(userTable.id, user.id),
        });

        if (!existingUser) {
          // 创建新用户记录
          await db.insert(userTable).values({
            displayName:
              user.user_metadata?.name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "User",
            id: user.id,
            lastLoginAt: new Date(),
            preferredLocale: "en",
          });
          console.log("Created new user record for:", user.id);
        } else {
          // 更新最后登录时间
          await db
            .update(userTable)
            .set({
              displayName:
                user.user_metadata?.name ||
                user.user_metadata?.full_name ||
                existingUser.displayName,
              lastLoginAt: new Date(),
            })
            .where(eq(userTable.id, user.id));
          console.log("Updated login time for existing user:", user.id);
        }

        // 检查并发放每日登录奖励
        await checkAndGrantDailyReward(user.id);
      } catch (dbError) {
        console.error("Database error during user creation/update:", dbError);
        // 不阻止登录流程
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
